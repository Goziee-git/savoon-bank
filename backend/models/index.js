const User = require('./User');
const Transaction = require('./Transaction');

// Set up associations
Transaction.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
});

User.hasMany(Transaction, {
  foreignKey: 'userId'
});

module.exports = {
  User,
  Transaction
};
