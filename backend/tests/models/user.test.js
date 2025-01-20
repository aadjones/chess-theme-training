const mongoose = require('mongoose');
const User = require('../../models/User');

describe('User Model', () => {
  describe('Schema', () => {
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

    it('should fail to save duplicate username', async () => {
      const user1 = new User({
        username: 'sameuser',
        email: 'user1@test.com',
        password: 'password123'
      });
      await user1.save();

      const user2 = new User({
        username: 'sameuser',
        email: 'user2@test.com',
        password: 'password123'
      });

      let err;
      try {
        await user2.save();
      } catch (error) {
        err = error;
      }
      expect(err).toBeDefined();
      expect(err.code).toBe(11000); // MongoDB duplicate key error
    });
  });

  describe('Methods', () => {
    it('should correctly hash password', async () => {
      const user = new User({
        username: 'hashtest',
        email: 'hash@test.com',
        password: 'mypassword'
      });
      await user.save();
      
      expect(user.password).not.toBe('mypassword');
      expect(user.password).toHaveLength(60); // bcrypt hash length
    });

    it('should correctly compare passwords', async () => {
      const user = new User({
        username: 'comparetest',
        email: 'compare@test.com',
        password: 'mypassword'
      });
      await user.save();

      const isMatch = await user.comparePassword('mypassword');
      const isNotMatch = await user.comparePassword('wrongpassword');

      expect(isMatch).toBe(true);
      expect(isNotMatch).toBe(false);
    });
  });

  describe('Default Values', () => {
    it('should set default ratings', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
      await user.save();

      // Check overall rating
      expect(user.ratings.overall.rating).toBe(1500);
      expect(user.ratings.overall.rd).toBe(350);
      expect(user.ratings.overall.vol).toBe(0.06);

      // Check theme ratings
      const themes = ['tactics', 'endgame', 'opening', 'middlegame', 'defense', 'attack', 'calculation', 'positional'];
      themes.forEach(theme => {
        expect(user.ratings.themes[theme].rating).toBe(1500);
        expect(user.ratings.themes[theme].rd).toBe(350);
        expect(user.ratings.themes[theme].vol).toBe(0.06);
      });
    });
  });

  describe('Puzzle History', () => {
    it('should add puzzle attempt with rating changes', async () => {
      const user = new User({
        username: 'puzzletest',
        email: 'puzzle@test.com',
        password: 'password123'
      });
      
      const puzzleAttempt = {
        puzzleId: new mongoose.Types.ObjectId(),
        solved: true,
        timeSpent: 45,
        ratingChanges: {
          overall: 15,
          themes: new Map([
            ['tactics', 12],
            ['calculation', 8]
          ])
        }
      };

      user.puzzleHistory.push(puzzleAttempt);
      await user.save();

      expect(user.puzzleHistory).toHaveLength(1);
      expect(user.puzzleHistory[0].solved).toBe(true);
      expect(user.puzzleHistory[0].timeSpent).toBe(45);
      expect(user.puzzleHistory[0].ratingChanges.overall).toBe(15);
      expect(user.puzzleHistory[0].ratingChanges.themes.get('tactics')).toBe(12);
      expect(user.puzzleHistory[0].ratingChanges.themes.get('calculation')).toBe(8);
    });
  });
}); 