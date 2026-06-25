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

export const update = async (problemId, { title, description, tags, difficulty, timelimit, memorylimit }) => {
    const result = await query(
        `
        UPDATE problems
        SET title = $1, description = $2, tags = $3, difficulty = $4, timelimit = $5, memorylimit = $6
        WHERE id = $7
        RETURNING *
        `,
        [title, description, tags, difficulty, timelimit, memorylimit, problemId]
    );
    return result.rows[0];
};

export const deleteProblem = async (problemId) => {
    const result = await query(
        `
        DELETE FROM problems
        WHERE id = $1
        RETURNING id
        `,
        [problemId]
    );
    return result.rows[0];
};

export const addEditor = async (problemId, userId) => {
    const result = await query(
        `
        INSERT INTO problem_editors (problem_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (problem_id, user_id) DO NOTHING
        RETURNING *
        `,
        [problemId, userId]
    );
    return result.rows[0];
};

export const getEditors = async (problemId) => {
    const result = await query(
        `
        SELECT user_id FROM problem_editors
        WHERE problem_id = $1
        `,
        [problemId]
    );
    return result.rows.map(row => row.user_id);
};