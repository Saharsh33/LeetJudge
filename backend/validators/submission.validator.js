// Validates submission payloads
import Language from '../models/language.js';

export const validateSubmission = (req, res, next) => {
    const { problemId, code, lang } = req.body;

    if (!problemId || !code || lang === undefined) {
        return res.status(400).json({
            error: 'Required fields: problemId, code, lang'
        });
    }

    // Validate that lang is a known language id
    const validLangIds = Object.values(Language).map(l => l.id);
    if (!validLangIds.includes(lang)) {
        return res.status(400).json({
            error: `Invalid language id. Must be one of: ${validLangIds.join(', ')}`
        });
    }

    next();
};