import { format, subDays, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, eachMonthOfInterval } from 'date-fns';

// Generate mock loan data
export const generateMockLoans = () => {
  return [
    {
      id: 1,
      type: 'Personal Loan',
      amount: 15000,
      remainingBalance: 12500,
      interestRate: 8.5,
      monthlyPayment: 450,
      startDate: '2024-01-15',
      endDate: '2026-01-15',
      status: 'active'
    },
    {
      id: 2,
      type: 'Car Loan',
      amount: 25000,
      remainingBalance: 18750,
      interestRate: 6.2,
      monthlyPayment: 520,
      startDate: '2023-06-10',
      endDate: '2028-06-10',
      status: 'active'
    },
    {
      id: 3,
      type: 'Home Improvement',
      amount: 8000,
      remainingBalance: 0,
      interestRate: 7.8,
      monthlyPayment: 0,
      startDate: '2022-03-20',
      endDate: '2024-03-20',
      status: 'completed'
    }
  ];
};

// Process transactions for analytics
export const processTransactionsForAnalytics = (transactions, dateRange = 30) => {
  const now = new Date();
  const startDate = subDays(now, dateRange);
  
  // Filter transactions within date range
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date || transaction.createdAt);
    return transactionDate >= startDate && transactionDate <= now;
  });

  // Categorize transactions
  const spending = filteredTransactions.filter(t => t.type === 'debit' || t.amount < 0);
  const income = filteredTransactions.filter(t => t.type === 'credit' || t.amount > 0);

  // Calculate totals
  const totalSpending = spending.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalIncome = income.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netSavings = totalIncome - totalSpending;

  // Group by category
  const spendingByCategory = spending.reduce((acc, transaction) => {
    const category = transaction.category || 'Other';
    acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
    return acc;
  }, {});

  // Daily spending trend
  const dailySpending = eachDayOfInterval({ start: startDate, end: now }).map(date => {
    const daySpending = spending
      .filter(t => {
        const tDate = new Date(t.date || t.createdAt);
        return format(tDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
      })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      date: format(date, 'MMM dd'),
      amount: daySpending,
      fullDate: date
    };
  });

  return {
    totalSpending,
    totalIncome,
    netSavings,
    spendingByCategory,
    dailySpending,
    transactionCount: filteredTransactions.length,
    avgDailySpending: totalSpending / dateRange
  };
};

// Process monthly trends
export const processMonthlyTrends = (transactions, months = 6) => {
  const now = new Date();
  const startDate = subMonths(now, months);
  
  const monthlyData = eachMonthOfInterval({ start: startDate, end: now }).map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    const monthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date || t.createdAt);
      return tDate >= monthStart && tDate <= monthEnd;
    });

    const spending = monthTransactions
      .filter(t => t.type === 'debit' || t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const income = monthTransactions
      .filter(t => t.type === 'credit' || t.amount > 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      month: format(month, 'MMM yyyy'),
      spending,
      income,
      savings: income - spending,
      transactions: monthTransactions.length
    };
  });

  return monthlyData;
};

// Calculate savings rate
export const calculateSavingsRate = (income, spending) => {
  if (income === 0) return 0;
  return ((income - spending) / income) * 100;
};

// Generate spending insights
export const generateSpendingInsights = (analyticsData, loans) => {
  const insights = [];
  
  // Savings rate insight
  const savingsRate = calculateSavingsRate(analyticsData.totalIncome, analyticsData.totalSpending);
  if (savingsRate > 20) {
    insights.push({
      type: 'positive',
      title: 'Excellent Savings Rate!',
      message: `You're saving ${savingsRate.toFixed(1)}% of your income. Keep up the great work!`,
      icon: '💰'
    });
  } else if (savingsRate > 10) {
    insights.push({
      type: 'neutral',
      title: 'Good Savings Habit',
      message: `You're saving ${savingsRate.toFixed(1)}% of your income. Consider increasing to 20% for better financial health.`,
      icon: '📊'
    });
  } else {
    insights.push({
      type: 'warning',
      title: 'Low Savings Rate',
      message: `You're only saving ${savingsRate.toFixed(1)}% of your income. Try to reduce spending or increase income.`,
      icon: '⚠️'
    });
  }

  // Top spending category
  const topCategory = Object.entries(analyticsData.spendingByCategory)
    .sort(([,a], [,b]) => b - a)[0];
  
  if (topCategory) {
    const [category, amount] = topCategory;
    const percentage = ((amount / analyticsData.totalSpending) * 100).toFixed(1);
    insights.push({
      type: 'info',
      title: 'Top Spending Category',
      message: `${category} accounts for ${percentage}% of your spending ($${amount.toFixed(2)})`,
      icon: '📈'
    });
  }

  // Loan insights
  const activeLoans = loans.filter(loan => loan.status === 'active');
  const totalLoanPayments = activeLoans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
  
  if (totalLoanPayments > 0) {
    const loanToIncomeRatio = (totalLoanPayments / analyticsData.totalIncome) * 100;
    if (loanToIncomeRatio > 40) {
      insights.push({
        type: 'warning',
        title: 'High Debt-to-Income Ratio',
        message: `Your loan payments are ${loanToIncomeRatio.toFixed(1)}% of your income. Consider debt consolidation.`,
        icon: '🏦'
      });
    }
  }

  // Spending trend
  const recentSpending = analyticsData.dailySpending.slice(-7).reduce((sum, day) => sum + day.amount, 0);
  const previousSpending = analyticsData.dailySpending.slice(-14, -7).reduce((sum, day) => sum + day.amount, 0);
  
  if (recentSpending > previousSpending * 1.2) {
    insights.push({
      type: 'warning',
      title: 'Increased Spending',
      message: 'Your spending has increased by 20% this week compared to last week.',
      icon: '📊'
    });
  } else if (recentSpending < previousSpending * 0.8) {
    insights.push({
      type: 'positive',
      title: 'Reduced Spending',
      message: 'Great job! Your spending decreased by 20% this week.',
      icon: '✅'
    });
  }

  return insights;
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Calculate loan progress
export const calculateLoanProgress = (loan) => {
  const totalPaid = loan.amount - loan.remainingBalance;
  const progressPercentage = (totalPaid / loan.amount) * 100;
  
  return {
    totalPaid,
    progressPercentage,
    remainingPercentage: 100 - progressPercentage
  };
};
