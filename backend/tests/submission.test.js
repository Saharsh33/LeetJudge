import request from 'supertest';
import app from '../app.js';
import { pool } from '../config/database.js';
import { generateToken } from '../utils/jwt.util.js';

describe('Submission Endpoints', () => {
    let userToken = '';
    let userId = '';
    let problemId = '';
    let submissionId = '';

    beforeAll(async () => {
        const probRes = await pool.query(
            "INSERT INTO problems (title, description, difficulty, timelimit, memorylimit) VALUES ('Sub Test Problem', 'Test Description', 'EASY', 1000, 256) RETURNING id"
        );
        problemId = probRes.rows[0].id;

        const uniqueSuffix = Date.now();
        const userRes = await pool.query(
            "INSERT INTO accounts (name, username, email) VALUES ('Sub User', $1, $2) RETURNING id",
            ['subuser_' + uniqueSuffix, 'subuser_' + uniqueSuffix + '@test.com']
        );
        userId = userRes.rows[0].id;

        userToken = generateToken({ id: userId, role: 'USER' });
    });

    afterAll(async () => {
        await pool.query('DELETE FROM submissions WHERE user_id = $1', [userId]).catch(() => {});
        await pool.query('DELETE FROM problems WHERE id = $1', [problemId]).catch(() => {});
        await pool.query('DELETE FROM accounts WHERE id = $1', [userId]).catch(() => {});
    });

    it('should submit code successfully', async () => {
        const res = await request(app)
            .post('/api/submissions')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                problemId: problemId,
                code: 'print("Hello")',
                lang: 71
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.submission).toHaveProperty('id');
        submissionId = res.body.submission.id;
    });

    it('should fetch submission by id', async () => {
        const res = await request(app)
            .get(`/api/submissions/${submissionId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.submission.id).toEqual(submissionId);
    });

    it('should fetch my submissions', async () => {
        const res = await request(app)
            .get('/api/submissions/mySubmissions')
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body.submissions)).toBeTruthy();
        expect(res.body.submissions.length).toBeGreaterThan(0);
    });

    it('should reject submission without auth', async () => {
        const res = await request(app)
            .post('/api/submissions')
            .send({
                problemId: problemId,
                code: 'print("Hello")',
                lang: 71
            });

        expect(res.statusCode).toEqual(401);
    });
});
