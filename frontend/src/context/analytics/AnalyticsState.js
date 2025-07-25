import React, { useReducer } from 'react';
import AnalyticsContext from './analyticsContext';
import analyticsReducer from './analyticsReducer';
import {
  processTransactionsForAnalytics,
  processMonthlyTrends,
  generateMockLoans,
  generateSpendingInsights
} from '../../utils/analyticsUtils';
import {
  GET_ANALYTICS_DATA,
  ANALYTICS_ERROR,
  SET_ANALYTICS_LOADING,
  SET_DATE_RANGE,
  CLEAR_ANALYTICS
} from '../types';

const AnalyticsState = props => {
  const initialState = {
    analyticsData: null,
    monthlyTrends: [],
    loans: [],
    insights: [],
    dateRange: 30,
    loading: false,
    error: null
  };

  const [state, dispatch] = useReducer(analyticsReducer, initialState);

  // Generate Analytics Data
  const generateAnalyticsData = async (transactions, dateRange = 30) => {
    try {
      setLoading();

      // Process transaction data
      const analyticsData = processTransactionsForAnalytics(transactions, dateRange);
      
      // Generate monthly trends
      const monthlyTrends = processMonthlyTrends(transactions, 6);
      
      // Get loan data (mock for now)
      const loans = generateMockLoans();
      
      // Generate insights
      const insights = generateSpendingInsights(analyticsData, loans);

      const payload = {
        ...analyticsData,
        monthlyTrends,
        loans,
        insights,
        dateRange
      };

      dispatch({
        type: GET_ANALYTICS_DATA,
        payload
      });

      return payload;
    } catch (err) {
      dispatch({
        type: ANALYTICS_ERROR,
        payload: err.message || 'Failed to generate analytics data'
      });
      throw err;
    }
  };

  // Set Date Range
  const setDateRange = (range) => {
    dispatch({
      type: SET_DATE_RANGE,
      payload: range
    });
  };

  // Clear Analytics
  const clearAnalytics = () => {
    dispatch({ type: CLEAR_ANALYTICS });
  };

  // Set Loading
  const setLoading = () => dispatch({ type: SET_ANALYTICS_LOADING });

  return (
    <AnalyticsContext.Provider
      value={{
        analyticsData: state.analyticsData,
        dateRange: state.dateRange,
        loading: state.loading,
        error: state.error,
        generateAnalyticsData,
        setDateRange,
        clearAnalytics
      }}
    >
      {props.children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsState;
