// Repository pattern - batch insert for test cases, plus lookup by problem
import { query } from '../config/database.js';

export const createMany = async (problemId, testCases) => {
    const values = [];
    const placeholders = [];

    testCases.forEach((testCase, index) => {
        const offset = index * 3;

        placeholders.push(
            `($${offset + 1}, $${offset + 2}, $${offset + 3})`
        );

        values.push(
            problemId,
            testCase.input,
            testCase.output
        );
    });

    const result = await query(
        `
        INSERT INTO test_cases
        (
            problem_id,
            input,
            output
        )
        VALUES
        ${placeholders.join(",")}
        RETURNING *
        `,
        values
    );

    return result.rows;
};

export const findByProblemId = async (problemId) => {
    const result = await query(
        `
        SELECT *
        FROM test_cases
        WHERE problem_id = $1
        ORDER BY id
        `,
        [problemId]
    );

    return result.rows;
};