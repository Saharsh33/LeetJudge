import * as contestRepo from '../repositories/contest.repository.js';
import { getProblemByIdService } from './problem.service.js';
import { getCacheValue, setCacheValue, clearCache } from '../middleware/cache.middleware.js';
import logger from '../utils/logger.js';

export const contestProblemsCacheKey = (contestId) => `cache:contest:${contestId}:problems`;

export const problemDetailCacheKey = (problemId) => `cache:/api/problems/${problemId}`;

export const isContestLive = (contest) => {
    if (!contest) return false;
    const now = Date.now();
    return now >= new Date(contest.start_time).getTime() && now <= new Date(contest.end_time).getTime();
};

export const getContestCacheTtl = (contest) => {
    const maxTtl = Number(process.env.CACHE_TTL_CONTEST_PROBLEMS) || 3600;
    const secondsUntilEnd = Math.floor((new Date(contest.end_time).getTime() - Date.now()) / 1000);
    if (secondsUntilEnd <= 0) return 60;
    return Math.min(maxTtl, secondsUntilEnd);
};

export const clearContestCache = async (contestId) => {
    await clearCache(contestProblemsCacheKey(contestId));

    const problems = await contestRepo.getProblems(contestId);
    await Promise.all(
        problems.map((p) => clearCache(problemDetailCacheKey(p.id || p.problem_id)))
    );
};

export const warmContestCache = async (contestId, contestMeta = null) => {
    const contest = contestMeta || await contestRepo.findById(contestId);
    if (!isContestLive(contest)) return false;

    const ttl = getContestCacheTtl(contest);
    const listKey = contestProblemsCacheKey(contestId);
    const problems = await contestRepo.getProblems(contestId);

    await setCacheValue(listKey, problems, ttl);

    for (const problem of problems) {
        const problemId = problem.id || problem.problem_id;
        const detailKey = problemDetailCacheKey(problemId);
        const cachedDetail = await getCacheValue(detailKey);
        if (cachedDetail) continue;

        const fullProblem = await getProblemByIdService(problemId);
        if (fullProblem) {
            await setCacheValue(detailKey, { problem: fullProblem }, ttl);
        }
    }

    logger.info('ContestCache', `Warmed cache for live contest ${contestId} (${problems.length} problems, ttl=${ttl}s)`);
    return true;
};

export const warmLiveContestCaches = async () => {
    const liveContests = await contestRepo.findLiveContests();
    for (const contest of liveContests) {
        const listKey = contestProblemsCacheKey(contest.id);
        const existing = await getCacheValue(listKey);
        if (!existing) {
            await warmContestCache(contest.id, contest);
        }
    }
};
