const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../../server');
const { createTestUser } = require('../helpers');

describe('Auth Middleware', () => {
  let token;
  let user;

  beforeEach(async () => {
    user = await createTestUser();
    token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET
    );
  });

  // Test route that requires authentication
  it('should allow access with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.username).toBe(user.username);
  });

  it('should deny access without token', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .expect(401);

    expect(res.body.error).toBe('No token provided');
  });

  it('should deny access with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', 'Bearer invalid_token')
      .expect(401);

    expect(res.body.error).toBe('Invalid token');
  });
}); 