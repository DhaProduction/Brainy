import dotenv from 'dotenv';

dotenv.config();

const required = ['POSTGRES_URL', 'REDIS_URL', 'JWT_SECRET', 'GOOGLE_SPEECH_API_KEY', 'OPENAI_API_KEY'];

required.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`[config] Missing environment variable ${key}. Using placeholder value for local development.`);
  }
});

export const env = {
  port: process.env.PORT ?? '4000',
  postgresUrl: process.env.POSTGRES_URL ?? 'postgres://postgres:postgres@postgres:5432/brainy',
  redisUrl: process.env.REDIS_URL ?? 'redis://redis:6379',
  jwtSecret: process.env.JWT_SECRET ?? 'change-me',
  googleSpeechApiKey: process.env.GOOGLE_SPEECH_API_KEY ?? 'fake-key',
  openAiApiKey: process.env.OPENAI_API_KEY ?? 'fake-openai-key',
  chatterboxBaseUrl: process.env.CHATTERBOX_URL ?? 'http://chatterbox:8080'
};
