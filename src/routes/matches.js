const express = require('express');
const router = express.Router();
const MatchController = require('../controllers/MatchController');
const validateRequest = require('../middleware/validateRequest');
const matchQuerySchema = require('../validators/matchQuerySchema');

/**
 * Match Routes
 * Defines API endpoints for World Cup match operations
 * Requirements: 3.1
 */

// GET /api/matches?team1=:nation1&team2=:nation2 - Get matches between two teams
router.get(
  '/',
  validateRequest(matchQuerySchema),
  MatchController.getMatchesBetweenTeams
);

module.exports = router;
