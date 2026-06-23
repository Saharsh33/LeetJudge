// Redis-backed queue for async submission processing using BullMQ
import { Queue } from 'bullmq';
import redisConnection from '../config/redis.js';
import logger from '../utils/logger.js';

export const judgeQueue = new Queue('judge_queue', {
    connection: redisConnection
});

export const enqueueSubmission = async (submissionId) => {
    await judgeQueue.add('submission', { submissionId });
    logger.info('Queue', `Job added to queue: ${submissionId}`);
};