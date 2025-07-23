const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// We'll add user-specific routes here later if needed

module.exports = router;
