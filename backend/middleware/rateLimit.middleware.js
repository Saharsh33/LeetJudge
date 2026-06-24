import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redisConnection from '../config/redis.js';

// rate limiting middleware using Redis
export const apiLimiter = process.env.NODE_ENV === 'test' 
    ? (req, res, next) => next() 
    : rateLimit({
        windowMs: process.env.RATE_LIMIT_GLOBAL_WINDOW_MS || 15 * 60 * 1000,
        max: process.env.RATE_LIMIT_GLOBAL_MAX || 100,
        standardHeaders: true,
        legacyHeaders: false,
        message: { error: 'Too many requests from this IP, please try again later' },
        store: new RedisStore({
            // @ts-expect-error - Known issue with @types/ioredis
            sendCommand: (...args) => redisConnection.call(...args),
        }),
    });

// Stricter rate limiter for sensitive routes like auth or submissions
export const strictLimiter = process.env.NODE_ENV === 'test'
    ? (req, res, next) => next()
    : rateLimit({
        windowMs: process.env.RATE_LIMIT_STRICT_WINDOW_MS || 5 * 60 * 1000,
        max: process.env.RATE_LIMIT_STRICT_MAX || 20,
        standardHeaders: true,
        legacyHeaders: false,
        message: { error: 'Too many requests, please try again later' },
        store: new RedisStore({
            // @ts-expect-error
            sendCommand: (...args) => redisConnection.call(...args),
        }),
    });