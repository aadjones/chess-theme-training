const mongoose = require('mongoose');
const User = require('../models/User');

describe('User Model Test', () => {
  it('should create & save user successfully', async () => {
    const validUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpass123'
    });
    const savedUser = await validUser.save();
    
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(validUser.username);
    expect(savedUser.email).toBe(validUser.email);
    expect(savedUser.password).not.toBe('testpass123'); // Should be hashed
  });

  it('should fail to save user without required fields', async () => {
    const userWithoutRequiredField = new User({ username: 'test' });
    let err;
    
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
}); 