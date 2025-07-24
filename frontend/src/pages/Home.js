import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthContext from '../context/auth/authContext';

const Home = () => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated } = authContext;

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className='container'>
      <div className='all-center' style={{ minHeight: '70vh', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px' }}>
          <h1 className='x-large' style={{ marginBottom: '2rem' }}>
            <i className="fas fa-university" style={{ marginRight: '1rem', color: 'var(--primary-color)' }}></i>
            Welcome to Savoon Bank
          </h1>
          <p className='lead' style={{ fontSize: '1.5rem', marginBottom: '3rem', color: '#6c757d' }}>
            Your trusted digital banking partner. Experience modern banking with our secure, 
            intuitive platform designed to make managing your finances effortless and enjoyable.
          </p>

          {/* Features Grid */}
          <div className="grid-3" style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <i className="fas fa-shield-alt" style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1rem' }}></i>
              <h3>Bank-Grade Security</h3>
              <p>Your money and data are protected with military-grade encryption and security protocols</p>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <i className="fas fa-chart-line" style={{ fontSize: '3rem', color: 'var(--secondary-color)', marginBottom: '1rem' }}></i>
              <h3>Smart Analytics</h3>
              <p>Track your spending patterns and financial health with intelligent insights and reports</p>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <i className="fas fa-mobile-alt" style={{ fontSize: '3rem', color: 'var(--info-color)', marginBottom: '1rem' }}></i>
              <h3>Digital First</h3>
              <p>Access your account anywhere, anytime with our responsive web platform</p>
            </div>
          </div>

          <div className='buttons' style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to='/register' className='btn btn-primary' style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              <i className="fas fa-user-plus"></i>
              Open Account
            </Link>
            <Link to='/login' className='btn btn-secondary' style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              <i className="fas fa-sign-in-alt"></i>
              Sign In
            </Link>
          </div>

          <div style={{ marginTop: '3rem', padding: '2rem', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--border-radius)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--dark-color)' }}>
              <i className="fas fa-star" style={{ marginRight: '0.5rem', color: '#FFD700' }}></i>
              Join the Savoon Bank Family
            </h3>
            <p style={{ marginBottom: '1.5rem', color: '#6c757d' }}>
              Thousands of customers trust Savoon Bank for their digital banking needs. 
              Experience the future of banking today.
            </p>
            <Link to='/register' className='btn btn-success' style={{ padding: '0.75rem 1.5rem' }}>
              <i className="fas fa-arrow-right"></i>
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
