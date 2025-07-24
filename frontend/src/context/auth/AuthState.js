import React, { useReducer, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import authReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken';
import { mockLogin, mockRegister, mockLoadUser } from '../../utils/mockAuth';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS
} from '../types';

const AuthState = props => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: localStorage.getItem('token') ? true : false,
    loading: false,
    user: JSON.parse(localStorage.getItem('currentUser') || 'null'),
    error: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on component mount
  useEffect(() => {
    if (localStorage.token) {
      loadUser();
    }
  }, []);

  // Load User
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    } else {
      dispatch({ type: AUTH_ERROR });
      return;
    }

    try {
      let res;
      try {
        // Try real API first
        res = await axios.get('/api/auth/me');
      } catch (err) {
        // Fall back to mock if real API fails
        console.log('Using mock authentication');
        res = await mockLoadUser();
      }

      const userData = res.data.data?.user || res.data.user || res.data;
      
      // Store user data in localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));

      dispatch({
        type: USER_LOADED,
        payload: userData
      });
    } catch (err) {
      console.error('Load user error:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      setAuthToken(null);
      dispatch({ type: AUTH_ERROR });
    }
  };

  // Register User
  const register = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      let res;
      try {
        // Try real API first
        res = await axios.post('/api/auth/register', formData, config);
      } catch (err) {
        // Fall back to mock if real API fails
        console.log('Using mock authentication');
        res = await mockRegister(formData.name, formData.email, formData.password);
      }

      // Check if email confirmation is required
      if (res.data.requiresEmailConfirmation) {
        // Don't set as authenticated yet, just return the result
        return res.data;
      }

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });

      // Set token in localStorage and axios headers
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);
      }

      // Store user data immediately
      if (res.data.user) {
        localStorage.setItem('currentUser', JSON.stringify(res.data.user));
      }

      await loadUser();
      return res.data;
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response?.data?.message || err.message || 'Registration failed'
      });
      throw err;
    }
  };

  // Login User
  const login = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      let res;
      try {
        // Try real API first
        res = await axios.post('/api/auth/login', formData, config);
      } catch (err) {
        // Fall back to mock if real API fails
        console.log('Using mock authentication');
        res = await mockLogin(formData.email, formData.password);
      }

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });

      // Set token in localStorage and axios headers
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);
      }

      // Store user data immediately
      if (res.data.user) {
        localStorage.setItem('currentUser', JSON.stringify(res.data.user));
      }

      // Load user data after successful login
      await loadUser();
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response?.data?.message || err.message || 'Login failed'
      });
      throw err;
    }
  };

  // Confirm Email
  const confirmEmail = async (email, code) => {
    try {
      // Mock email confirmation
      if (code && code.length === 6) {
        // Get pending registration data
        const pendingRegistration = JSON.parse(localStorage.getItem('pendingRegistration') || '{}');
        
        if (pendingRegistration.email === email) {
          // Mark email as confirmed
          localStorage.setItem('emailConfirmed', 'true');
          localStorage.removeItem('pendingRegistration');
          localStorage.removeItem('pendingEmail');
          
          return { success: true };
        }
      }
      throw new Error('Invalid confirmation code');
    } catch (err) {
      throw err;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('emailConfirmed');
    localStorage.removeItem('pendingRegistration');
    localStorage.removeItem('pendingEmail');
    setAuthToken(null);
    dispatch({ type: LOGOUT });
  };

  // Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        loadUser,
        login,
        confirmEmail,
        logout,
        clearErrors
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
