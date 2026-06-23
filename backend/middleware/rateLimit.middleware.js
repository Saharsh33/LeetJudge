import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redisConnection from '../config/redis.js';

// rate limiting middleware using Redis
export const apiLimiter = rateLimit({
    // 15 minutes
    windowMs: 15 * 60 * 1000,
    // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    max: 100,
    // Return rate limit info in the `RateLimit-*` headers
    standardHeaders: true,
    // Disable the `X-RateLimit-*` headers
    legacyHeaders: false,
    message: {
        error: 'Too many requests from this IP, please try again after 15 minutes'
    },
    // Redis store configuration
    store: new RedisStore({
        // @ts-expect-error - Known issue with @types/ioredis
        sendCommand: (...args) => redisConnection.call(...args),
    }),
});

// Stricter rate limiter for sensitive routes like auth or submissions
export const strictLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 20, // Limit each IP to 20 requests per 5 minutes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many requests, please try again later'
    },
    store: new RedisStore({
        // @ts-expect-error
        sendCommand: (...args) => redisConnection.call(...args),
    }),
});