const { validationResult } = require('express-validator');
const { Transaction, User } = require('../models');
const sequelize = require('../config/database');

// Get all transactions for a user
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get single transaction
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!transaction) {
      return res.status(404).json({ msg: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create a spending transaction
exports.createTransaction = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, description } = req.body;

    // Check user's balance
    const user = await User.findByPk(req.user.id, { transaction: t });
    if (user.credits < amount) {
      await t.rollback();
      return res.status(400).json({ msg: 'Insufficient credits' });
    }

    // Create transaction
    const transaction = await Transaction.create({
      amount,
      description,
      type: 'debit',
      userId: req.user.id
    }, { transaction: t });

    // Update user's credits
    await User.update(
      { credits: sequelize.literal(`credits - ${amount}`) },
      { where: { id: req.user.id }, transaction: t }
    );

    await t.commit();
    res.json(transaction);
  } catch (err) {
    await t.rollback();
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
