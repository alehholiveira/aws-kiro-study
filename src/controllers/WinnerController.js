const WinnerService = require('../services/WinnerService');

/**
 * WinnerController
 * Handles HTTP requests for World Cup winner operations
 * 
 * Endpoints:
 * - GET /api/winners/:year - Get winner by year
 * - POST /api/simulate - Simulate future World Cup winner
 * 
 * Requirements: 2.1, 2.2, 4.1, 7.2, 7.4
 */
class WinnerController {
  /**
   * Get World Cup winner by year
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async getWinnerByYear(req, res, next) {
    try {
      const { year } = req.validated;

      const winner = await WinnerService.getWinnerByYear(year);

      if (!winner) {
        return res.status(404).json({
          error: `No World Cup winner found for year ${year}`
        });
      }

      // Format response
      res.status(200).json({
        year: winner.year,
        winner: winner.winner,
        host_country: winner.host_country
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Simulate a future World Cup winner
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  async simulateWinner(req, res, next) {
    try {
      const { year } = req.validated;

      // Ensure year is after 2022 (future simulation)
      if (year <= 2022) {
        return res.status(400).json({
          error: 'Simulation is only available for years after 2022'
        });
      }

      const simulatedWinner = await WinnerService.simulateWinner(year);

      // Format response with simulated flag
      res.status(201).json({
        year: simulatedWinner.year,
        winner: simulatedWinner.winner,
        simulated: true
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new WinnerController();
