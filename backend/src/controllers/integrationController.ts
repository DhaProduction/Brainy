import { Request, Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';

import { pool } from '../config/db';

const webhookSchema = z.object({
  projectId: z.string().uuid(),
  targetUrl: z.string().url(),
  event: z.enum(['lead.qualified', 'call.transfer', 'call.summary'])
});

export async function listWebhooks(req: Request, res: Response) {
  if (!req.auth) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }

  const result = await pool.query(
    'SELECT id, project_id, target_url, event, created_at FROM webhooks WHERE organisation_id = $1',
    [req.auth.organisationId]
  );

  return res.json(result.rows);
}

export async function createWebhook(req: Request, res: Response) {
  if (!req.auth) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }

  const payload = webhookSchema.parse(req.body);
  const secret = crypto.randomBytes(24).toString('hex');

  const result = await pool.query(
    `INSERT INTO webhooks (organisation_id, project_id, target_url, event, secret)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, project_id, target_url, event, secret, created_at`,
    [req.auth.organisationId, payload.projectId, payload.targetUrl, payload.event, secret]
  );

  return res.status(201).json(result.rows[0]);
}

export async function deleteWebhook(req: Request, res: Response) {
  if (!req.auth) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }

  const webhookId = req.params.webhookId;

  const result = await pool.query('DELETE FROM webhooks WHERE id = $1 AND organisation_id = $2', [webhookId, req.auth.organisationId]);

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Webhook not found' });
  }

  return res.status(204).send();
}
