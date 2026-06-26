import { warmLiveContestCaches } from '../services/contestCache.service.js';
import logger from '../utils/logger.js';

const INTERVAL_MS = (Number(process.env.CONTEST_CACHE_WARMUP_INTERVAL_SEC) || 60) * 1000;

export const startContestCacheWarmup = () => {
    warmLiveContestCaches().catch((err) => {
        logger.error('ContestCache', 'Initial warmup failed', err);
    });

    setInterval(() => {
        warmLiveContestCaches().catch((err) => {
            logger.error('ContestCache', 'Warmup failed', err);
        });
    }, INTERVAL_MS);

    logger.info('ContestCache', `Warmup scheduler started (every ${INTERVAL_MS / 1000}s)`);
};
