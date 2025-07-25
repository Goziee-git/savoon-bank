import React, { useState, useEffect, useContext } from 'react';
import TransactionContext from '../context/transaction/transactionContext';
import AnalyticsContext from '../context/analytics/analyticsContext';

// Analytics Components
import AnalyticsStats from '../components/analytics/AnalyticsStats';
import SpendingChart from '../components/analytics/SpendingChart';
import CategoryChart from '../components/analytics/CategoryChart';
import MonthlyTrendsChart from '../components/analytics/MonthlyTrendsChart';
import LoanProgressChart from '../components/analytics/LoanProgressChart';
import InsightsPanel from '../components/analytics/InsightsPanel';
import FinancialReportGenerator from '../components/analytics/FinancialReportGenerator';

const Analytics = () => {
  const transactionContext = useContext(TransactionContext);
  const analyticsContext = useContext(AnalyticsContext);

  const { transactions, getTransactions } = transactionContext;
  const { 
    analyticsData, 
    loading, 
    error, 
    generateAnalyticsData, 
    setDateRange 
  } = analyticsContext;

  const [selectedDateRange, setSelectedDateRange] = useState(30);

  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      getTransactions();
    }
  }, [getTransactions, transactions]);

  // Generate analytics data when transactions or date range change
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      generateAnalyticsData(transactions, 30); // Defaulting to 30 days
    }
  }, [transactions, generateAnalyticsData]);

  const handleDateRangeChange = (range) => {
    setSelectedDateRange(range);
    setDateRange(range);
  };

  const dateRangeOptions = [
    { value: 7, label: '7 Days' },
    { value: 30, label: '30 Days' },
    { value: 90, label: '3 Months' },
    { value: 180, label: '6 Months' },
    { value: 365, label: '1 Year' }
  ];

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-loading">
          <div className="loading-spinner"></div>
          <p>Generating your financial analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-page">
        <div className="analytics-error">
          <h2>Analytics Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => generateAnalyticsData(transactions, selectedDateRange)}
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="analytics-page">
        <div className="analytics-header">
          <h1>
            <i className="fas fa-chart-line" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }}></i>
            Financial Analytics
          </h1>
          <p>Get insights into your spending, savings, and financial health</p>
        </div>
        <div className="no-data-message">
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <i className="fas fa-chart-bar" style={{ fontSize: '4rem', color: '#ccc', marginBottom: '1rem' }}></i>
            <h2>No Transaction Data Available</h2>
            <p>You need to have some transactions to view analytics. Start by making some transactions!</p>
            <a href="/transactions" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              <i className="fas fa-plus"></i>
              Make Your First Transaction
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="analytics-header">
        <div className="header-content">
          <h1>
            <i className="fas fa-chart-line" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }}></i>
            Financial Analytics
          </h1>
          <p>Comprehensive insights into your financial health and spending patterns</p>
        </div>
        
        {/* Date Range Selector */}
        <div className="date-range-selector">
          <label htmlFor="dateRange">
            <i className="fas fa-calendar-alt" style={{ marginRight: '0.5rem' }}></i>
            Time Period:
          </label>
          <select
            id="dateRange"
            value={selectedDateRange}
            onChange={(e) => handleDateRangeChange(parseInt(e.target.value))}
            className="date-range-select"
          >
            {dateRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Analytics Stats Overview */}
      <AnalyticsStats analyticsData={analyticsData} />

      {/* Charts Grid */}
      <div className="analytics-charts-grid">
        {/* Spending Trend Chart */}
        <div className="chart-section">
          <SpendingChart 
            data={analyticsData?.dailySpending || []} 
            title="Daily Spending Trend"
          />
        </div>

        {/* Category Breakdown */}
        <div className="chart-section">
          <CategoryChart 
            data={analyticsData?.spendingByCategory || {}} 
            title="Spending by Category"
          />
        </div>

        {/* Monthly Trends */}
        <div className="chart-section full-width">
          <MonthlyTrendsChart 
            data={analyticsData?.monthlyTrends || []} 
            title="Monthly Income vs Spending Trends"
          />
        </div>

        {/* Loan Progress */}
        <div className="chart-section full-width">
          <LoanProgressChart 
            loans={analyticsData?.loans || []} 
            title="Loan Progress Overview"
          />
        </div>
      </div>

      {/* Financial Report Generator */}
      <div className="analytics-section">
        <FinancialReportGenerator 
          analyticsData={analyticsData} 
          transactions={transactions}
        />
      </div>

      {/* Insights Panel */}
      <InsightsPanel 
        insights={analyticsData?.insights || []} 
        title="AI-Powered Financial Insights"
      />

      {/* Export Options */}
      <div className="analytics-actions">
        <button 
          className="btn btn-secondary"
          onClick={() => window.print()}
        >
          <i className="fas fa-print"></i>
          Print Analytics
        </button>
        <button 
          className="btn btn-primary"
          onClick={() => generateAnalyticsData(transactions, selectedDateRange)}
        >
          <i className="fas fa-sync-alt"></i>
          Refresh Analytics
        </button>
        <a 
          href="/dashboard" 
          className="btn btn-info"
        >
          <i className="fas fa-arrow-left"></i>
          Back to Dashboard
        </a>
      </div>
    </div>
  );
};

export default Analytics;
