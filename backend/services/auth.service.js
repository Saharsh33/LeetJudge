// Auth service - uses repository layer for DB access and utility functions for hashing/tokens
// Pattern: Service Layer pattern - business logic lives here, data access is delegated to repositories
import * as accountRepo from '../repositories/account.repository.js';
import { hashPassword, comparePassword } from '../utils/password.util.js';
import { generateToken } from '../utils/jwt.util.js';

export const signupService = async ({ name, username, email, password }) => {
    // Check if email is already taken
    const existingEmail = await accountRepo.findByEmail(email);
    if (existingEmail) {
        throw new Error('User with this email already exists');
    }

    // Check if username is already taken
    const existingUsername = await accountRepo.findByUsername(username);
    if (existingUsername) {
        throw new Error('User with this username already exists');
    }

    const passwordHash = await hashPassword(password);

    const newUser = await accountRepo.create({
        name,
        username,
        email,
        passwordHash,
        role: 'USER'
    });

    // Strip the password hash before returning
    delete newUser.password_hash;
    return newUser;
};

export const loginService = async (email, password) => {
    const user = await accountRepo.findByEmail(email);

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    const token = generateToken({ id: user.id, role: user.role });

    // Strip the password hash before returning
    delete user.password_hash;

    return { user, token };
};

export const getMeService = async (userId) => {
    const user = await accountRepo.findById(userId);
    if (user) {
        delete user.password_hash;
    }
    return user;
};