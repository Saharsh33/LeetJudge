import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { StorageProvider } from './StorageProvider.js';

export class LocalStorageProvider extends StorageProvider {
    constructor() {
        super();
        this.uploadDir = path.join(process.cwd(), 'uploads');
        // Ensure the directory exists
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
        this.baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    }

    async uploadFile(file) {
        const fileExt = path.extname(file.originalname);
        const fileName = `${crypto.randomUUID()}${fileExt}`;
        const filePath = path.join(this.uploadDir, fileName);

        await fs.promises.writeFile(filePath, file.buffer);

        // Return a relative URL. The frontend will prepend the backend domain.
        const url = `/uploads/${fileName}`;
        return {
            url,
            fileId: { path: filePath }
        };
    }

    async deleteFile(fileId) {
        if (!fileId || !fileId.path) {
            console.warn("deleteFile called without valid fileId");
            return;
        }

        try {
            if (fs.existsSync(fileId.path)) {
                await fs.promises.unlink(fileId.path);
            }
        } catch (error) {
            console.error(`Failed to delete file at ${fileId.path}:`, error);
        }
    }
}
