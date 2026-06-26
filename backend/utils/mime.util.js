const MIME_BY_EXT = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
};

export const getMimeTypeFromPath = (filePath) => {
    const ext = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
    return MIME_BY_EXT[ext] || 'application/octet-stream';
};
