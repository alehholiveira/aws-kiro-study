const Winner = require('../models/Winner');
const { Op } = require('sequelize');

/**
 * WinnerService
 * Business logic for World Cup winner operations
 * 
 * Handles:
 * - Retrieving winners by year
 * - Simulating future World Cup winners
 */
class WinnerService {
  /**
   * Get World Cup winner by year
   * @param {number} year - The tournament year
   * @returns {Promise<Object|null>} Winner object or null if not found
   */
  async getWinnerByYear(year) {
    try {
      const winner = await Winner.findOne({
        where: { year }
      });
      return winner;
    } catch (error) {
      throw new Error(`Failed to retrieve winner for year ${year}: ${error.message}`);
    }
  }

  /**
   * Simulate a future World Cup winner
   * Randomly selects from historical winners (1950-2022)
   * Persists the simulation to the database
   * 
   * @param {number} year - The future tournament year
   * @returns {Promise<Object>} The simulated winner object
   */
  async simulateWinner(year) {
    try {
      // Check if simulation already exists for this year
      const existingWinner = await Winner.findOne({
        where: { year }
      });

      if (existingWinner) {
        return existingWinner;
      }

      // Get all historical winners (1950-2022) to randomly select from
      const historicalWinners = await Winner.findAll({
        where: {
          year: {
            [Op.lte]: 2022
          }
        }
      });

      if (historicalWinners.length === 0) {
        throw new Error('No historical winners found to simulate from');
      }

      // Randomly select a winner from historical data
      const randomIndex = Math.floor(Math.random() * historicalWinners.length);
      const selectedWinner = historicalWinners[randomIndex];

      // Create new simulated winner record
      const simulatedWinner = await Winner.create({
        year,
        winner: selectedWinner.winner,
        host_country: 'TBD' // Host country is unknown for future tournaments
      });

      return simulatedWinner;
    } catch (error) {
      throw new Error(`Failed to simulate winner for year ${year}: ${error.message}`);
    }
  }
}

module.exports = new WinnerService();
