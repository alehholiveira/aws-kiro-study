const express = require('express');
const router = express.Router();
const WinnerController = require('../controllers/WinnerController');
const validateRequest = require('../middleware/validateRequest');
const worldCupYearSchema = require('../validators/worldCupYearSchema');

/**
 * Simulate Route
 * Defines API endpoint for World Cup winner simulation
 * Requirements: 4.1
 */

// POST /api/simulate - Simulate future World Cup winner
router.post(
  '/simulate',
  validateRequest(worldCupYearSchema),
  WinnerController.simulateWinner
);

module.exports = router;
