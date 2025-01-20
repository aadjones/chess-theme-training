const mongoose = require('mongoose');

const puzzleSchema = new mongoose.Schema({
  fen: {
    type: String,
    required: true
  },
  solution: {
    type: [String],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  theme: {
    type: [String],
    required: true
  },
  rating: {
    type: Number,
    default: 1500
  },
  rd: {
    type: Number,
    default: 350
  },
  vol: {
    type: Number,
    default: 0.06
  },
  source: {
    type: String,
    enum: ['lichess', 'custom'],
    required: true
  },
  sourceId: String,
  explanation: String,
  tags: [String]
}, {
  timestamps: true
});

const Puzzle = mongoose.model('Puzzle', puzzleSchema);

module.exports = Puzzle; 