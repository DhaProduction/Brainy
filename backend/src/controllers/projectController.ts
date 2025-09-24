import { Request, Response } from 'express';
import { z } from 'zod';

import { pool } from '../config/db';

const createSchema = z.object({
  name: z.string().min(2),
  prompt: z.string().optional(),
  flow: z.array(z.any()).optional()
});

export async function listProjects(req: Request, res: Response) {
  if (!req.auth) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }

  const result = await pool.query(
    'SELECT id, name, prompt, flow, created_at FROM projects WHERE organisation_id = $1 ORDER BY created_at DESC',
    [req.auth.organisationId]
  );

  return res.json(result.rows);
}

export async function createProject(req: Request, res: Response) {
  if (!req.auth) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }

  const payload = createSchema.parse(req.body);

  const result = await pool.query(
    `INSERT INTO projects (organisation_id, name, prompt, flow)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, prompt, flow, created_at`,
    [req.auth.organisationId, payload.name, payload.prompt ?? '', JSON.stringify(payload.flow ?? [])]
  );

  return res.status(201).json(result.rows[0]);
}

export async function updateProject(req: Request, res: Response) {
  if (!req.auth) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }

  const payload = createSchema.partial().parse(req.body);
  const projectId = req.params.projectId;

  const result = await pool.query(
    `UPDATE projects SET name = COALESCE($1, name), prompt = COALESCE($2, prompt), flow = COALESCE($3, flow)
     WHERE id = $4 AND organisation_id = $5
     RETURNING id, name, prompt, flow, created_at`,
    [payload.name, payload.prompt, payload.flow ? JSON.stringify(payload.flow) : undefined, projectId, req.auth.organisationId]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Project not found' });
  }

  return res.json(result.rows[0]);
}

export async function deleteProject(req: Request, res: Response) {
  if (!req.auth) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }

  const projectId = req.params.projectId;

  const result = await pool.query('DELETE FROM projects WHERE id = $1 AND organisation_id = $2', [projectId, req.auth.organisationId]);
  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Project not found' });
  }

  return res.status(204).send();
}
