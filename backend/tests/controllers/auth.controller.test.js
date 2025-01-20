const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');
const { createTestUser } = require('../helpers');

describe('Auth Controller', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'newuser',
        email: 'new@user.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('username', userData.username);
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should not register a user with existing username', async () => {
      // Create a user first
      await createTestUser({ username: 'existinguser', email: 'existing@user.com' });

      const userData = {
        username: 'existinguser',
        email: 'another@user.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body.error).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const password = 'password123';
      const user = await createTestUser({ password });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: password
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('username', user.username);
    });

    it('should not login with incorrect password', async () => {
      const user = await createTestUser();

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'wrongpassword'
        })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(res.body.error).toBeDefined();
    });
  });
}); 