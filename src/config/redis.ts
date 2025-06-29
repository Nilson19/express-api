import { env } from './env';
import { createClient } from 'redis';


export const redisClient = createClient({
  url: env.redisUrl,
});

redisClient.on('error', (err) => console.error('❌ Redis error:', err));

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log('✅ Redis connected');
  }
}
