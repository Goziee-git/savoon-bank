import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/auth/authContext';

const Register = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const { register, error, isAuthenticated, clearErrors, loading } = authContext;
  const [showSuccess, setShowSuccess] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    if (error) {
      console.error('Registration error:', error);
      setTimeout(() => {
        clearErrors();
      }, 5000);
    }
  }, [isAuthenticated, error, navigate, clearErrors]);

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    
    if (!name || !email || !password || !password2) {
      alert('Please fill in all fields');
      return;
    }
    
    if (password !== password2) {
      alert('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    clearErrors();
    
    try {
      const result = await register({
        name,
        email,
        password
      });
      
      // If registration requires email confirmation
      if (result?.requiresEmailConfirmation) {
        setRegistrationEmail(email);
        setShowSuccess(true);
        setTimeout(() => {
          navigate(`/confirm-email?email=${encodeURIComponent(email)}`);
        }, 3000);
      }
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  if (showSuccess) {
    return (
      <div className='form-container'>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-envelope-circle-check" style={{ fontSize: '4rem', color: 'var(--success-color)', marginBottom: '1rem' }}></i>
          <h1 style={{ color: 'var(--success-color)', marginBottom: '1rem' }}>
            Registration Successful!
          </h1>
          <p className="lead" style={{ marginBottom: '1rem' }}>
            Welcome to Savoon Bank, {name}!
          </p>
          <div className="alert alert-info">
            <i className="fas fa-info-circle"></i>
            Please check your email to confirm your account before logging in.
          </div>
          <div style={{ 
            background: 'rgba(255, 107, 53, 0.1)', 
            padding: '1rem', 
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <p style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
              📧 Confirmation email sent to:
            </p>
            <p style={{ color: 'var(--dark-color)', fontWeight: '500' }}>
              {registrationEmail}
            </p>
          </div>
          <p style={{ color: '#6c757d' }}>
            Redirecting to email confirmation...
          </p>
          <div className="spinner" style={{ margin: '1rem auto' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className='form-container'>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <i className="fas fa-university" style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1rem' }}></i>
        <h1 style={{ marginBottom: '0.5rem' }}>
          Join <span className='text-primary'>Savoon Bank</span>
        </h1>
        <p className="lead" style={{ fontSize: '1rem', color: '#6c757d' }}>
          Open your digital banking account today
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
          <label htmlFor='name'>
            <i className="fas fa-user"></i>
            Full Name
          </label>
          <input
            type='text'
            name='name'
            value={name}
            onChange={onChange}
            required
            placeholder="Enter your full name"
          />
        </div>
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
          <small className="text-small">
            We'll send a confirmation code to this email
          </small>
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
            minLength='6'
            placeholder="Create a secure password (min 6 characters)"
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password2'>
            <i className="fas fa-lock"></i>
            Confirm Password
          </label>
          <input
            type='password'
            name='password2'
            value={password2}
            onChange={onChange}
            required
            minLength='6'
            placeholder="Confirm your password"
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
              Creating Account...
            </>
          ) : (
            <>
              <i className="fas fa-user-plus"></i>
              Open Account
            </>
          )}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
        <p style={{ color: '#6c757d' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: 'var(--primary-color)', fontWeight: '500' }}>
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
