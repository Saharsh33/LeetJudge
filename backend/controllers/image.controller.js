import { getImageFileService } from '../services/storage.service.js';

export const serveImage = async (req, res) => {
    try {
        const imagePath = req.path.replace(/^\//, '');
        const { buffer, contentType } = await getImageFileService(imagePath);

        res.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
        res.set('Content-Type', contentType);
        res.send(buffer);
    } catch (error) {
        const status = error.message.includes('not found') ? 404 : 500;
        res.status(status).json({ error: error.message || 'Failed to load image' });
    }
};
