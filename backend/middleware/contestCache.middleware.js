import { getContestByIdService } from '../services/contest.service.js';
import {
    contestProblemsCacheKey,
    getContestCacheTtl,
    isContestLive,
} from '../services/contestCache.service.js';
import { getCacheValue, setCacheValue } from './cache.middleware.js';
import logger from '../utils/logger.js';

export const cacheContestProblemsIfLive = async (req, res, next) => {
    if (req.method !== 'GET') {
        return next();
    }

    try {
        const contest = await getContestByIdService(req.params.contestId);
        if (!isContestLive(contest)) {
            return next();
        }

        const key = contestProblemsCacheKey(contest.id);
        const cached = await getCacheValue(key);
        if (cached) {
            logger.debug('ContestCache', `Cache hit for ${key}`);
            return res.status(200).json(cached);
        }

        const ttl = getContestCacheTtl(contest);
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                setCacheValue(key, body, ttl).catch((err) => {
                    logger.error('ContestCache', 'Redis set error', err);
                });
            }
            return originalJson(body);
        };

        return next();
    } catch {
        return next();
    }
};
