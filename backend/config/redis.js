import Redis from 'ioredis';
import logger from '../utils/logger.js';

const redisConnection = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  retryStrategy(times) {
    if (process.env.NODE_ENV === 'test') {
      return null;
    }
    return Math.min(times * 50, 2000);
  }
});

redisConnection.on('connect', () => logger.info('Redis', 'Connected successfully'));
redisConnection.on('error', (err) => logger.error('Redis', 'Connection error', err));

export default redisConnection;