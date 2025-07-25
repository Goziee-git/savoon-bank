import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { calculateLoanProgress, formatCurrency } from '../../utils/analyticsUtils';

const LoanProgressChart = ({ loans, title = "Loan Progress Overview" }) => {
  // Process loan data for chart
  const chartData = loans
    .filter(loan => loan.status === 'active')
    .map(loan => {
      const progress = calculateLoanProgress(loan);
      return {
        name: loan.type,
        paid: progress.totalPaid,
        remaining: loan.remainingBalance,
        progress: progress.progressPercentage,
        monthlyPayment: loan.monthlyPayment,
        interestRate: loan.interestRate
      };
    });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="analytics-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">
            <span className="tooltip-color" style={{ color: '#4caf50' }}>●</span>
            {` Paid: ${formatCurrency(data.paid)}`}
          </p>
          <p className="tooltip-value">
            <span className="tooltip-color" style={{ color: '#ff6b35' }}>●</span>
            {` Remaining: ${formatCurrency(data.remaining)}`}
          </p>
          <p className="tooltip-value">
            {`Progress: ${data.progress.toFixed(1)}%`}
          </p>
          <p className="tooltip-value">
            {`Monthly Payment: ${formatCurrency(data.monthlyPayment)}`}
          </p>
          <p className="tooltip-value">
            {`Interest Rate: ${data.interestRate}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">{title}</h3>
        <div className="no-data">
          <p>No active loans found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            layout="horizontal"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number"
              stroke="#666"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <YAxis 
              type="category"
              dataKey="name"
              stroke="#666"
              fontSize={12}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="paid" 
              stackId="loan"
              fill="#4caf50" 
              name="Amount Paid"
              radius={[0, 2, 2, 0]}
            />
            <Bar 
              dataKey="remaining" 
              stackId="loan"
              fill="#ff6b35" 
              name="Remaining Balance"
              radius={[2, 0, 0, 2]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Loan Summary Cards */}
      <div className="loan-summary-grid">
        {chartData.map((loan, index) => (
          <div key={index} className="loan-summary-card">
            <h4>{loan.name}</h4>
            <div className="loan-progress-bar">
              <div 
                className="loan-progress-fill"
                style={{ width: `${loan.progress}%` }}
              ></div>
            </div>
            <div className="loan-details">
              <span>{loan.progress.toFixed(1)}% Complete</span>
              <span>{formatCurrency(loan.monthlyPayment)}/month</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanProgressChart;
