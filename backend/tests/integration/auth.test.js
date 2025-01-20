const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');

describe('Authentication API', () => {
  describe('POST /api/test/user', () => {
    it('should create a new test user', async () => {
      const res = await request(app)
        .post('/api/test/user')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.message).toBe('Test user created successfully');
      expect(res.body.userId).toBeDefined();

      // Verify user was actually created in database
      const user = await User.findById(res.body.userId);
      expect(user).toBeDefined();
      expect(user.username).toBe('testuser');
    });

    it('should handle errors appropriately', async () => {
      // Create a user first
      await request(app).post('/api/test/user');

      // Try to create the same user again
      const res = await request(app)
        .post('/api/test/user')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body.error).toBeDefined();
    });
  });
}); 