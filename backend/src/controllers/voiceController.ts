import { Request, Response } from 'express';
import { z } from 'zod';

import { pool } from '../config/db';
import { redis } from '../config/redis';
import { createVoiceClone, requestTts } from '../services/chatterboxService';
import { runVoicePipeline } from '../services/pipelineService';

const ttsSchema = z.object({
  text: z.string().min(1),
  voiceProfileId: z.string().uuid(),
  emotion: z.record(z.number()).default({ warmth: 0.5 }),
  speakingRate: z.number().min(0.5).max(2).optional()
});

const pipelineSchema = z.object({
  audioBase64: z.string(),
  projectId: z.string().uuid(),
  voiceProfileId: z.string().uuid(),
  emotion: z.record(z.number()).default({ warmth: 0.5 })
});

export async function listVoices(req: Request, res: Response) {
  if (!req.auth) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }

  const cacheKey = `voices:${req.auth.organisationId}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  const result = await pool.query(
    'SELECT id, display_name, metadata, created_at FROM voice_profiles WHERE organisation_id = $1',
    [req.auth.organisationId]
  );

  await redis.setex(cacheKey, 60, JSON.stringify(result.rows));
  return res.json(result.rows);
}

export async function uploadVoice(req: Request, res: Response) {
  if (!req.auth) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Audio sample is required' });
  }

  const cloneResponse = await createVoiceClone(req.auth.organisationId, req.file.buffer, {
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    duration_hint_seconds: req.body.duration ?? 10
  });

  const result = await pool.query(
    `INSERT INTO voice_profiles (organisation_id, display_name, metadata, storage_path)
     VALUES ($1, $2, $3, $4)
     RETURNING id, display_name, metadata, created_at`,
    [
      req.auth.organisationId,
      req.body.displayName ?? req.file.originalname,
      JSON.stringify(cloneResponse.metadata ?? {}),
      cloneResponse.storage_path
    ]
  );

  await redis.del(`voices:${req.auth.organisationId}`);
  return res.status(201).json(result.rows[0]);
}

export async function generateTts(req: Request, res: Response) {
  const payload = ttsSchema.parse(req.body);
  const audioBuffer = await requestTts({
    text: payload.text,
    voiceProfileId: payload.voiceProfileId,
    emotion: payload.emotion,
    speakingRate: payload.speakingRate
  });

  res.setHeader('Content-Type', 'audio/mpeg');
  return res.send(Buffer.from(audioBuffer));
}

export async function runPipeline(req: Request, res: Response) {
  if (!req.auth) {
    return res.status(401).json({ message: 'Unauthenticated' });
  }

  const payload = pipelineSchema.parse(req.body);
  const projectResult = await pool.query(
    'SELECT prompt FROM projects WHERE id = $1 AND organisation_id = $2',
    [payload.projectId, req.auth.organisationId]
  );

  if (projectResult.rowCount === 0) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const response = await runVoicePipeline({
    audioBase64: payload.audioBase64,
    prompt: projectResult.rows[0].prompt ?? '',
    voiceProfileId: payload.voiceProfileId,
    organisationId: req.auth.organisationId,
    emotion: payload.emotion
  });

  return res.json({
    transcript: response.transcript,
    reply: response.llm.reply,
    metadata: response.llm.meta,
    audioBase64: Buffer.from(response.audio).toString('base64')
  });
}
