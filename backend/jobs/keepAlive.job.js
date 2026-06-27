import axios from 'axios';
import logger from '../utils/logger.js';

export const startKeepAlive = () => {
    // The public URL of the backend (e.g. on Render)
    const backendUrl = process.env.NEXT_PUBLIC_API_URL 
        ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') 
        : 'https://leetjudge-backend.onrender.com';

    // Ping every 14 minutes (840000 ms) to prevent Render free tier from sleeping (sleeps after 15 mins)
    const PING_INTERVAL = 14 * 60 * 1000;

    setInterval(async () => {
        try {
            const url = `${backendUrl}/health`;
            logger.info('KeepAlive', `Pinging backend to prevent cold start: ${url}`);
            await axios.get(url);
        } catch (error) {
            logger.error('KeepAlive', `Ping failed: ${error.message}`);
        }
    }, PING_INTERVAL);

    logger.info('KeepAlive', 'Keep-alive self-request system started.');
};
