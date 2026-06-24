import express from 'express';
import { sendOtp, verifyOtp } from '../controllers/otp.controller.js';
import { validateSendOtp, validateVerifyOtp } from '../validators/otp.validator.js';

const router = express.Router();

router.post("/send", validateSendOtp, sendOtp);
router.post("/verify", validateVerifyOtp, verifyOtp);

export default router;