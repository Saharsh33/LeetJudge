// Side-effect import - loads .env BEFORE any other module evaluates
// This must be the very first import because ESM hoists all imports
import 'dotenv/config';
import express from 'express';
import logger from './utils/logger.js';
import { fileURLToPath } from 'url';
import { pool, query } from './config/database.js';
import  redisConnection  from './config/redis.js';
import authRoutes from './routes/auth.routes.js';
import problemRoutes from './routes/problem.routes.js';
import submissionRoutes from './routes/submission.routes.js';
import otpRoutes from './routes/otp.routes.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';
const app = express();
app.set('trust proxy', 1); // Extract IP from X-Forwarded-For to prevent blocking all docker traffic as one IP
const PORT = process.env.PORT || 3000;
import cors from 'cors';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('HTTP', `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });
    next();
});

// Routes
// Apply global rate limiting to all API routes
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/otp', otpRoutes);
// Basic Route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'LeetJudge API is running' });
});

// Bootstrap application
const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
    app.listen(PORT, () => {
        logger.info('App', `Server is running on port ${PORT}`);
    });
}

export default app;
