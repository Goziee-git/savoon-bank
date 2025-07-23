const express = require('express');
const { 
  getTransactions, 
  getTransaction, 
  createSpendTransaction 
} = require('../controllers/transactions');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getTransactions);

router.route('/:id')
  .get(getTransaction);

router.route('/spend')
  .post(createSpendTransaction);

module.exports = router;
