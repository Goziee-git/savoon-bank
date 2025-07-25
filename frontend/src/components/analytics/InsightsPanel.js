import React from 'react';

const InsightsPanel = ({ insights, title = "Financial Insights" }) => {
  const getInsightClass = (type) => {
    switch (type) {
      case 'positive':
        return 'insight-positive';
      case 'warning':
        return 'insight-warning';
      case 'neutral':
        return 'insight-neutral';
      default:
        return 'insight-info';
    }
  };

  if (!insights || insights.length === 0) {
    return (
      <div className="insights-panel">
        <h3 className="insights-title">{title}</h3>
        <div className="no-insights">
          <p>No insights available at the moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="insights-panel">
      <h3 className="insights-title">{title}</h3>
      <div className="insights-grid">
        {insights.map((insight, index) => (
          <div key={index} className={`insight-card ${getInsightClass(insight.type)}`}>
            <div className="insight-header">
              <span className="insight-icon">{insight.icon}</span>
              <h4 className="insight-title-text">{insight.title}</h4>
            </div>
            <p className="insight-message">{insight.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightsPanel;
