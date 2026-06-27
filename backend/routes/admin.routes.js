import express from 'express';
import { updateRole, getAnalytics } from '../controllers/admin.controller.js';
import { authenticate, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

router.put('/role', authenticate, requireRole(['ADMIN']), updateRole);
router.get('/analytics', authenticate, requireRole(['ADMIN']), getAnalytics);

router.get('/storage-status', (req, res) => {
    res.json({
        storageProviderEnv: process.env.STORAGE_PROVIDER,
        hasGithubToken: !!process.env.GITHUB_TOKEN,
        githubRepo: process.env.GITHUB_REPO,
        nodeEnv: process.env.NODE_ENV
    });
});

export default router;
