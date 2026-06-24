import { generateOtp } from '../utils/otp.util.js';
import * as otpRepo from '../repositories/otp.repository.js';
import { sendOtpEmail } from './email.service.js';

export const sendOtp = async (email) => {
    const otp = generateOtp();
    const expirationMinutes = parseInt(process.env.OTP_EXPIRATION_MINUTES || 10);
    const expiresAt = new Date(Date.now() + expirationMinutes * 60000);
    
    await otpRepo.create(email, otp, expiresAt);
    await sendOtpEmail(email, otp);
    
    return true;
};

export const verifyOtp = async (email, otp) => {
    const record = await otpRepo.findLatestByEmail(email);
    
    if (!record) {
        throw new Error("No OTP found for this email.");
    }
    
    if (new Date() > new Date(record.expires_at)) {
        throw new Error("OTP has expired.");
    }
    
    if (record.otp !== otp) {
        throw new Error("Invalid OTP.");
    }
    
    return true;
};