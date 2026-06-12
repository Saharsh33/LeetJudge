const request = require('supertest');
const app = require('../app');

describe('Health Check API', () => {
    it('should return 200 and health status', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: 'ok',
            message: 'LeetJudge API is running'
        });
    });
});
