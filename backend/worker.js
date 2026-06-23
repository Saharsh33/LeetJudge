import 'dotenv/config';
import { Worker } from 'bullmq';
import redisConnection from './config/redis.js';
import { processSubmission } from './queue/submission.worker.js';
import logger from './utils/logger.js';

const submissionWorker = new Worker(
  'judge_queue',
  processSubmission,
  {
    connection: redisConnection,
    concurrency: 5,
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 }
  }
);

submissionWorker.on('completed', (job, result) => {
  logger.info('Worker', `Job ${job.id} completed`, result);
});

submissionWorker.on('failed', (job, err) => {
  logger.error('Worker', `Job ${job.id} failed permanently: ${err.message}`);
});

logger.info('Worker', 'Submission Worker is active and listening to Redis...');