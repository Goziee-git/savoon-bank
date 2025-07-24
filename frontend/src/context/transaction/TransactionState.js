import React, { useReducer } from 'react';
import axios from 'axios';
import TransactionContext from './transactionContext';
import transactionReducer from './transactionReducer';
import { mockGetTransactions, mockAddTransaction, mockAddCredit } from '../../utils/mockTransactions';
import {
  GET_TRANSACTIONS,
  ADD_TRANSACTION,
  TRANSACTION_ERROR,
  SET_LOADING,
  CLEAR_TRANSACTIONS
} from '../types';

const TransactionState = props => {
  const initialState = {
    transactions: [],
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Get Transactions
  const getTransactions = async () => {
    try {
      setLoading();
      let res;
      try {
        // Try real API first
        res = await axios.get('/api/transactions');
      } catch (err) {
        // Fall back to mock if real API fails
        console.log('Using mock transactions');
        res = await mockGetTransactions();
      }

      dispatch({
        type: GET_TRANSACTIONS,
        payload: res.data.data.transactions
      });
    } catch (err) {
      dispatch({
        type: TRANSACTION_ERROR,
        payload: err.response?.data?.message || err.message || 'Failed to load transactions'
      });
    }
  };

  // Add Transaction (Spend)
  const addTransaction = async transaction => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      setLoading();
      let res;
      try {
        // Try real API first
        res = await axios.post('/api/transactions/spend', transaction, config);
      } catch (err) {
        // Fall back to mock if real API fails
        console.log('Using mock transaction system');
        res = await mockAddTransaction(transaction);
      }

      dispatch({
        type: ADD_TRANSACTION,
        payload: res.data.data.transaction
      });

      return res.data.data.newBalance;
    } catch (err) {
      dispatch({
        type: TRANSACTION_ERROR,
        payload: err.response?.data?.message || err.message || 'Transaction failed'
      });
      throw err;
    }
  };

  // Add Credit
  const addCredit = async (amount) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      setLoading();
      let res;
      try {
        // Try real API first
        res = await axios.post('/api/transactions/credit', { amount }, config);
      } catch (err) {
        // Fall back to mock if real API fails
        console.log('Using mock credit system');
        res = await mockAddCredit(amount);
      }

      dispatch({
        type: ADD_TRANSACTION,
        payload: res.data.data.transaction
      });

      return res.data.data.newBalance;
    } catch (err) {
      dispatch({
        type: TRANSACTION_ERROR,
        payload: err.response?.data?.message || err.message || 'Credit addition failed'
      });
      throw err;
    }
  };

  // Clear Transactions
  const clearTransactions = () => {
    dispatch({ type: CLEAR_TRANSACTIONS });
  };

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <TransactionContext.Provider
      value={{
        transactions: state.transactions,
        loading: state.loading,
        error: state.error,
        getTransactions,
        addTransaction,
        addCredit,
        clearTransactions
      }}
    >
      {props.children}
    </TransactionContext.Provider>
  );
};

export default TransactionState;
