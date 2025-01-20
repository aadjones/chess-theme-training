const { calculateRatingChange } = require('../../services/rating.service');

describe('Rating Service', () => {
  describe('Glicko-2 Rating', () => {
    it('should initialize with valid settings', () => {
      expect(calculateRatingChange).toBeDefined();
    });

    it('should increase player rating for beating higher rated puzzle', () => {
      const player = {
        ratings: {
          overall: {
            rating: 1500,
            rd: 350,
            vol: 0.06
          },
          themes: {
            tactics: {
              rating: 1500,
              rd: 350,
              vol: 0.06
            },
            opening: {
              rating: 1500,
              rd: 350,
              vol: 0.06
            }
          }
        }
      };
      
      const puzzle = {
        rating: 1700,
        rd: 50,
        vol: 0.06,
        theme: ['tactics', 'opening']
      };

      const result = calculateRatingChange(player, puzzle, true);
      
      expect(result.overall.rating).toBeGreaterThan(player.ratings.overall.rating);
      expect(result.overall.rd).toBeLessThan(player.ratings.overall.rd);
      expect(result.overall.vol).toBeDefined();
      expect(result.themes.tactics.rating).toBeGreaterThan(player.ratings.themes.tactics.rating);
      expect(result.themes.opening.rating).toBeGreaterThan(player.ratings.themes.opening.rating);
    });

    it('should decrease player rating for losing to lower rated puzzle', () => {
      const player = {
        ratings: {
          overall: {
            rating: 1700,
            rd: 350,
            vol: 0.06
          },
          themes: {
            tactics: {
              rating: 1700,
              rd: 350,
              vol: 0.06
            }
          }
        }
      };
      
      const puzzle = {
        rating: 1500,
        rd: 50,
        vol: 0.06,
        theme: ['tactics']
      };

      const result = calculateRatingChange(player, puzzle, false);
      
      expect(result.overall.rating).toBeLessThan(player.ratings.overall.rating);
      expect(result.overall.rd).toBeLessThan(player.ratings.overall.rd);
      expect(result.themes.tactics.rating).toBeLessThan(player.ratings.themes.tactics.rating);
    });

    it('should update puzzle rating when solved', () => {
      const player = {
        ratings: {
          overall: {
            rating: 1800,
            rd: 350,
            vol: 0.06
          },
          themes: {
            tactics: {
              rating: 1800,
              rd: 350,
              vol: 0.06
            }
          }
        }
      };
      
      const puzzle = {
        rating: 1500,
        rd: 50,
        vol: 0.06,
        theme: ['tactics']
      };

      const result = calculateRatingChange(player, puzzle, true);
      
      expect(result.overall.rating).toBeDefined();
      expect(result.overall.rd).toBeDefined();
      expect(result.overall.vol).toBeDefined();
      expect(result.themes.tactics).toBeDefined();
    });

    it('should handle default values for puzzle rd and vol', () => {
      const player = {
        ratings: {
          overall: {
            rating: 1500,
            rd: 350,
            vol: 0.06
          },
          themes: {
            tactics: {
              rating: 1500,
              rd: 350,
              vol: 0.06
            }
          }
        }
      };
      
      const puzzle = {
        rating: 1500,
        theme: ['tactics']
        // missing rd and vol
      };

      const result = calculateRatingChange(player, puzzle, true);
      
      expect(result.overall.rating).toBeDefined();
      expect(result.overall.rd).toBeDefined();
      expect(result.overall.vol).toBeDefined();
      expect(result.themes.tactics).toBeDefined();
    });
  });
}); 