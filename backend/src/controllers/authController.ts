import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { pool } from '../config/db';
import { env } from '../config/env';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  organisation: z.string().min(2),
  role: z.enum(['owner', 'admin', 'member']).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export async function register(req: Request, res: Response) {
  const payload = registerSchema.parse(req.body);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orgResult = await client.query(
      'INSERT INTO organisations (name) VALUES ($1) RETURNING id',
      [payload.organisation]
    );

    const organisationId = orgResult.rows[0].id as string;
    const passwordHash = await bcrypt.hash(payload.password, 10);

    const userResult = await client.query(
      `INSERT INTO users (organisation_id, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, role`,
      [organisationId, payload.email, passwordHash, payload.role ?? 'owner']
    );

    await client.query('COMMIT');

    const token = jwt.sign(
      {
        userId: userResult.rows[0].id,
        organisationId,
        role: userResult.rows[0].role
      },
      env.jwtSecret,
      { expiresIn: '7d' }
    );

    return res.status(201).json({ token });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[auth] register error', error);
    return res.status(500).json({ message: 'Unable to register user' });
  } finally {
    client.release();
  }
}

export async function login(req: Request, res: Response) {
  const payload = loginSchema.parse(req.body);

  const userResult = await pool.query(
    'SELECT id, organisation_id, password_hash, role FROM users WHERE email = $1',
    [payload.email]
  );

  if (userResult.rowCount === 0) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const user = userResult.rows[0];
  const match = await bcrypt.compare(payload.password, user.password_hash);

  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      organisationId: user.organisation_id,
      role: user.role
    },
    env.jwtSecret,
    { expiresIn: '7d' }
  );

  return res.json({ token });
}
