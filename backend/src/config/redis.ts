import Redis from 'ioredis';

import { env } from './env';

export const redis = new Redis(env.redisUrl);

redis.on('connect', () => console.log('[redis] connected'));
redis.on('error', (error) => console.error('[redis] error', error));
