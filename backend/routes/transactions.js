const express = require('express');
const { 
  getTransactions, 
  getTransaction, 
  createTransaction 
} = require('../controllers/transactions');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Important: More specific routes should come before parameter routes
router.route('/spend')
  .post(createTransaction);

router.route('/')
  .get(getTransactions);

router.route('/:id')
  .get(getTransaction);

module.exports = router;
