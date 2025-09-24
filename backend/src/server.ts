import 'express-async-errors';

import cors from 'cors';
import express from 'express';

import { initDb } from './config/db';
import { env } from './config/env';
import './config/redis';
import authRoutes from './routes/authRoutes';
import integrationRoutes from './routes/integrationRoutes';
import projectRoutes from './routes/projectRoutes';
import voiceRoutes from './routes/voiceRoutes';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/voices', voiceRoutes);
app.use('/api/integrations', integrationRoutes);

app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[server] unhandled error', error);
  res.status(500).json({ message: 'Internal server error' });
});

initDb()
  .then(() => {
    app.listen(Number(env.port), () => {
      console.log(`🚀 Brainy backend running on port ${env.port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialise database', error);
    process.exit(1);
  });
