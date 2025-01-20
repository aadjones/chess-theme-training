const request = require('supertest');
const app = require('../server'); // We need to modify server.js to export app

describe('API Endpoints', () => {
  it('GET / - should return welcome message', async () => {
    const res = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.message).toBe('Welcome to Chess Review App API');
  });

  it('POST /api/test/user - should create a new user', async () => {
    const res = await request(app)
      .post('/api/test/user')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body.message).toBe('Test user created successfully');
    expect(res.body.userId).toBeDefined();
  });
}); 