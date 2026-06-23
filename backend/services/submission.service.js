// Submission service - handles creating submissions and queuing them for judging
// Pattern: Service Layer pattern - orchestrates business logic for submission lifecycle
import * as submissionRepo from '../repositories/submission.repository.js';
import * as problemRepo from '../repositories/problem.repository.js';
import { enqueueSubmission } from '../queue/redis.queue.js';
import logger from '../utils/logger.js';

export const createSubmissionService = async ({ userId, problemId, code, lang }) => {
    // Validate problem exists before accepting submission
    const problem = await problemRepo.findById(problemId);
    if (!problem) {
        throw new Error('Problem not found');
    }

    const submission = await submissionRepo.create({
        userId,
        problemId,
        code,
        language: lang
    });

    logger.debug('SubmissionService', `Submission ${submission.id} created for problem ${problemId}`);

    // Push submission onto the judge queue for async processing
    // Wrapped in try/catch so submission creation still succeeds even if queue is down
    try {
        await enqueueSubmission(submission.id);
    } catch (queueError) {
        logger.error('SubmissionService', 'Failed to enqueue submission for judging', queueError.message);
    }

    return submission;
};

export const getSubmissionByIdService = async (submissionId) => {
    return submissionRepo.findById(submissionId);
};

export const getMySubmissionsService = async (userId) => {
    return submissionRepo.findByUserId(userId);
};

export const getUserSubmissionsForProblemService = async (userId, problemId) => {
    return submissionRepo.findByUserAndProblem(userId, problemId);
};