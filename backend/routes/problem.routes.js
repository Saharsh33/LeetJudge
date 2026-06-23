import express from 'express';
import { getProblems, getProblemById, createProblem, addTestCases } from '../controllers/problem.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';
import { validateCreateProblem, validateTestCases } from '../validators/problem.validator.js';
import { cacheMiddleware } from '../middleware/cache.middleware.js';

const router = express.Router();

router.get("/", cacheMiddleware(60), getProblems);
router.post("/", authenticate, requireRole(['ADMIN', 'PROBLEM_SETTER']), validateCreateProblem, createProblem);
router.post("/:problemId/testcases", authenticate, requireRole(['ADMIN', 'PROBLEM_SETTER']), validateTestCases, addTestCases);
router.get("/:problemId", cacheMiddleware(300), getProblemById);

export default router;