// Mock transaction system for testing when backend is not available

let mockTransactions = [
  {
    _id: '1',
    description: 'Initial Credit',
    amount: 1000,
    type: 'credit',
    balance: 1000,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '2',
    description: 'Coffee Purchase',
    amount: 5.50,
    type: 'debit',
    balance: 994.50,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '3',
    description: 'Grocery Shopping',
    amount: 45.75,
    type: 'debit',
    balance: 948.75,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '4',
    description: 'Bonus Credit',
    amount: 100,
    type: 'credit',
    balance: 1048.75,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

let currentBalance = 1048.75;

export const mockGetTransactions = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    data: {
      data: {
        transactions: [...mockTransactions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      }
    }
  };
};

export const mockAddTransaction = async (transaction) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (!transaction.amount || !transaction.description) {
    throw new Error('Amount and description are required');
  }

  if (transaction.amount > currentBalance) {
    throw new Error('Insufficient balance');
  }

  const newBalance = currentBalance - transaction.amount;
  currentBalance = newBalance;

  const newTransaction = {
    _id: Date.now().toString(),
    description: transaction.description,
    amount: transaction.amount,
    type: 'debit',
    balance: newBalance,
    createdAt: new Date().toISOString()
  };

  mockTransactions.unshift(newTransaction);

  return {
    data: {
      data: {
        transaction: newTransaction,
        newBalance: newBalance
      }
    }
  };
};

export const mockGetUserBalance = () => {
  return currentBalance;
};

export const mockAddCredit = async (amount) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newBalance = currentBalance + amount;
  currentBalance = newBalance;

  const newTransaction = {
    _id: Date.now().toString(),
    description: 'Credit Added',
    amount: amount,
    type: 'credit',
    balance: newBalance,
    createdAt: new Date().toISOString()
  };

  mockTransactions.unshift(newTransaction);

  return {
    data: {
      data: {
        transaction: newTransaction,
        newBalance: newBalance
      }
    }
  };
};
