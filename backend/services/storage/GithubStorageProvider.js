import { StorageProvider } from './StorageProvider.js';
import crypto from 'crypto';
import path from 'path';

export class GithubStorageProvider extends StorageProvider {
    constructor() {
        super();
        this.token = process.env.GITHUB_TOKEN;
        this.repo = process.env.GITHUB_REPO; // format: 'username/repo'
        this.branch = process.env.GITHUB_BRANCH || 'main';
        
        if (!this.token || !this.repo) {
            console.warn("WARNING: GITHUB_TOKEN or GITHUB_REPO not provided. GithubStorageProvider will fail if used.");
        }
    }

    async uploadFile(file) {
        if (!this.token || !this.repo) {
            throw new Error("GitHub storage is not configured properly (missing GITHUB_TOKEN or GITHUB_REPO).");
        }

        const fileExt = path.extname(file.originalname);
        const fileName = `${crypto.randomUUID()}${fileExt}`;
        const uploadPath = `images/${fileName}`; // Store in an 'images' folder in the repo

        // GitHub API requires file content to be Base64 encoded
        const contentBase64 = file.buffer.toString('base64');

        const url = `https://api.github.com/repos/${this.repo}/contents/${uploadPath}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'LeetJudge-Storage-App'
            },
            body: JSON.stringify({
                message: `Upload image ${fileName} via LeetJudge`,
                content: contentBase64,
                branch: this.branch
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            console.error("GitHub API Error:", errData);
            throw new Error(`Failed to upload to GitHub: ${response.statusText}`);
        }

        const responseData = await response.json();
        const sha = responseData.content?.sha;

        // Return the jsDelivr URL for fast CDN delivery
        // Format: https://cdn.jsdelivr.net/gh/user/repo@branch/file
        const resultUrl = `https://cdn.jsdelivr.net/gh/${this.repo}@${this.branch}/${uploadPath}`;
        
        return {
            url: resultUrl,
            fileId: { path: uploadPath, sha }
        };
    }

    async deleteFile(fileId) {
        if (!this.token || !this.repo) {
            throw new Error("GitHub storage is not configured properly.");
        }
        
        if (!fileId || !fileId.path || !fileId.sha) {
            console.warn("deleteFile called without valid fileId (missing path or sha)");
            return;
        }

        const url = `https://api.github.com/repos/${this.repo}/contents/${fileId.path}`;

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'LeetJudge-Storage-App'
            },
            body: JSON.stringify({
                message: `Delete image ${fileId.path} via LeetJudge`,
                sha: fileId.sha,
                branch: this.branch
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            console.error("GitHub API Delete Error:", errData);
            throw new Error(`Failed to delete from GitHub: ${response.statusText}`);
        }
    }
}
