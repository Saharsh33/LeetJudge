import { query } from '../config/database.js';

export const create = async (email, otp, expiresAt) => {
    const result = await query(
        `INSERT INTO otps (email, otp, expires_at) VALUES ($1, $2, $3) RETURNING *`,
        [email, otp, expiresAt]
    );
    return result.rows[0];
};

export const findLatestByEmail = async (email) => {
    const result = await query(
        `SELECT * FROM otps WHERE email = $1 ORDER BY created_at DESC LIMIT 1`,
        [email]
    );
    return result.rows[0];
};

export const deleteExpired = async () => {
    await query(`DELETE FROM otps WHERE expires_at < NOW()`);
};