const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    service: 'savoon-bank-backend',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  };
  
  try {
    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.message = error;
    res.status(503).json(healthCheck);
  }
});

// Readiness check endpoint
router.get('/ready', (req, res) => {
  // Add database connectivity check here if needed
  res.status(200).json({
    status: 'ready',
    timestamp: Date.now(),
    service: 'savoon-bank-backend'
  });
});

// Liveness check endpoint
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: Date.now(),
    service: 'savoon-bank-backend'
  });
});

module.exports = router;
