const express = require('express');
const router = express.Router();
const puzzleController = require('../controllers/puzzle.controller');
const protect = require('../middleware/auth.middleware');

// All puzzle routes require authentication
router.use(protect);

router.get('/', puzzleController.getPuzzles);
router.post('/attempt', puzzleController.attemptPuzzle);

module.exports = router; 