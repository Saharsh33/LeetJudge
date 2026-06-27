
import { LocalStorageProvider } from './storage/LocalStorageProvider.js';
import { GithubStorageProvider } from './storage/GithubStorageProvider.js';

let storageProvider;

// Factory to initialize the correct storage provider
const providerStr = (process.env.STORAGE_PROVIDER || '').toLowerCase().trim();

if (providerStr === 'github') {
    if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_REPO) {
        console.warn("[Storage] WARNING: GitHub credentials not fully provided. Falling back to LocalStorageProvider.");
        storageProvider = new LocalStorageProvider();
    } else {
        console.log("[Storage] Initialized GithubStorageProvider successfully.");
        storageProvider = new GithubStorageProvider();
    }
} else {
    console.log(`[Storage] Initialized LocalStorageProvider (STORAGE_PROVIDER='${process.env.STORAGE_PROVIDER}')`);
    storageProvider = new LocalStorageProvider();
}

/**
 * Service to handle file uploads
 * @param {Object} file - file object from multer
 * @returns {Promise<{ url: string, fileId: any }>} object containing public URL and provider-specific ID
 */
export const uploadImageService = async (file) => {
    if (!file) {
        throw new Error('No file provided for upload');
    }
    
    // Ensure it's an image
    if (!file.mimetype.startsWith('image/')) {
        throw new Error('Only image files are allowed');
    }

    return storageProvider.uploadFile(file);
};

/**
 * Service to handle file deletions
 * @param {Object} fileId - provider-specific file ID
 * @returns {Promise<void>}
 */
export const deleteImageService = async (fileId) => {
    if (!fileId) return;
    return storageProvider.deleteFile(fileId);
};

export const getImageFileService = async (imagePath) => {
    if (!imagePath || imagePath.includes('..')) {
        throw new Error('Invalid image path');
    }

    if (!(storageProvider instanceof GithubStorageProvider)) {
        throw new Error('Image proxy is only available when GitHub storage is enabled');
    }

    return storageProvider.getFile(imagePath);
};
