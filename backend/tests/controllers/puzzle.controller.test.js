const request = require('supertest');
const app = require('../../server');
const Puzzle = require('../../models/Puzzle');
const { createTestUser } = require('../helpers');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

describe('Puzzle Controller', () => {
  let token;
  let user;

  beforeEach(async () => {
    // Create test user and get token
    user = await createTestUser();
    token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET
    );

    // Add some test puzzles
    await Puzzle.create([
      {
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        solution: ['e2e4', 'e7e5', 'f1c4', 'b8c6'],
        difficulty: 'beginner',
        theme: ['opening', 'development'],
        rating: 1200,
        rd: 50,
        vol: 0.06,
        source: 'custom'
      },
      {
        fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1',
        solution: ['f3e5', 'c6e5', 'd1h5', 'g7g6'],
        difficulty: 'intermediate',
        theme: ['tactics', 'pin'],
        rating: 1500,
        rd: 50,
        vol: 0.06,
        source: 'custom'
      }
    ]);
  });

  describe('GET /api/puzzles', () => {
    it('should fetch puzzles with pagination', async () => {
      const res = await request(app)
        .get('/api/puzzles?page=1&limit=10')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.puzzles).toHaveLength(2);
      expect(res.body.total).toBe(2);
      expect(res.body.page).toBe(1);
    });

    it('should filter puzzles by difficulty', async () => {
      const res = await request(app)
        .get('/api/puzzles?difficulty=beginner')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.puzzles).toHaveLength(1);
      expect(res.body.puzzles[0].difficulty).toBe('beginner');
    });

    it('should filter puzzles by theme', async () => {
      const res = await request(app)
        .get('/api/puzzles?theme=tactics')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.puzzles).toHaveLength(1);
      expect(res.body.puzzles[0].theme).toContain('tactics');
    });
  });

  describe('POST /api/puzzles/attempt', () => {
    let puzzle;

    beforeEach(async () => {
      puzzle = await Puzzle.create({
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        solution: ['e2e4', 'e7e5', 'f1c4', 'b8c6'],
        difficulty: 'beginner',
        theme: ['tactics', 'opening'],
        rating: 1200,
        rd: 50,
        vol: 0.06,
        source: 'custom'
      });
    });

    it('should record successful puzzle attempt with rating changes', async () => {
      const res = await request(app)
        .post('/api/puzzles/attempt')
        .set('Authorization', `Bearer ${token}`)
        .send({
          puzzleId: puzzle._id,
          moves: ['e2e4', 'e7e5', 'f1c4', 'b8c6'],
          timeSpent: 45
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.newRating).toBeDefined();
      expect(res.body.ratingChange).toBeDefined();
      expect(res.body.themeRatingChanges).toBeDefined();
      expect(res.body.themeRatingChanges.tactics).toBeDefined();
      expect(res.body.themeRatingChanges.opening).toBeDefined();

      // Verify user rating updates
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.ratings.overall.rating).toBeDefined();
      expect(updatedUser.ratings.overall.rd).toBeDefined();
      expect(updatedUser.ratings.overall.vol).toBeDefined();
      
      // Verify theme ratings
      expect(updatedUser.ratings.themes.tactics.rating).toBeDefined();
      expect(updatedUser.ratings.themes.opening.rating).toBeDefined();

      // Verify puzzle history
      const attempt = updatedUser.puzzleHistory[updatedUser.puzzleHistory.length - 1];
      expect(attempt.ratingChanges.overall).toBeDefined();
      expect(attempt.ratingChanges.themes.get('tactics')).toBeDefined();
      expect(attempt.ratingChanges.themes.get('opening')).toBeDefined();
    });

    it('should record failed puzzle attempt', async () => {
      const res = await request(app)
        .post('/api/puzzles/attempt')
        .set('Authorization', `Bearer ${token}`)
        .send({
          puzzleId: puzzle._id,
          moves: ['e2e4', 'e7e5', 'f1c4', 'd7d6'],
          timeSpent: 30
        })
        .expect(200);

      expect(res.body.success).toBe(false);
      expect(res.body.ratingChange).toBeDefined();
    });
  });
}); 