import React from 'react';
import { formatCurrency, calculateSavingsRate } from '../../utils/analyticsUtils';

const AnalyticsStats = ({ analyticsData }) => {
  if (!analyticsData) {
    return (
      <div className="analytics-stats">
        <div className="stats-loading">Loading analytics...</div>
      </div>
    );
  }

  const {
    totalSpending,
    totalIncome,
    netSavings,
    transactionCount,
    avgDailySpending
  } = analyticsData;

  const savingsRate = calculateSavingsRate(totalIncome, totalSpending);

  const stats = [
    {
      title: 'Total Income',
      value: formatCurrency(totalIncome),
      icon: '💰',
      color: 'stat-positive',
      subtitle: `${analyticsData.dateRange} days`,
      description: 'All money received including deposits, transfers, and credits to your account'
    },
    {
      title: 'Total Spending',
      value: formatCurrency(totalSpending),
      icon: '💸',
      color: 'stat-negative',
      subtitle: `${transactionCount} transactions`,
      description: 'All money spent including purchases, bills, transfers, and withdrawals'
    },
    {
      title: 'Net Savings',
      value: formatCurrency(netSavings),
      icon: netSavings >= 0 ? '📈' : '📉',
      color: netSavings >= 0 ? 'stat-positive' : 'stat-negative',
      subtitle: `${savingsRate.toFixed(1)}% savings rate`,
      description: netSavings >= 0 ? 'Amount saved (Income - Spending)' : 'Amount overspent (Spending exceeded Income)'
    },
    {
      title: 'Daily Average',
      value: formatCurrency(avgDailySpending),
      icon: '📊',
      color: 'stat-neutral',
      subtitle: 'Average daily spending',
      description: 'Your average spending per day over the selected time period'
    }
  ];

  return (
    <div className="analytics-stats">
      {/* Stats Overview Header */}
      <div className="stats-header">
        <h2>
          <i className="fas fa-chart-bar" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }}></i>
          Financial Overview
        </h2>
        <p>Key metrics for the last {analyticsData.dateRange} days</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-header">
              <span className="stat-icon">{stat.icon}</span>
              <h3 className="stat-title">{stat.title}</h3>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-subtitle">{stat.subtitle}</div>
            <div className="stat-description">{stat.description}</div>
          </div>
        ))}
      </div>

      {/* Financial Health Indicator */}
      <div className="financial-health-indicator">
        <h3>
          <i className="fas fa-heartbeat" style={{ marginRight: '0.5rem' }}></i>
          Financial Health Score
        </h3>
        <div className="health-score">
          {savingsRate >= 20 ? (
            <div className="health-excellent">
              <i className="fas fa-star"></i>
              <span>Excellent ({savingsRate.toFixed(1)}%)</span>
              <p>You're saving over 20% of your income. Keep up the great work!</p>
            </div>
          ) : savingsRate >= 10 ? (
            <div className="health-good">
              <i className="fas fa-thumbs-up"></i>
              <span>Good ({savingsRate.toFixed(1)}%)</span>
              <p>You're saving 10-20% of your income. Consider increasing your savings rate.</p>
            </div>
          ) : savingsRate >= 0 ? (
            <div className="health-fair">
              <i className="fas fa-exclamation-triangle"></i>
              <span>Fair ({savingsRate.toFixed(1)}%)</span>
              <p>You're saving less than 10%. Try to reduce expenses or increase income.</p>
            </div>
          ) : (
            <div className="health-poor">
              <i className="fas fa-times-circle"></i>
              <span>Needs Attention ({savingsRate.toFixed(1)}%)</span>
              <p>You're spending more than you earn. Review your budget immediately.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsStats;
