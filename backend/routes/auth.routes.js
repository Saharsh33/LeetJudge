import express from 'express';
import { signup, login, getMe } from '../controllers/auth.controller.js';
import { validateSignup, validateLogin } from '../validators/auth.validator.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { strictLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

router.post("/signup", strictLimiter, validateSignup, signup);
router.post("/login", strictLimiter, validateLogin, login);
router.get("/me", authenticate, getMe);

export default router;