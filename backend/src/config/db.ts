import { Pool } from 'pg';

import { env } from './env';

export const pool = new Pool({ connectionString: env.postgresUrl });

export async function initDb() {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    CREATE TABLE IF NOT EXISTS organisations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      organisation_id UUID REFERENCES organisations(id),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'member',
      minutes_consumed INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS voice_profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      organisation_id UUID REFERENCES organisations(id),
      display_name TEXT NOT NULL,
      metadata JSONB DEFAULT '{}',
      storage_path TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS projects (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      organisation_id UUID REFERENCES organisations(id),
      name TEXT NOT NULL,
      prompt TEXT,
      flow JSONB DEFAULT '[]',
      created_at TIMESTAMPTZ DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS webhooks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      organisation_id UUID REFERENCES organisations(id),
      project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
      target_url TEXT NOT NULL,
      event TEXT NOT NULL,
      secret TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `);
}
