// Repository pattern - all data access for the problems table lives here
import { query } from '../config/database.js';

export const create = async ({
    title,
    description,
    tags,
    difficulty,
    createdBy,
    timelimit,
    memorylimit
}) => {
    const result = await query(
        `
        INSERT INTO problems
        (
            title,
            description,
            tags,
            difficulty,
            created_by,
            timelimit,
            memorylimit
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
            timelimit,
            memorylimit
        ]
    );

    return result.rows[0];
};

export const findById = async (problemId) => {
    const result = await query(
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
    const result = await query(
        `
        SELECT
            id,
            title,
            difficulty,
            tags,
            timelimit,
            memorylimit,
            created_at
        FROM problems
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
        `,
        [limit, offset]
    );

    return result.rows;
};