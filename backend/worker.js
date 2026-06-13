import { Worker } from 'bullmq';
import { redisConnection } from './config/redis.js';
import { processSubmission } from './queue/submission.worker.js';

// 1. Initialize the Worker using the separated logic
const submissionWorker = new Worker(
  'judge_queue', 
  processSubmission, // Points to the function in submission.worker.js
  {
    connection: redisConnection,
    concurrency: 5,
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 }
  }
);

// 2. Lifecycle Event Listeners
submissionWorker.on('completed', (jobId, result) => {
  console.log(`Job ${jobId} completed. Verdict: ${result.verdict}`);
});

submissionWorker.on('failed', (jobId, err) => {
  console.log(`Job ${jobId} failed permanently. Error: ${err.message}`);
});

console.log('Submission Worker is active and listening to Redis...');