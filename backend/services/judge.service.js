// handles the complete judging process
// coordinating between sandbox and database
import * as submissionRepo from '../repositories/submission.repository.js';
import * as problemRepo from '../repositories/problem.repository.js';
import * as testcaseRepo from '../repositories/testcase.js';
import * as sandbox from './sandbox.service.js';
import Verdict from '../models/verdict.js';
import logger from '../utils/logger.js';

// starting judging process
export const processSubmission = async (submissionId) => {
    // getting submission
    const submission = await submissionRepo.findById(submissionId);
    if (!submission) {
        logger.error('Judge', `Submission ${submissionId} not found`);
        return;
    }

    logger.info('Judge', `Processing submission ${submissionId}`);

    // setting status to compiling
    await submissionRepo.updateVerdict(submissionId, {
        verdict: Verdict.COMPILING,
        verdictMessage: 'Compiling...',
        executionTimeMs: null,
        memoryUsedKb: null,
        errorTestCase: null,
        expectedOutput: null,
        actualOutput: null
    });

    const problem = await problemRepo.findById(submission.problem_id);
    if (!problem) {
        await submissionRepo.updateVerdict(submissionId, {
            verdict: Verdict.INTERNAL_ERROR,
            verdictMessage: 'Problem not found',
            executionTimeMs: null,
            memoryUsedKb: null,
            errorTestCase: null,
            expectedOutput: null,
            actualOutput: null
        });
        return;
    }

    const testCases = await testcaseRepo.findByProblemId(submission.problem_id);
    if (!testCases || testCases.length === 0) {
        await submissionRepo.updateVerdict(submissionId, {
            verdict: Verdict.INTERNAL_ERROR,
            verdictMessage: 'No test cases found for this problem',
            executionTimeMs: null,
            memoryUsedKb: null,
            errorTestCase: null,
            expectedOutput: null,
            actualOutput: null
        });
        return;
    }

    // testing against testcases
    const verdictResult = await judgeSubmission(
        submission.code,
        submission.lang,
        testCases,
        problem.timelimit,
        problem.memorylimit
    );

    // Persist the final verdict
    await submissionRepo.updateVerdict(submissionId, verdictResult);
};

// executing testcases
export const judgeSubmission = async (code, langId, testCases, timeLimitMs, memoryLimitKb) => {
    let maxExecutionTime = 0;

    for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];

        // running the code
        const result = await sandbox.run(code, langId, tc.input, timeLimitMs, memoryLimitKb);

        if (!result.success) {
            // checking failure reason
            return generateVerdict(result.reason, i + 1, tc.output, result.stderr || '', result.executionTimeMs || 0);
        }

        // updating max execution time
        if (result.executionTimeMs > maxExecutionTime) {
            maxExecutionTime = result.executionTimeMs;
        }

        // checking time limit
        if (result.executionTimeMs > timeLimitMs) {
            return generateVerdict(
                Verdict.TIME_LIMIT_EXCEEDED,
                i + 1,
                tc.output,
                result.stdout,
                result.executionTimeMs
            );
        }

        // matching output
        const outputMatches = compareOutputs(result.stdout, tc.output);
        if (!outputMatches) {
            return generateVerdict(
                Verdict.WRONG_ANSWER,
                i + 1,
                tc.output,
                result.stdout,
                maxExecutionTime
            );
        }
    }

    // passed all testcases
    return {
        verdict: Verdict.ACCEPTED,
        verdictMessage: `All ${testCases.length} test cases passed`,
        executionTimeMs: maxExecutionTime,
        memoryUsedKb: null, // would require OS-level memory tracking
        errorTestCase: null,
        expectedOutput: null,
        actualOutput: null
    };
};

// matching outputs
export const compareOutputs = (actual, expected) => {
    if (!actual && !expected) return true;
    if (!actual || !expected) return false;

    // cleaning up spaces
    const normalizeOutput = (output) => {
        return output
            .split('\n')
            .map(line => line.trimEnd())
            .join('\n')
            .trimEnd();
    };

    return normalizeOutput(actual) === normalizeOutput(expected);
};

// creating verdict object
export const generateVerdict = (reason, testCaseNumber, expectedOutput, actualOutput, executionTimeMs) => {
    return {
        verdict: reason,
        verdictMessage: reason === 'COMPILATION_ERROR' ? actualOutput : `Failed on test case ${testCaseNumber}`,
        executionTimeMs: executionTimeMs || 0,
        memoryUsedKb: null,
        errorTestCase: testCaseNumber,
        expectedOutput: expectedOutput || null,
        actualOutput: actualOutput || null
    };
};