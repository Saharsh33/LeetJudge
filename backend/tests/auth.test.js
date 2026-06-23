import request from 'supertest';
import app from '../app.js';
import { pool } from '../config/database.js';

describe('Auth Endpoints', () => {
    const testUser = {
        name: 'Test User',
        username: 'testuser_' + Date.now(),
        email: 'testuser_' + Date.now() + '@example.com',
        password: 'password123'
    };
    let token = '';

    afterAll(async () => {
        await pool.query('DELETE FROM accounts WHERE email = $1', [testUser.email]).catch(() => {});
    });

    it('should sign up a new user', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send(testUser);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user.email).toEqual(testUser.email);
    });

    it('should reject duplicate signup', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send(testUser);

        expect(res.statusCode).toEqual(400);
    });

    it('should login the user and return a token', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    it('should fetch the current logged in user', async () => {
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.user.email).toEqual(testUser.email);
    });

    it('should fail to fetch current user without token', async () => {
        const res = await request(app)
            .get('/api/auth/me');

        expect(res.statusCode).toEqual(401);
    });

    it('should fail to fetch current user with bad token', async () => {
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', 'Bearer totally-invalid-token');

        expect(res.statusCode).toEqual(401);
    });
});
