const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection - only connect if not in test environment
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log(`Connected to MongoDB at ${process.env.MONGODB_URI}`))
    .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1); // Exit if we can't connect to database
    });
}

// Routes
const authRoutes = require('./routes/auth.routes');
const puzzleRoutes = require('./routes/puzzle.routes');

app.use('/api/auth', authRoutes);
app.use('/api/puzzles', puzzleRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Chess Review App API' });
});

app.post('/api/test/user', async (req, res) => {
  try {
    const User = require('./models/User');
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    await testUser.save();
    res.json({ message: 'Test user created successfully', userId: testUser._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const startServer = (port) => {
    app.listen(port)
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${port} is busy, trying ${port + 1}...`);
          startServer(port + 1);
        } else {
          console.error('Server error:', err);
        }
      })
      .on('listening', () => {
        console.log(`
🚀 Server is running on port ${port}
📁 API endpoint: http://localhost:${port}
🔧 Environment: ${process.env.NODE_ENV || 'development'}
        `);
      });
  };

  const PORT = process.env.PORT || 5000;
  startServer(PORT);
}

module.exports = app; 