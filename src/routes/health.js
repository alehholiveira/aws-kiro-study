const express = require('express');
const router = express.Router();

// Health check endpoint for Docker health checks
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;
