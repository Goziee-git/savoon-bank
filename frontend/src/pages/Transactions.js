import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/auth/authContext';
import TransactionContext from '../context/transaction/transactionContext';
import { mockGetUserBalance } from '../utils/mockTransactions';
import { numberToWordsShort } from '../utils/numberToWords';

const Transactions = () => {
  const authContext = useContext(AuthContext);
  const transactionContext = useContext(TransactionContext);

  const { user } = authContext;
  const { transactions, addTransaction, addCredit, getTransactions, loading, error } = transactionContext;

  const [transaction, setTransaction] = useState({
    amount: '',
    description: ''
  });

  const [creditAmount, setCreditAmount] = useState('');
  const [currentBalance, setCurrentBalance] = useState(0);
  const [showAddCredit, setShowAddCredit] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    getTransactions();
    setCurrentBalance(mockGetUserBalance());
  }, []);

  useEffect(() => {
    // Update balance when transactions change
    setCurrentBalance(mockGetUserBalance());
  }, [transactions]);

  const { amount, description } = transaction;

  const onChange = e =>
    setTransaction({ ...transaction, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    
    if (!amount || !description) {
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

    try {
      await addTransaction({
        amount: parseFloat(amount),
        description
      });
      setTransaction({
        amount: '',
        description: ''
      });
      setSuccessMessage('Transaction completed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert(err.message || 'Transaction failed');
    }
  };

  const onAddCredit = async e => {
    e.preventDefault();
    
    if (!creditAmount) {
      alert('Please enter credit amount');
      return;
    }

    if (parseFloat(creditAmount) <= 0) {
      alert('Credit amount must be greater than 0');
      return;
    }

    try {
      await addCredit(parseFloat(creditAmount));
      setCreditAmount('');
      setShowAddCredit(false);
      setSuccessMessage('Credit added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to add credit');
    }
  };

  return (
    <div className='container'>
      <div className="dashboard-header">
        <h1>
          <i className="fas fa-exchange-alt"></i>
          Savoon Bank Transactions
        </h1>
        <p className="lead">Manage your spending and view transaction history</p>
      </div>

      {error && (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          <i className="fas fa-check-circle"></i>
          {successMessage}
        </div>
      )}

      {/* Current Balance Display */}
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

      <div className='grid-2'>
        {/* Transaction Form */}
        <div>
          <div className="card">
            <div className="card-header">
              <i className="fas fa-credit-card"></i>
              <h2>Make a Transaction</h2>
            </div>
            
            <form onSubmit={onSubmit}>
              <div className='form-group'>
                <label htmlFor='amount'>
                  <i className="fas fa-dollar-sign"></i>
                  Amount
                </label>
                <input
                  type='number'
                  name='amount'
                  value={amount}
                  onChange={onChange}
                  required
                  min='0.01'
                  step='0.01'
                  placeholder='Enter amount to spend'
                  max={currentBalance}
                />
                <small className="text-small">
                  Available: ${currentBalance.toFixed(2)}
                </small>
              </div>
              
              <div className='form-group'>
                <label htmlFor='description'>
                  <i className="fas fa-tag"></i>
                  Description
                </label>
                <input
                  type='text'
                  name='description'
                  value={description}
                  onChange={onChange}
                  required
                  placeholder='What is this transaction for?'
                />
              </div>
              
              <button
                type='submit'
                className='btn btn-primary btn-block'
                disabled={loading || !amount || !description || parseFloat(amount) > currentBalance}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-shopping-cart"></i>
                    Process Transaction
                  </>
                )}
              </button>
            </form>

            {/* Add Credit Section */}
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
              {!showAddCredit ? (
                <button
                  className="btn btn-success btn-block"
                  onClick={() => setShowAddCredit(true)}
                >
                  <i className="fas fa-plus"></i>
                  Add Funds
                </button>
              ) : (
                <form onSubmit={onAddCredit}>
                  <div className='form-group'>
                    <label htmlFor='creditAmount'>
                      <i className="fas fa-plus-circle"></i>
                      Deposit Amount
                    </label>
                    <input
                      type='number'
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(e.target.value)}
                      required
                      min='0.01'
                      step='0.01'
                      placeholder='Enter amount to deposit'
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type='submit'
                      className='btn btn-success'
                      disabled={loading || !creditAmount}
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Adding...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check"></i>
                          Deposit Funds
                        </>
                      )}
                    </button>
                    <button
                      type='button'
                      className='btn btn-secondary'
                      onClick={() => {
                        setShowAddCredit(false);
                        setCreditAmount('');
                      }}
                    >
                      <i className="fas fa-times"></i>
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <div className="card">
            <div className="card-header">
              <i className="fas fa-history"></i>
              <h2>Transaction History</h2>
            </div>
            
            {loading && transactions.length === 0 ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading transactions...</p>
              </div>
            ) : transactions.length > 0 ? (
              <div className='transactions-list'>
                {transactions.map(transaction => (
                  <div key={transaction._id} className='card' style={{ margin: '0.5rem 0', padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--dark-color)' }}>
                          {transaction.description}
                        </h4>
                        <p className="text-small" style={{ margin: '0 0 0.5rem 0' }}>
                          <i className="fas fa-calendar"></i>
                          {new Date(transaction.createdAt).toLocaleString()}
                        </p>
                        <p className="text-small" style={{ margin: 0 }}>
                          <i className="fas fa-wallet"></i>
                          Balance after: ${transaction.balance.toFixed(2)}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div
                          className={`transaction-amount ${
                            transaction.type === 'credit'
                              ? 'text-success'
                              : 'text-danger'
                          }`}
                          style={{ fontSize: '1.25rem', fontWeight: '700' }}
                        >
                          {transaction.type === 'credit' ? '+' : '-'}
                          ${transaction.amount.toFixed(2)}
                        </div>
                        <div className="text-small" style={{ marginTop: '0.25rem' }}>
                          {transaction.type === 'credit' ? (
                            <span className="text-success">
                              <i className="fas fa-arrow-up"></i>
                              Deposit
                            </span>
                          ) : (
                            <span className="text-danger">
                              <i className="fas fa-arrow-down"></i>
                              Withdrawal
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center" style={{ padding: '3rem' }}>
                <i className="fas fa-inbox" style={{ fontSize: '4rem', color: '#ccc', marginBottom: '1rem' }}></i>
                <h3 style={{ color: '#6c757d', marginBottom: '0.5rem' }}>No transactions yet</h3>
                <p className="text-small">Your transaction history will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
