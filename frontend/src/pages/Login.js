import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/auth/authContext';

const Login = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const { login, error, isAuthenticated, clearErrors, loading } = authContext;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    if (error) {
      console.error('Login error:', error);
      // Clear errors after showing them
      setTimeout(() => {
        clearErrors();
      }, 5000);
    }
  }, [isAuthenticated, error, navigate, clearErrors]);

  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const { email, password } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (email === '' || password === '') {
      console.error('Please fill in all fields');
      return;
    }
    
    clearErrors();
    await login({
      email,
      password
    });
  };

  return (
    <div className='form-container'>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <i className="fas fa-university" style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1rem' }}></i>
        <h1 style={{ marginBottom: '0.5rem' }}>
          Welcome Back to <span className='text-primary'>Savoon Bank</span>
        </h1>
        <p className="lead" style={{ fontSize: '1rem', color: '#6c757d' }}>
          Sign in to access your account
        </p>
      </div>
      
      {error && (
        <div className='alert alert-danger'>
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}
      
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='email'>
            <i className="fas fa-envelope"></i>
            Email Address
          </label>
          <input
            type='email'
            name='email'
            value={email}
            onChange={onChange}
            required
            placeholder="Enter your email address"
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>
            <i className="fas fa-lock"></i>
            Password
          </label>
          <input
            type='password'
            name='password'
            value={password}
            onChange={onChange}
            required
            placeholder="Enter your password"
          />
        </div>
        <button
          type='submit'
          className='btn btn-primary btn-block'
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Signing In...
            </>
          ) : (
            <>
              <i className="fas fa-sign-in-alt"></i>
              Sign In
            </>
          )}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
        <p style={{ color: '#6c757d' }}>
          Don't have an account?{' '}
          <a href="/register" style={{ color: 'var(--primary-color)', fontWeight: '500' }}>
            Open Account
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
