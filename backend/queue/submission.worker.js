// import { executeInSandbox } from '../sandbox/docker.js';

export const processSubmission = async (submissionId) => {
    console.log(`Picked up submission: ${submissionId}`);
    // console.log(`Details: Lang: ${job.data.language}, User: ${job.data.userId}`);

    try {
        // const executionResult = await executeInSandbox(job.data.code, job.data.language);
        // Get Submission from DB, run it through the sandbox, and update the DB with results
        // Simulating execution for now
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { verdict: 'Accepted', time: '45ms', memory: '12MB' };

    } catch (error) {
        console.error(`Sandbox crash on submission ${submissionId}:`, error);
        throw error; 
    }
};