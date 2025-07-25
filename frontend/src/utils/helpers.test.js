// Basic utility tests for the Savoon Bank frontend

describe('Utility Functions', () => {
  test('should format currency correctly', () => {
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    };

    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  test('should validate email format', () => {
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user@domain.org')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
  });

  test('should calculate transaction totals', () => {
    const calculateTotal = (transactions) => {
      return transactions.reduce((total, transaction) => {
        return transaction.type === 'credit' 
          ? total + transaction.amount 
          : total - transaction.amount;
      }, 0);
    };

    const mockTransactions = [
      { type: 'credit', amount: 1000 },
      { type: 'debit', amount: 200 },
      { type: 'credit', amount: 500 }
    ];

    expect(calculateTotal(mockTransactions)).toBe(1300);
    expect(calculateTotal([])).toBe(0);
  });

  test('should format date correctly', () => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const testDate = '2024-01-15T10:30:00Z';
    const formatted = formatDate(testDate);
    
    // The exact format may vary by timezone, so we just check it's a valid format
    expect(formatted).toMatch(/\w{3} \d{1,2}, \d{4}/);
  });
});
