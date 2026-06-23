import * as problemService from '../services/problem.service.js';

export const getProblems = async (req, res) => {
    try {
        const problems = await problemService.getAllProblems();
        res.status(200).json({ problems });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createProblem = async (req, res) => {
    try {
        const { title, description, tags, difficulty, timelimit, memorylimit } = req.body;
        const createdBy = req.user.id;

        if (!title || !description || !difficulty || !timelimit || !memorylimit) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const validTimeLimits = [500, 1000, 2000, 5000];
        const validMemoryLimits = [65536, 131072, 262144, 524288];

        if (!validTimeLimits.includes(Number(timelimit))) {
            return res.status(400).json({ error: "Invalid time limit" });
        }

        if (!validMemoryLimits.includes(Number(memorylimit))) {
            return res.status(400).json({ error: "Invalid memory limit" });
        }

        if (tags && !Array.isArray(tags)) {
            return res.status(400).json({ error: "Tags must be an array" });
        }

        const newProblem = await problemService.createProblemService({
            title, description, tags, difficulty, createdBy, timelimit, memorylimit
        });

        res.status(201).json({ message: "Problem created successfully", problem: newProblem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addTestCases = async (req, res) => {
    try {
        const { problemId } = req.params;
        const { testCases } = req.body;

        if (!Array.isArray(testCases) || testCases.length === 0) {
            return res.status(400).json({ error: "Test cases must be a non-empty array" });
        }

        const addedTestCases = await problemService.addTestCasesService(problemId, testCases);
        res.status(201).json({ message: "Test cases added successfully", testCases: addedTestCases });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProblemById = async (req, res) => {
    try {
        const { problemId } = req.params;
        const problem = await problemService.getProblemByIdService(problemId);

        if (!problem) {
            return res.status(404).json({ error: "Problem not found" });
        }

        res.status(200).json({ problem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};