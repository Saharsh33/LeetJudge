import express from 'express';
import { signup, login, getMe } from '../controllers/auth.controller';
import { getProblems, getProblemById, getSubmitById, createProblem, addTestCases} from '../controllers/problem.controller'
import { submitCode, getSubmissionById, getMySubmissions, getMySubmissionsForProblem} from '../controllers/submission.controller';


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", getMe);

router.get("/problems", getProblems);
router.get("/problems/problemId", getProblemById);
router.post("/problems", createProblem);
router.post("/problems/problemId/testcases", addTestCases);

router.post("/submissions", submitCode);
router.get("/submissions/submissionsId", getSubmissionById);
router,get("/submissions/me", getMySubmissions)
router.get("submissions/problemId/userId", getMySubmissionsForProblem);