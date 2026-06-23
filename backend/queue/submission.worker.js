// Worker handler - called by BullMQ when a submission job is picked up
// Delegates actual judging to the judge service
import { processSubmission as judgeProcess } from '../services/judge.service.js';
import logger from '../utils/logger.js';

export const processSubmission = async (job) => {
    const { submissionId } = job.data;
    logger.info('Worker', `Picked up submission: ${submissionId}`);

    try {
        await judgeProcess(submissionId);
        logger.info('Worker', `Finished judging submission: ${submissionId}`);
        return { submissionId, status: 'judged' };
    } catch (error) {
        logger.error('Worker', `Sandbox crash on submission ${submissionId}`, error);
        throw error;
    }
};