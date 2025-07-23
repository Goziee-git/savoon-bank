import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/auth/authContext';

const Login = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const { login, error, isAuthenticated, clearErrors } = authContext;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const { email, password } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    login({
      email,
      password
    });
  };

  return (
    <div className='form-container'>
      <h1>
        Account <span className='text-primary'>Login</span>
      </h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='email'>Email Address</label>
          <input
            type='email'
            name='email'
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            name='password'
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <input
          type='submit'
          value='Login'
          className='btn btn-primary btn-block'
        />
      </form>
    </div>
  );
};

export default Login;
