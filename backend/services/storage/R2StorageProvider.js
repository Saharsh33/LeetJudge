import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { StorageProvider } from './StorageProvider.js';
import crypto from 'crypto';
import path from 'path';

export class R2StorageProvider extends StorageProvider {
    constructor() {
        super();
        this.s3Client = new S3Client({
            region: 'auto',
            endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
            },
        });
        this.bucketName = process.env.R2_BUCKET_NAME;
        this.publicUrl = process.env.R2_PUBLIC_URL; // e.g. https://pub-xxxx.r2.dev
    }

    async uploadFile(file) {
        // Generate a unique filename to prevent collisions
        const fileExt = path.extname(file.originalname);
        const fileName = `${crypto.randomUUID()}${fileExt}`;

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await this.s3Client.send(command);

        // Return the public URL
        return `${this.publicUrl}/${fileName}`;
    }
}
