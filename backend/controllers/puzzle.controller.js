const Puzzle = require('../models/Puzzle');
const User = require('../models/User');
const { calculateRatingChange } = require('../services/rating.service');

const getPuzzles = async (req, res) => {
  try {
    const { page = 1, limit = 10, difficulty, theme } = req.query;
    const query = {};

    // Add filters if provided
    if (difficulty) query.difficulty = difficulty;
    if (theme) query.theme = theme;

    // Execute query with pagination
    const puzzles = await Puzzle.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total documents
    const total = await Puzzle.countDocuments(query);

    res.json({
      puzzles,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const attemptPuzzle = async (req, res) => {
  try {
    const { puzzleId, moves, timeSpent } = req.body;
    const userId = req.user._id;

    const puzzle = await Puzzle.findById(puzzleId);
    if (!puzzle) {
      return res.status(404).json({ error: 'Puzzle not found' });
    }

    // Check if solution matches
    const success = JSON.stringify(moves) === JSON.stringify(puzzle.solution);

    // Calculate new ratings for overall and themes
    const newRatings = calculateRatingChange(req.user, puzzle, success);

    // Prepare rating updates
    const ratingUpdates = {
      'ratings.overall': newRatings.overall
    };

    // Add theme rating updates
    Object.entries(newRatings.themes).forEach(([theme, rating]) => {
      ratingUpdates[`ratings.themes.${theme}`] = rating;
    });

    // Calculate rating changes for history
    const ratingChanges = {
      overall: newRatings.overall.rating - req.user.ratings.overall.rating,
      themes: {}
    };

    Object.entries(newRatings.themes).forEach(([theme, rating]) => {
      ratingChanges.themes[theme] = rating.rating - req.user.ratings.themes[theme].rating;
    });

    // Update user's ratings and puzzle history
    await User.findByIdAndUpdate(userId, {
      $push: {
        puzzleHistory: {
          puzzleId,
          solved: success,
          timeSpent,
          ratingChanges
        }
      },
      $set: ratingUpdates
    });

    // Update puzzle rating (only overall for now)
    await Puzzle.findByIdAndUpdate(puzzleId, {
      $set: {
        rating: newRatings.overall.rating,
        rd: newRatings.overall.rd,
        vol: newRatings.overall.vol
      }
    });

    res.json({
      success,
      newRating: newRatings.overall.rating,
      ratingChange: ratingChanges.overall,
      themeRatingChanges: ratingChanges.themes
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getPuzzles,
  attemptPuzzle
}; 