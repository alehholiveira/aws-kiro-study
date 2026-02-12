const Match = require('../models/Match');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * MatchService
 * Business logic for World Cup match operations
 * 
 * Handles:
 * - Retrieving matches between two teams
 * - Case-insensitive team name matching
 * - Bidirectional matching (team1 vs team2 or team2 vs team1)
 */
class MatchService {
  /**
   * Get all matches between two teams
   * Handles case-insensitive search and bidirectional matching
   * 
   * @param {string} team1 - First team name
   * @param {string} team2 - Second team name
   * @returns {Promise<Array>} Array of match objects
   */
  async getMatchesBetweenTeams(team1, team2) {
    try {
      // Use Sequelize's case-insensitive search with LOWER function
      // Match both directions: (team1 vs team2) OR (team2 vs team1)
      const matches = await Match.findAll({
        where: {
          [Op.or]: [
            {
              // team1 = team1 AND team2 = team2
              [Op.and]: [
                sequelize.where(
                  sequelize.fn('LOWER', sequelize.col('team1')),
                  sequelize.fn('LOWER', team1.toLowerCase())
                ),
                sequelize.where(
                  sequelize.fn('LOWER', sequelize.col('team2')),
                  sequelize.fn('LOWER', team2.toLowerCase())
                )
              ]
            },
            {
              // team1 = team2 AND team2 = team1 (bidirectional)
              [Op.and]: [
                sequelize.where(
                  sequelize.fn('LOWER', sequelize.col('team1')),
                  sequelize.fn('LOWER', team2.toLowerCase())
                ),
                sequelize.where(
                  sequelize.fn('LOWER', sequelize.col('team2')),
                  sequelize.fn('LOWER', team1.toLowerCase())
                )
              ]
            }
          ]
        },
        order: [['date', 'ASC']] // Order by date ascending
      });

      return matches;
    } catch (error) {
      throw new Error(`Failed to retrieve matches between ${team1} and ${team2}: ${error.message}`);
    }
  }
}

module.exports = new MatchService();
