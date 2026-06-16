import db from './config/database.js';

export const create = async ({
    userId,
    problemId,
    code,
    language
}) => {
    const result = await db.query(
        `
        INSERT INTO submissions
        (
            user_id,
            problem_id,
            code,
            lang
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [
            userId,
            problemId,
            code,
            language
        ]
    );

    return result.rows[0];
};

export const findById = async (submissionId) => {
    const result = await db.query(
        `
        SELECT *
        FROM submissions
        WHERE id = $1
        `,
        [submissionId]
    );

    return result.rows[0];
};

export const findByUserId = async (userId) => {
    const result = await db.query(
        `
        SELECT *
        FROM submissions
        WHERE user_id = $1
        ORDER BY timestamp DESC
        `,
        [userId]
    );

    return result.rows;
};

export const findByUserAndProblem = async (
    userId,
    problemId
) => {
    const result = await db.query(
        `
        SELECT *
        FROM submissions
        WHERE user_id = $1
        AND problem_id = $2
        ORDER BY timestamp DESC
        `,
        [userId, problemId]
    );

    return result.rows;
};

export const updateVerdict = async (
    submissionId,
    {
        verdict,
        verdictMessage,
        executionTimeMs,
        memoryUsedKb,
        errorTestCase,
        expectedOutput,
        actualOutput
    }
) => {
    const result = await db.query(
        `
        UPDATE submissions
        SET
            verdict = $1,
            verdict_message = $2,
            execution_time_ms = $3,
            memory_used_kb = $4,
            error_test_case = $5,
            expected_output = $6,
            actual_output = $7
        WHERE id = $8
        RETURNING *
        `,
        [
            verdict,
            verdictMessage,
            executionTimeMs,
            memoryUsedKb,
            errorTestCase,
            expectedOutput,
            actualOutput,
            submissionId
        ]
    );

    return result.rows[0];
};