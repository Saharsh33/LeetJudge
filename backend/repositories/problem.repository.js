import db from './config/database.js';

export const create = async ({
    title,
    description,
    tags,
    difficulty,
    createdBy,
    timeLimitMs,
    memoryLimitKb
}) => {
    const result = await db.query(
        `
        INSERT INTO problems
        (
            title,
            description,
            tags,
            difficulty,
            created_by,
            time_limit_ms,
            memory_limit_kb
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [
            title,
            description,
            tags,
            difficulty,
            createdBy,
            timeLimitMs,
            memoryLimitKb
        ]
    );

    return result.rows[0];
};

export const findById = async (problemId) => {
    const result = await db.query(
        `
        SELECT *
        FROM problems
        WHERE id = $1
        `,
        [problemId]
    );

    return result.rows[0];
};

export const findAll = async (limit, offset) => {
    const result = await db.query(
        `
        SELECT
            id,
            title,
            difficulty
        FROM problems
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
        `,
        [limit, offset]
    );

    return result.rows;
};