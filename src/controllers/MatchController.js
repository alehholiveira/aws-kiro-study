const MatchService = require('../services/MatchService');

/**
 * MatchController
 * Handles HTTP requests for World Cup match operations
 * 
 * Endpoints:
 * - GET /api/matches - Get matches between two teams
 * 
 * Requirements: 3.1, 3.2, 3.4
 */
class MatchController {
  /**
   * Get all matches between two teams
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getMatchesBetweenTeams(req, res, next) {
    try {
      const { team1, team2 } = req.validated;

      const matches = await MatchService.getMatchesBetweenTeams(team1, team2);

      // Format response with matches array and count
      // Handle empty results with 200 status (not 404)
      res.status(200).json({
        matches: matches,
        count: matches.length
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MatchController();
