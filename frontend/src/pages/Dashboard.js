import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/auth/authContext';
import TransactionContext from '../context/transaction/transactionContext';
import { mockGetUserBalance } from '../utils/mockTransactions';
import { numberToWordsShort } from '../utils/numberToWords';
import BankLogo from '../components/layout/BankLogo';

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const transactionContext = useContext(TransactionContext);

  const { user, loadUser } = authContext;
  const { transactions, getTransactions, loading, error } = transactionContext;
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    getTransactions();
    // Update balance from mock system
    setCurrentBalance(mockGetUserBalance());
  }, []);

  useEffect(() => {
    // Update user data periodically to get latest balance
    const interval = setInterval(() => {
      setCurrentBalance(mockGetUserBalance());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const recentTransactions = transactions.slice(0, 5);
  const totalSpent = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalEarned = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container'>
      {/* Fancy Welcome Header */}
      <div className="welcome-header" style={{
        background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
        color: 'white',
        padding: '3rem 2rem',
        borderRadius: 'var(--border-radius)',
        marginBottom: '2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3
        }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            fontFamily: "'Playfair Display', serif",
            marginBottom: '1rem',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            letterSpacing: '2px'
          }}>
            <i className="fas fa-star" style={{ marginRight: '1rem', color: '#FFD700' }}></i>
            Welcome, {user?.name || 'Valued Customer'}!
            <i className="fas fa-star" style={{ marginLeft: '1rem', color: '#FFD700' }}></i>
          </h1>
          <p style={{
            fontSize: '1.5rem',
            fontWeight: '300',
            opacity: 0.9,
            fontFamily: "'Inter', sans-serif"
          }}>
            <i className="fas fa-university" style={{ marginRight: '0.5rem' }}></i>
            Welcome to your Savoon Bank Dashboard
          </p>
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem 2rem',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50px',
            display: 'inline-block',
            backdropFilter: 'blur(10px)'
          }}>
            <i className="fas fa-calendar-alt" style={{ marginRight: '0.5rem' }}></i>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card balance-card">
          <div className="stat-icon">
            <i className="fas fa-wallet"></i>
          </div>
          <h3>Current Balance</h3>
          <div className="balance-amount">
            ${currentBalance.toFixed(2)}
          </div>
          <div className="balance-amount-words">
            {numberToWordsShort(currentBalance)}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-arrow-up text-success"></i>
          </div>
          <div className="stat-value text-success">
            ${totalEarned.toFixed(2)}
          </div>
          <div className="stat-label">Total Earned</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-arrow-down text-danger"></i>
          </div>
          <div className="stat-value text-danger">
            ${totalSpent.toFixed(2)}
          </div>
          <div className="stat-label">Total Spent</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-list"></i>
          </div>
          <div className="stat-value text-info">
            {transactions.length}
          </div>
          <div className="stat-label">Total Transactions</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid-2">
        {/* Recent Transactions */}
        <div>
          <div className='card'>
            <div className="card-header">
              <i className="fas fa-history"></i>
              <h3>Recent Transactions</h3>
            </div>
            {recentTransactions.length > 0 ? (
              <div className="transactions-list">
                {recentTransactions.map(transaction => (
                  <div key={transaction._id} className='transaction-item'>
                    <div>
                      <div className="transaction-description">
                        {transaction.description}
                      </div>
                      <div className="transaction-date">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="transaction-amount">
                      <span
                        className={
                          transaction.type === 'credit'
                            ? 'text-success'
                            : 'text-danger'
                        }
                      >
                        {transaction.type === 'credit' ? '+' : '-'}
                        ${transaction.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <i className="fas fa-inbox" style={{ fontSize: '3rem', color: '#ccc', marginBottom: '1rem' }}></i>
                <p>No transactions yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Services */}
        <div>
          <div className='card'>
            <div className="card-header">
              <i className="fas fa-rocket"></i>
              <h3>Quick Actions</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <a href="/transactions" className="btn btn-primary" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                padding: '1.5rem 1rem',
                textDecoration: 'none'
              }}>
                <i className="fas fa-exchange-alt" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                <span>Transactions</span>
              </a>
              
              <a href="/bill-payments" className="btn btn-success" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                padding: '1.5rem 1rem',
                textDecoration: 'none'
              }}>
                <i className="fas fa-file-invoice-dollar" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                <span>Pay Bills</span>
              </a>
              
              <a href="/loans" className="btn btn-info" style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                padding: '1.5rem 1rem',
                textDecoration: 'none'
              }}>
                <i className="fas fa-handshake" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                <span>Loans</span>
              </a>
              
              <button 
                className="btn btn-secondary"
                onClick={() => window.location.reload()}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  padding: '1.5rem 1rem'
                }}
              >
                <i className="fas fa-sync-alt" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Banking Services */}
          <div className='card'>
            <div className="card-header">
              <i className="fas fa-concierge-bell"></i>
              <h3>Banking Services</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0.75rem',
                background: 'rgba(255, 107, 53, 0.1)',
                borderRadius: '8px'
              }}>
                <i className="fas fa-file-invoice-dollar text-primary" style={{ fontSize: '1.5rem', marginRight: '1rem' }}></i>
                <div>
                  <strong>Bill Payments</strong>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#6c757d' }}>
                    Pay utilities, rent, and more
                  </p>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0.75rem',
                background: 'rgba(76, 175, 80, 0.1)',
                borderRadius: '8px'
              }}>
                <i className="fas fa-handshake text-success" style={{ fontSize: '1.5rem', marginRight: '1rem' }}></i>
                <div>
                  <strong>Personal Loans</strong>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#6c757d' }}>
                    Competitive rates from 5.8% APR
                  </p>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0.75rem',
                background: 'rgba(52, 152, 219, 0.1)',
                borderRadius: '8px'
              }}>
                <i className="fas fa-shield-alt text-info" style={{ fontSize: '1.5rem', marginRight: '1rem' }}></i>
                <div>
                  <strong>Secure Banking</strong>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#6c757d' }}>
                    Bank-grade security & encryption
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className='card'>
            <div className="card-header">
              <i className="fas fa-trending-up"></i>
              <h3>Account Status</h3>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              {currentBalance > 500 ? (
                <div>
                  <i className="fas fa-check-circle text-success" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                  <p className="text-success">Healthy Balance</p>
                  <small style={{ color: '#6c757d' }}>Your account is in good standing</small>
                </div>
              ) : currentBalance > 100 ? (
                <div>
                  <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                  <p className="text-warning">Low Balance Warning</p>
                  <small style={{ color: '#6c757d' }}>Consider adding funds to your account</small>
                </div>
              ) : (
                <div>
                  <i className="fas fa-times-circle text-danger" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}></i>
                  <p className="text-danger">Critical Balance</p>
                  <small style={{ color: '#6c757d' }}>Please add funds immediately</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bank Logo Component */}
      <BankLogo />
    </div>
  );
};

export default Dashboard;
