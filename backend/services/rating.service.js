const Glicko2 = require('glicko2').Glicko2;

// Configure Glicko-2 settings
const settings = {
  tau: 0.5,          // Rating volatility constraint
  rating: 1500,      // Default rating
  rd: 350,          // Default rating deviation
  vol: 0.06         // Default volatility
};

// Create separate Glicko2 instances for overall and each theme
const glickoInstances = {
  overall: new Glicko2(settings),
  themes: {}
};

const calculateRatingChange = (player, puzzle, success) => {
  const results = {
    overall: calculateSingleRating(
      glickoInstances.overall,
      player.ratings.overall,
      puzzle,
      success
    ),
    themes: {}
  };

  // Calculate rating changes for each theme
  puzzle.theme.forEach(theme => {
    if (!glickoInstances.themes[theme]) {
      glickoInstances.themes[theme] = new Glicko2(settings);
    }

    if (player.ratings.themes[theme]) {
      results.themes[theme] = calculateSingleRating(
        glickoInstances.themes[theme],
        player.ratings.themes[theme],
        puzzle,
        success
      );
    }
  });

  return results;
};

const calculateSingleRating = (glicko, playerRating, puzzle, success) => {
  const playerGlicko = glicko.makePlayer(
    playerRating.rating,
    playerRating.rd,
    playerRating.vol
  );
  const puzzleGlicko = glicko.makePlayer(
    puzzle.rating,
    puzzle.rd || 50,
    puzzle.vol || 0.06
  );

  glicko.addMatch(playerGlicko, puzzleGlicko, success ? 1 : 0);
  glicko.updateRatings();

  return {
    rating: Math.round(playerGlicko.getRating()),
    rd: Math.round(playerGlicko.getRd()),
    vol: playerGlicko.getVol()
  };
};

module.exports = {
  calculateRatingChange
}; 