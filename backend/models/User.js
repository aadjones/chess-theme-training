const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ratingSchema = {
  rating: { type: Number, default: 1500 },
  rd: { type: Number, default: 350 },
  vol: { type: Number, default: 0.06 }
};

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  ratings: {
    overall: ratingSchema,
    themes: {
      tactics: ratingSchema,
      endgame: ratingSchema,
      opening: ratingSchema,
      middlegame: ratingSchema,
      defense: ratingSchema,
      attack: ratingSchema,
      calculation: ratingSchema,
      positional: ratingSchema
    }
  },
  puzzleHistory: [{
    puzzleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Puzzle' },
    solved: Boolean,
    attemptDate: { type: Date, default: Date.now },
    timeSpent: Number,
    ratingChanges: {
      overall: Number,
      themes: Map
    }
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 