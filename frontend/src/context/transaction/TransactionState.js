import React, { useReducer } from 'react';
import axios from 'axios';
import TransactionContext from './transactionContext';
import transactionReducer from './transactionReducer';
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
      const res = await axios.get('/api/transactions');

      dispatch({
        type: GET_TRANSACTIONS,
        payload: res.data.data.transactions
      });
    } catch (err) {
      dispatch({
        type: TRANSACTION_ERROR,
        payload: err.response.data.message
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
      const res = await axios.post('/api/transactions/spend', transaction, config);

      dispatch({
        type: ADD_TRANSACTION,
        payload: res.data.data.transaction
      });

      return res.data.data.newBalance;
    } catch (err) {
      dispatch({
        type: TRANSACTION_ERROR,
        payload: err.response.data.message
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
        clearTransactions
      }}
    >
      {props.children}
    </TransactionContext.Provider>
  );
};

export default TransactionState;
