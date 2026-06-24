import crypto from 'crypto';

// Generates a 6-digit random numeric string securely
export const generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString();
};