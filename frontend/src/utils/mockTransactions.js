// Mock transaction system for testing when backend is not available

// Generate more realistic mock data
const generateMockTransactions = () => {
  const categories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Other'];
  const descriptions = {
    'Food & Dining': ['Starbucks Coffee', 'McDonald\'s', 'Grocery Store', 'Pizza Hut', 'Local Restaurant', 'Food Delivery'],
    'Transportation': ['Gas Station', 'Uber Ride', 'Public Transit', 'Parking Fee', 'Car Maintenance'],
    'Shopping': ['Amazon Purchase', 'Target', 'Clothing Store', 'Electronics Store', 'Online Shopping'],
    'Entertainment': ['Movie Theater', 'Netflix Subscription', 'Concert Tickets', 'Gaming', 'Streaming Service'],
    'Bills & Utilities': ['Electric Bill', 'Internet Bill', 'Phone Bill', 'Water Bill', 'Insurance'],
    'Healthcare': ['Pharmacy', 'Doctor Visit', 'Dental Care', 'Health Insurance', 'Medical Supplies'],
    'Education': ['Course Fee', 'Books', 'Online Learning', 'Training Program', 'Certification'],
    'Travel': ['Hotel Booking', 'Flight Ticket', 'Car Rental', 'Travel Insurance', 'Vacation Expense'],
    'Other': ['ATM Withdrawal', 'Bank Fee', 'Miscellaneous', 'Gift', 'Donation']
  };

  const transactions = [];
  let balance = 2500; // Starting balance
  
  // Generate transactions for the last 6 months
  for (let i = 0; i < 180; i++) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    
    // Randomly decide if there should be a transaction on this day (70% chance)
    if (Math.random() > 0.3) {
      const numTransactions = Math.random() > 0.7 ? 2 : 1; // Sometimes multiple transactions per day
      
      for (let j = 0; j < numTransactions; j++) {
        const isCredit = Math.random() > 0.8; // 20% chance of credit
        
        if (isCredit) {
          // Credit transaction (salary, bonus, refund, etc.)
          const creditDescriptions = ['Salary Deposit', 'Bonus Payment', 'Refund', 'Interest Credit', 'Cashback', 'Gift Money'];
          const amount = Math.random() > 0.8 ? 
            Math.floor(Math.random() * 2000) + 1000 : // Large credit (salary/bonus)
            Math.floor(Math.random() * 200) + 20; // Small credit (refund/cashback)
          
          balance += amount;
          
          transactions.push({
            _id: `credit_${i}_${j}`,
            description: creditDescriptions[Math.floor(Math.random() * creditDescriptions.length)],
            amount: amount,
            type: 'credit',
            category: 'Income',
            balance: balance,
            createdAt: new Date(date.getTime() - j * 60 * 60 * 1000).toISOString() // Spread throughout the day
          });
        } else {
          // Debit transaction
          const category = categories[Math.floor(Math.random() * categories.length)];
          const categoryDescriptions = descriptions[category];
          const description = categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
          
          // Different amount ranges based on category
          let amount;
          switch (category) {
            case 'Food & Dining':
              amount = Math.floor(Math.random() * 50) + 5;
              break;
            case 'Transportation':
              amount = Math.floor(Math.random() * 80) + 10;
              break;
            case 'Shopping':
              amount = Math.floor(Math.random() * 200) + 20;
              break;
            case 'Entertainment':
              amount = Math.floor(Math.random() * 100) + 15;
              break;
            case 'Bills & Utilities':
              amount = Math.floor(Math.random() * 150) + 50;
              break;
            case 'Healthcare':
              amount = Math.floor(Math.random() * 300) + 30;
              break;
            case 'Education':
              amount = Math.floor(Math.random() * 500) + 50;
              break;
            case 'Travel':
              amount = Math.floor(Math.random() * 800) + 100;
              break;
            default:
              amount = Math.floor(Math.random() * 100) + 10;
          }
          
          // Don't allow negative balance
          if (amount > balance) {
            amount = Math.floor(balance * 0.8); // Use 80% of available balance
          }
          
          if (amount > 0) {
            balance -= amount;
            
            transactions.push({
              _id: `debit_${i}_${j}`,
              description: description,
              amount: amount,
              type: 'debit',
              category: category,
              balance: balance,
              createdAt: new Date(date.getTime() - j * 60 * 60 * 1000).toISOString()
            });
          }
        }
      }
    }
  }
  
  return transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

let mockTransactions = generateMockTransactions();

let currentBalance = mockTransactions.length > 0 ? mockTransactions[0].balance : 2500;

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
    category: transaction.category || 'Other',
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
    category: 'Income',
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
