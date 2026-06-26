import express from 'express';
import { serveImage } from '../controllers/image.controller.js';

const router = express.Router();

router.get(/.+/, serveImage);

export default router;
