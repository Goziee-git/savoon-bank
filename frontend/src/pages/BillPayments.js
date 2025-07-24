import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/auth/authContext';
import { mockGetUserBalance } from '../utils/mockTransactions';
import { numberToWordsShort } from '../utils/numberToWords';

const BillPayments = () => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  
  const [currentBalance, setCurrentBalance] = useState(0);
  const [selectedBill, setSelectedBill] = useState('');
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [recentPayments, setRecentPayments] = useState([]);

  const billTypes = [
    { id: 'electricity', name: 'Electricity', icon: 'fas fa-bolt', color: '#f39c12' },
    { id: 'water', name: 'Water', icon: 'fas fa-tint', color: '#3498db' },
    { id: 'gas', name: 'Gas', icon: 'fas fa-fire', color: '#e74c3c' },
    { id: 'internet', name: 'Internet', icon: 'fas fa-wifi', color: '#9b59b6' },
    { id: 'phone', name: 'Phone', icon: 'fas fa-phone', color: '#2ecc71' },
    { id: 'cable', name: 'Cable TV', icon: 'fas fa-tv', color: '#34495e' },
    { id: 'insurance', name: 'Insurance', icon: 'fas fa-shield-alt', color: '#16a085' },
    { id: 'rent', name: 'Rent', icon: 'fas fa-home', color: '#d35400' }
  ];

  useEffect(() => {
    setCurrentBalance(mockGetUserBalance());
    loadRecentPayments();
  }, []);

  const loadRecentPayments = () => {
    const payments = JSON.parse(localStorage.getItem('billPayments') || '[]');
    setRecentPayments(payments.slice(0, 5));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!selectedBill || !amount || !accountNumber) {
      alert('Please fill in all fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    if (parseFloat(amount) > currentBalance) {
      alert('Insufficient balance');
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const billType = billTypes.find(b => b.id === selectedBill);
      const payment = {
        id: Date.now().toString(),
        billType: billType.name,
        amount: parseFloat(amount),
        accountNumber,
        date: new Date().toISOString(),
        status: 'completed'
      };

      // Save payment
      const payments = JSON.parse(localStorage.getItem('billPayments') || '[]');
      payments.unshift(payment);
      localStorage.setItem('billPayments', JSON.stringify(payments));

      // Update balance (mock)
      const newBalance = currentBalance - parseFloat(amount);
      setCurrentBalance(newBalance);

      setSuccessMessage(`Payment of $${amount} for ${billType.name} completed successfully!`);
      setSelectedBill('');
      setAmount('');
      setAccountNumber('');
      loadRecentPayments();

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <div className="dashboard-header">
        <h1>
          <i className="fas fa-file-invoice-dollar"></i>
          Bill Payments
        </h1>
        <p className="lead">Pay your bills quickly and securely</p>
      </div>

      {successMessage && (
        <div className="alert alert-success">
          <i className="fas fa-check-circle"></i>
          {successMessage}
        </div>
      )}

      {/* Current Balance */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card balance-card">
          <div className="stat-icon">
            <i className="fas fa-wallet"></i>
          </div>
          <h3>Available Balance</h3>
          <div className="balance-amount">
            ${currentBalance.toFixed(2)}
          </div>
          <div className="balance-amount-words">
            {numberToWordsShort(currentBalance)}
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Payment Form */}
        <div>
          <div className="card">
            <div className="card-header">
              <i className="fas fa-credit-card"></i>
              <h2>Make Payment</h2>
            </div>

            <form onSubmit={handlePayment}>
              <div className="form-group">
                <label>
                  <i className="fas fa-list"></i>
                  Select Bill Type
                </label>
                <select
                  value={selectedBill}
                  onChange={(e) => setSelectedBill(e.target.value)}
                  required
                >
                  <option value="">Choose bill type...</option>
                  {billTypes.map(bill => (
                    <option key={bill.id} value={bill.id}>
                      {bill.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  <i className="fas fa-hashtag"></i>
                  Account Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter your account number"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <i className="fas fa-dollar-sign"></i>
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter payment amount"
                  min="0.01"
                  step="0.01"
                  max={currentBalance}
                  required
                />
                <small className="text-small">
                  Available: ${currentBalance.toFixed(2)}
                </small>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading || !selectedBill || !amount || !accountNumber}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    Pay Bill
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Bill Types */}
          <div className="card">
            <div className="card-header">
              <i className="fas fa-zap"></i>
              <h3>Quick Select</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
              {billTypes.map(bill => (
                <button
                  key={bill.id}
                  className={`btn ${selectedBill === bill.id ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedBill(bill.id)}
                  style={{ 
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <i className={bill.icon} style={{ fontSize: '1.5rem', color: bill.color }}></i>
                  <span style={{ fontSize: '0.8rem' }}>{bill.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Payments */}
        <div>
          <div className="card">
            <div className="card-header">
              <i className="fas fa-history"></i>
              <h2>Recent Payments</h2>
            </div>

            {recentPayments.length > 0 ? (
              <div className="transactions-list">
                {recentPayments.map(payment => (
                  <div key={payment.id} className="card" style={{ margin: '0.5rem 0', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--dark-color)' }}>
                          {payment.billType}
                        </h4>
                        <p className="text-small" style={{ margin: '0 0 0.5rem 0' }}>
                          <i className="fas fa-hashtag"></i>
                          Account: {payment.accountNumber}
                        </p>
                        <p className="text-small" style={{ margin: 0 }}>
                          <i className="fas fa-calendar"></i>
                          {new Date(payment.date).toLocaleString()}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="transaction-amount text-danger" style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                          -${payment.amount.toFixed(2)}
                        </div>
                        <div className="text-small text-success" style={{ marginTop: '0.25rem' }}>
                          <i className="fas fa-check-circle"></i>
                          Completed
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center" style={{ padding: '3rem' }}>
                <i className="fas fa-file-invoice" style={{ fontSize: '4rem', color: '#ccc', marginBottom: '1rem' }}></i>
                <h3 style={{ color: '#6c757d', marginBottom: '0.5rem' }}>No payments yet</h3>
                <p className="text-small">Your bill payment history will appear here</p>
              </div>
            )}
          </div>

          {/* Payment Tips */}
          <div className="card">
            <div className="card-header">
              <i className="fas fa-lightbulb"></i>
              <h3>Payment Tips</h3>
            </div>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '1rem' }}>
                <i className="fas fa-shield-alt text-success"></i>
                <strong> Secure:</strong> All payments are encrypted and secure
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <i className="fas fa-clock text-info"></i>
                <strong> Fast:</strong> Payments are processed instantly
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <i className="fas fa-receipt text-warning"></i>
                <strong> Records:</strong> Keep track of all your payments
              </div>
              <div>
                <i className="fas fa-phone text-primary"></i>
                <strong> Support:</strong> 24/7 customer support available
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillPayments;
