import React, { useState, useContext } from 'react';
import AuthContext from '../../context/auth/authContext';
import { formatCurrency, calculateSavingsRate } from '../../utils/analyticsUtils';

const FinancialReportGenerator = ({ analyticsData, transactions }) => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  
  const [reportType, setReportType] = useState('summary');
  const [generatedReport, setGeneratedReport] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = () => {
    if (!analyticsData || !transactions) {
      alert('No data available to generate report');
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      let report = '';
      const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      if (reportType === 'summary') {
        report = generateSummaryReport(currentDate);
      } else if (reportType === 'detailed') {
        report = generateDetailedReport(currentDate);
      } else if (reportType === 'statement') {
        report = generateAccountStatement(currentDate);
      }

      setGeneratedReport(report);
      setIsGenerating(false);
    }, 1500);
  };

  const generateSummaryReport = (date) => {
    const { totalIncome, totalSpending, netSavings, transactionCount, avgDailySpending } = analyticsData;
    const savingsRate = calculateSavingsRate(totalIncome, totalSpending);

    return `
═══════════════════════════════════════════════════════════════
                    SAVOON BANK FINANCIAL SUMMARY
═══════════════════════════════════════════════════════════════

Account Holder: ${user?.name || 'Valued Customer'}
Report Date: ${date}
Period: Last ${analyticsData.dateRange} days
Report Type: Financial Summary

───────────────────────────────────────────────────────────────
                        FINANCIAL OVERVIEW
───────────────────────────────────────────────────────────────

💰 Total Income:           ${formatCurrency(totalIncome)}
💸 Total Spending:         ${formatCurrency(totalSpending)}
📈 Net Savings:            ${formatCurrency(netSavings)}
📊 Daily Average Spending: ${formatCurrency(avgDailySpending)}
🔢 Total Transactions:     ${transactionCount}

───────────────────────────────────────────────────────────────
                        FINANCIAL HEALTH
───────────────────────────────────────────────────────────────

Savings Rate: ${savingsRate.toFixed(2)}%

${savingsRate >= 20 ? 
  '🌟 EXCELLENT: You are saving over 20% of your income. This is outstanding financial discipline!' :
  savingsRate >= 10 ?
  '👍 GOOD: You are saving 10-20% of your income. Consider increasing your savings rate to 20%.' :
  savingsRate >= 0 ?
  '⚠️  FAIR: You are saving less than 10%. Focus on reducing expenses or increasing income.' :
  '🚨 ATTENTION NEEDED: You are spending more than you earn. Immediate budget review required.'
}

───────────────────────────────────────────────────────────────
                           RECOMMENDATIONS
───────────────────────────────────────────────────────────────

${netSavings >= 0 ? 
  `• Continue your excellent saving habits
• Consider investing your savings for long-term growth
• Set up automatic transfers to savings account
• Review and optimize your spending categories` :
  `• Create a strict budget to control spending
• Identify and eliminate unnecessary expenses
• Consider additional income sources
• Set up spending alerts to monitor expenses`
}

───────────────────────────────────────────────────────────────

This report was generated automatically by Savoon Bank Analytics.
For questions, contact support@savoonbank.com

═══════════════════════════════════════════════════════════════
`;
  };

  const generateDetailedReport = (date) => {
    const { totalIncome, totalSpending, netSavings, spendingByCategory } = analyticsData;
    const savingsRate = calculateSavingsRate(totalIncome, totalSpending);

    let categoryBreakdown = '';
    if (spendingByCategory) {
      categoryBreakdown = Object.entries(spendingByCategory)
        .sort(([,a], [,b]) => b - a)
        .map(([category, amount]) => 
          `• ${category.charAt(0).toUpperCase() + category.slice(1)}: ${formatCurrency(amount)}`
        ).join('\n');
    }

    const recentTransactions = transactions.slice(0, 10).map(t => 
      `${new Date(t.createdAt).toLocaleDateString()} | ${t.type === 'credit' ? '+' : '-'}${formatCurrency(t.amount)} | ${t.description}`
    ).join('\n');

    return `
═══════════════════════════════════════════════════════════════
                  SAVOON BANK DETAILED FINANCIAL REPORT
═══════════════════════════════════════════════════════════════

Account Holder: ${user?.name || 'Valued Customer'}
Report Date: ${date}
Period: Last ${analyticsData.dateRange} days
Report Type: Detailed Analysis

───────────────────────────────────────────────────────────────
                        EXECUTIVE SUMMARY
───────────────────────────────────────────────────────────────

During the ${analyticsData.dateRange}-day period ending ${date}, your account 
showed the following activity:

Total Income:     ${formatCurrency(totalIncome)}
Total Spending:   ${formatCurrency(totalSpending)}
Net Position:     ${formatCurrency(netSavings)} (${savingsRate.toFixed(2)}% savings rate)

───────────────────────────────────────────────────────────────
                      SPENDING BY CATEGORY
───────────────────────────────────────────────────────────────

${categoryBreakdown || 'No category data available'}

───────────────────────────────────────────────────────────────
                      RECENT TRANSACTIONS
───────────────────────────────────────────────────────────────

${recentTransactions || 'No recent transactions'}

───────────────────────────────────────────────────────────────
                        FINANCIAL ANALYSIS
───────────────────────────────────────────────────────────────

Income Analysis:
• Your income sources appear ${totalIncome > 0 ? 'stable' : 'limited'}
• ${totalIncome > 2000 ? 'Strong income base for savings growth' : 'Consider opportunities to increase income'}

Spending Analysis:
• Daily spending average: ${formatCurrency(analyticsData.avgDailySpending)}
• Spending pattern: ${totalSpending > totalIncome ? 'Exceeds income - requires attention' : 'Within income limits'}

Savings Analysis:
• Current savings rate: ${savingsRate.toFixed(2)}%
• Recommended savings rate: 20%
• ${savingsRate >= 20 ? 'Excellent savings discipline' : 'Room for improvement in savings'}

───────────────────────────────────────────────────────────────
                           ACTION ITEMS
───────────────────────────────────────────────────────────────

${savingsRate < 0 ? 
  `🚨 URGENT ACTIONS REQUIRED:
• Immediately review all expenses
• Cancel non-essential subscriptions
• Create emergency budget plan
• Consider debt consolidation options` :
  savingsRate < 10 ?
  `⚠️  IMPROVEMENT NEEDED:
• Set up automatic savings transfers
• Review and reduce discretionary spending
• Track daily expenses more closely
• Set monthly savings goals` :
  `✅ MAINTAIN CURRENT HABITS:
• Continue current savings discipline
• Consider investment opportunities
• Review insurance coverage
• Plan for long-term financial goals`
}

───────────────────────────────────────────────────────────────

Report generated by Savoon Bank Analytics System
Confidential - For account holder use only

═══════════════════════════════════════════════════════════════
`;
  };

  const generateAccountStatement = (date) => {
    const sortedTransactions = [...transactions]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 20);

    let runningBalance = analyticsData.totalIncome - analyticsData.totalSpending;
    const transactionLines = sortedTransactions.map(t => {
      const transDate = new Date(t.createdAt).toLocaleDateString();
      const amount = t.type === 'credit' ? t.amount : -t.amount;
      runningBalance -= amount;
      return `${transDate.padEnd(12)} | ${t.description.padEnd(25)} | ${(t.type === 'credit' ? '+' : '-') + formatCurrency(Math.abs(t.amount)).padStart(12)} | ${formatCurrency(runningBalance).padStart(12)}`;
    }).join('\n');

    return `
═══════════════════════════════════════════════════════════════
                    SAVOON BANK ACCOUNT STATEMENT
═══════════════════════════════════════════════════════════════

Account Holder: ${user?.name || 'Valued Customer'}
Statement Date: ${date}
Statement Period: Last ${analyticsData.dateRange} days

───────────────────────────────────────────────────────────────
                        ACCOUNT SUMMARY
───────────────────────────────────────────────────────────────

Opening Balance:    ${formatCurrency(runningBalance)}
Total Credits:      ${formatCurrency(analyticsData.totalIncome)}
Total Debits:       ${formatCurrency(analyticsData.totalSpending)}
Closing Balance:    ${formatCurrency(analyticsData.totalIncome - analyticsData.totalSpending)}

───────────────────────────────────────────────────────────────
                      TRANSACTION HISTORY
───────────────────────────────────────────────────────────────

Date         | Description               | Amount       | Balance
─────────────┼───────────────────────────┼──────────────┼─────────────
${transactionLines}

───────────────────────────────────────────────────────────────
                        ACCOUNT ACTIVITY
───────────────────────────────────────────────────────────────

Total Transactions: ${transactions.length}
Credit Transactions: ${transactions.filter(t => t.type === 'credit').length}
Debit Transactions: ${transactions.filter(t => t.type === 'debit').length}

Average Transaction: ${formatCurrency(transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length)}
Largest Credit: ${formatCurrency(Math.max(...transactions.filter(t => t.type === 'credit').map(t => t.amount)))}
Largest Debit: ${formatCurrency(Math.max(...transactions.filter(t => t.type === 'debit').map(t => t.amount)))}

───────────────────────────────────────────────────────────────
                           NOTICES
───────────────────────────────────────────────────────────────

• This statement is generated electronically
• Please review all transactions for accuracy
• Report any discrepancies within 30 days
• Keep this statement for your records

For customer service: support@savoonbank.com
Online banking: www.savoonbank.com

═══════════════════════════════════════════════════════════════
                    END OF STATEMENT
═══════════════════════════════════════════════════════════════
`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReport).then(() => {
      alert('Report copied to clipboard!');
    });
  };

  const downloadReport = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedReport], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `savoon-bank-${reportType}-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="financial-report-generator">
      <div className="report-header">
        <h2>
          <i className="fas fa-file-alt" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }}></i>
          Financial Report Generator
        </h2>
        <p>Generate comprehensive financial reports and statements</p>
      </div>

      <div className="report-controls">
        <div className="report-type-selector">
          <label htmlFor="reportType">Report Type:</label>
          <select
            id="reportType"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="report-select"
          >
            <option value="summary">Financial Summary</option>
            <option value="detailed">Detailed Analysis</option>
            <option value="statement">Account Statement</option>
          </select>
        </div>

        <button
          onClick={generateReport}
          disabled={isGenerating}
          className="btn btn-primary generate-btn"
        >
          {isGenerating ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Generating...
            </>
          ) : (
            <>
              <i className="fas fa-magic"></i>
              Generate Report
            </>
          )}
        </button>
      </div>

      {generatedReport && (
        <div className="report-output">
          <div className="report-actions">
            <button onClick={copyToClipboard} className="btn btn-secondary">
              <i className="fas fa-copy"></i>
              Copy to Clipboard
            </button>
            <button onClick={downloadReport} className="btn btn-success">
              <i className="fas fa-download"></i>
              Download Report
            </button>
            <button onClick={() => window.print()} className="btn btn-info">
              <i className="fas fa-print"></i>
              Print Report
            </button>
          </div>

          <div className="report-content">
            <pre>{generatedReport}</pre>
          </div>
        </div>
      )}

      {!generatedReport && !isGenerating && (
        <div className="report-placeholder">
          <i className="fas fa-file-alt" style={{ fontSize: '3rem', color: '#ccc', marginBottom: '1rem' }}></i>
          <p>Select a report type and click "Generate Report" to create your financial statement</p>
          
          <div className="report-types-info">
            <div className="report-type-info">
              <h4><i className="fas fa-chart-pie"></i> Financial Summary</h4>
              <p>Quick overview of income, spending, and savings with recommendations</p>
            </div>
            <div className="report-type-info">
              <h4><i className="fas fa-chart-line"></i> Detailed Analysis</h4>
              <p>Comprehensive analysis with category breakdown and financial insights</p>
            </div>
            <div className="report-type-info">
              <h4><i className="fas fa-receipt"></i> Account Statement</h4>
              <p>Traditional bank statement format with transaction history and balances</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialReportGenerator;
