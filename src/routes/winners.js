const express = require('express');
const router = express.Router();
const WinnerController = require('../controllers/WinnerController');
const validateRequest = require('../middleware/validateRequest');
const yearSchema = require('../validators/yearSchema');

/**
 * Winner Routes
 * Defines API endpoints for World Cup winner operations
 * Requirements: 2.1
 */

// GET /api/winners/:year - Get winner by year
router.get(
  '/:year',
  validateRequest(yearSchema),
  WinnerController.getWinnerByYear
);

module.exports = router;

