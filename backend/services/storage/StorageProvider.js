// StorageProvider Interface
export class StorageProvider {
    /**
     * Uploads a file to the storage and returns the public URL.
     * @param {Object} file - The file object (usually from multer)
     * @returns {Promise<string>} - The public URL of the uploaded file
     */
    async uploadFile(file) {
        throw new Error("Method 'uploadFile()' must be implemented.");
    }

    /**
     * @param {Object} fileId
     * @returns {Promise<void>}
     */
    async deleteFile(fileId) {
        throw new Error("Method 'deleteFile()' must be implemented.");
    }

    /**
     * @param {string} filePath
     * @returns {Promise<{ buffer: Buffer, contentType: string }>}
     */
    async getFile(filePath) {
        throw new Error("Method 'getFile()' must be implemented.");
    }
}
