import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthContext from '../context/auth/authContext';

const EmailConfirmation = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  
  const { confirmEmail, error, clearErrors } = authContext;
  const [confirmationCode, setConfirmationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Get email from URL params or localStorage
    const emailParam = searchParams.get('email');
    const storedEmail = localStorage.getItem('pendingEmail');
    
    if (emailParam) {
      setEmail(emailParam);
      localStorage.setItem('pendingEmail', emailParam);
    } else if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email found, redirect to register
      navigate('/register');
    }
  }, [searchParams, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!confirmationCode) {
      setMessage('Please enter the confirmation code');
      return;
    }

    setLoading(true);
    clearErrors();

    try {
      // Mock email confirmation - in real app, this would verify with backend
      if (confirmationCode === '123456' || confirmationCode.length === 6) {
        // Simulate successful confirmation
        localStorage.removeItem('pendingEmail');
        localStorage.setItem('emailConfirmed', 'true');
        
        setMessage('Email confirmed successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage('Invalid confirmation code. Please try again.');
      }
    } catch (err) {
      setMessage('Confirmation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setResendLoading(true);
    
    // Mock resend functionality
    setTimeout(() => {
      setMessage('Confirmation code resent to your email!');
      setResendLoading(false);
    }, 1000);
  };

  return (
    <div className='form-container'>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <i className="fas fa-envelope-open" style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1rem' }}></i>
        <h1 style={{ marginBottom: '0.5rem' }}>
          Confirm Your <span className='text-primary'>Email</span>
        </h1>
        <p className="lead" style={{ fontSize: '1rem', color: '#6c757d' }}>
          We've sent a confirmation code to
        </p>
        <p style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
          {email}
        </p>
      </div>

      {message && (
        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-info'}`}>
          <i className={`fas ${message.includes('successfully') ? 'fa-check-circle' : 'fa-info-circle'}`}></i>
          {message}
        </div>
      )}

      {error && (
        <div className='alert alert-danger'>
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='confirmationCode'>
            <i className="fas fa-key"></i>
            Confirmation Code
          </label>
          <input
            type='text'
            name='confirmationCode'
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            required
            placeholder="Enter 6-digit confirmation code"
            maxLength="6"
            style={{ 
              textAlign: 'center', 
              fontSize: '1.5rem', 
              letterSpacing: '0.5rem',
              fontWeight: '600'
            }}
          />
          <small className="text-small">
            Enter the 6-digit code sent to your email
          </small>
        </div>

        <button
          type='submit'
          className='btn btn-primary btn-block'
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Confirming...
            </>
          ) : (
            <>
              <i className="fas fa-check"></i>
              Confirm Email
            </>
          )}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
        <p style={{ color: '#6c757d', marginBottom: '1rem' }}>
          Didn't receive the code?
        </p>
        <button
          className="btn btn-secondary"
          onClick={resendCode}
          disabled={resendLoading}
        >
          {resendLoading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Resending...
            </>
          ) : (
            <>
              <i className="fas fa-redo"></i>
              Resend Code
            </>
          )}
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
          <strong>Demo:</strong> Use any 6-digit code (e.g., 123456) to confirm
        </p>
      </div>
    </div>
  );
};

export default EmailConfirmation;
