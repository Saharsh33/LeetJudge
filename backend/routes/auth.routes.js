import express from 'express';
import { signup, login, getMe } from '../controllers/auth.controller.js';
import { validateSignup, validateLogin } from '../validators/auth.validator.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.get("/me", authenticate, getMe);

export default router;