import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/auth/authContext';

const Loans = () => {
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  
  const [activeTab, setActiveTab] = useState('apply');
  const [loanApplications, setLoanApplications] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  
  // Application form state
  const [application, setApplication] = useState({
    loanType: '',
    amount: '',
    purpose: '',
    income: '',
    employment: '',
    duration: ''
  });

  const loanTypes = [
    { 
      id: 'personal', 
      name: 'Personal Loan', 
      icon: 'fas fa-user',
      rate: '8.5%',
      maxAmount: 50000,
      description: 'For personal expenses, debt consolidation, or emergencies'
    },
    { 
      id: 'home', 
      name: 'Home Loan', 
      icon: 'fas fa-home',
      rate: '6.2%',
      maxAmount: 500000,
      description: 'Purchase your dream home with competitive rates'
    },
    { 
      id: 'auto', 
      name: 'Auto Loan', 
      icon: 'fas fa-car',
      rate: '7.1%',
      maxAmount: 75000,
      description: 'Finance your new or used vehicle'
    },
    { 
      id: 'business', 
      name: 'Business Loan', 
      icon: 'fas fa-briefcase',
      rate: '9.2%',
      maxAmount: 200000,
      description: 'Grow your business with flexible financing'
    },
    { 
      id: 'education', 
      name: 'Education Loan', 
      icon: 'fas fa-graduation-cap',
      rate: '5.8%',
      maxAmount: 100000,
      description: 'Invest in your education and future'
    }
  ];

  useEffect(() => {
    loadLoanData();
  }, []);

  const loadLoanData = () => {
    const applications = JSON.parse(localStorage.getItem('loanApplications') || '[]');
    const loans = JSON.parse(localStorage.getItem('activeLoans') || '[]');
    setLoanApplications(applications);
    setActiveLoans(loans);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    
    if (!application.loanType || !application.amount || !application.purpose || !application.income || !application.employment) {
      alert('Please fill in all required fields');
      return;
    }

    const loanType = loanTypes.find(t => t.id === application.loanType);
    if (parseFloat(application.amount) > loanType.maxAmount) {
      alert(`Maximum amount for ${loanType.name} is $${loanType.maxAmount.toLocaleString()}`);
      return;
    }

    const newApplication = {
      id: Date.now().toString(),
      ...application,
      loanTypeName: loanType.name,
      interestRate: loanType.rate,
      status: 'pending',
      appliedDate: new Date().toISOString(),
      applicantName: user?.name || 'User'
    };

    const applications = JSON.parse(localStorage.getItem('loanApplications') || '[]');
    applications.unshift(newApplication);
    localStorage.setItem('loanApplications', JSON.stringify(applications));

    setLoanApplications(applications);
    setApplication({
      loanType: '',
      amount: '',
      purpose: '',
      income: '',
      employment: '',
      duration: ''
    });

    alert('Loan application submitted successfully! We will review and get back to you within 2-3 business days.');
    setActiveTab('applications');
  };

  const calculateEMI = (principal, rate, tenure) => {
    const monthlyRate = (parseFloat(rate) / 100) / 12;
    const months = parseInt(tenure) * 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return emi;
  };

  const renderLoanApplication = () => (
    <div className="grid-2">
      <div>
        <div className="card">
          <div className="card-header">
            <i className="fas fa-file-alt"></i>
            <h2>Loan Application</h2>
          </div>

          <form onSubmit={handleApplicationSubmit}>
            <div className="form-group">
              <label>
                <i className="fas fa-list"></i>
                Loan Type *
              </label>
              <select
                value={application.loanType}
                onChange={(e) => setApplication({...application, loanType: e.target.value})}
                required
              >
                <option value="">Select loan type...</option>
                {loanTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} - {type.rate} APR
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-dollar-sign"></i>
                Loan Amount *
              </label>
              <input
                type="number"
                value={application.amount}
                onChange={(e) => setApplication({...application, amount: e.target.value})}
                placeholder="Enter loan amount"
                min="1000"
                required
              />
              {application.loanType && (
                <small className="text-small">
                  Max: ${loanTypes.find(t => t.id === application.loanType)?.maxAmount.toLocaleString()}
                </small>
              )}
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-calendar"></i>
                Loan Duration (Years) *
              </label>
              <select
                value={application.duration}
                onChange={(e) => setApplication({...application, duration: e.target.value})}
                required
              >
                <option value="">Select duration...</option>
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years</option>
                <option value="5">5 Years</option>
                <option value="7">7 Years</option>
                <option value="10">10 Years</option>
                <option value="15">15 Years</option>
                <option value="20">20 Years</option>
                <option value="30">30 Years</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-money-bill-wave"></i>
                Monthly Income *
              </label>
              <input
                type="number"
                value={application.income}
                onChange={(e) => setApplication({...application, income: e.target.value})}
                placeholder="Enter your monthly income"
                min="1000"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-briefcase"></i>
                Employment Status *
              </label>
              <select
                value={application.employment}
                onChange={(e) => setApplication({...application, employment: e.target.value})}
                required
              >
                <option value="">Select employment status...</option>
                <option value="employed">Employed</option>
                <option value="self-employed">Self Employed</option>
                <option value="business">Business Owner</option>
                <option value="retired">Retired</option>
                <option value="student">Student</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-comment"></i>
                Purpose of Loan *
              </label>
              <textarea
                value={application.purpose}
                onChange={(e) => setApplication({...application, purpose: e.target.value})}
                placeholder="Describe the purpose of this loan"
                rows="3"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              <i className="fas fa-paper-plane"></i>
              Submit Application
            </button>
          </form>
        </div>
      </div>

      <div>
        {/* Loan Types */}
        <div className="card">
          <div className="card-header">
            <i className="fas fa-info-circle"></i>
            <h3>Available Loan Types</h3>
          </div>
          {loanTypes.map(type => (
            <div key={type.id} className="card" style={{ margin: '0.5rem 0', padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <i className={type.icon} style={{ fontSize: '1.5rem', color: 'var(--primary-color)', marginRight: '1rem' }}></i>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--dark-color)' }}>{type.name}</h4>
                  <p style={{ margin: 0, color: 'var(--success-color)', fontWeight: '600' }}>
                    {type.rate} APR
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#6c757d', margin: '0.5rem 0' }}>
                {type.description}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--info-color)', margin: 0 }}>
                Max Amount: ${type.maxAmount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* EMI Calculator */}
        {application.amount && application.loanType && application.duration && (
          <div className="card">
            <div className="card-header">
              <i className="fas fa-calculator"></i>
              <h3>EMI Calculator</h3>
            </div>
            <div style={{ textAlign: 'center' }}>
              {(() => {
                const loanType = loanTypes.find(t => t.id === application.loanType);
                const emi = calculateEMI(parseFloat(application.amount), parseFloat(loanType.rate), parseInt(application.duration));
                const totalAmount = emi * parseInt(application.duration) * 12;
                const totalInterest = totalAmount - parseFloat(application.amount);
                
                return (
                  <div>
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ color: 'var(--primary-color)' }}>Monthly EMI</h4>
                      <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--dark-color)' }}>
                        ${emi.toFixed(2)}
                      </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                      <div>
                        <strong>Total Interest:</strong><br/>
                        <span className="text-warning">${totalInterest.toFixed(2)}</span>
                      </div>
                      <div>
                        <strong>Total Amount:</strong><br/>
                        <span className="text-info">${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="card">
      <div className="card-header">
        <i className="fas fa-file-alt"></i>
        <h2>My Applications</h2>
      </div>

      {loanApplications.length > 0 ? (
        <div className="transactions-list">
          {loanApplications.map(app => (
            <div key={app.id} className="card" style={{ margin: '0.5rem 0', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--dark-color)' }}>
                    {app.loanTypeName}
                  </h4>
                  <p style={{ margin: '0 0 0.5rem 0' }}>
                    <strong>Amount:</strong> ${parseFloat(app.amount).toLocaleString()}
                  </p>
                  <p style={{ margin: '0 0 0.5rem 0' }}>
                    <strong>Purpose:</strong> {app.purpose}
                  </p>
                  <p className="text-small" style={{ margin: 0 }}>
                    <i className="fas fa-calendar"></i>
                    Applied: {new Date(app.appliedDate).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className={`badge ${
                    app.status === 'approved' ? 'badge-success' : 
                    app.status === 'rejected' ? 'badge-danger' : 
                    'badge-warning'
                  }`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '0.5rem' }}>
                    Rate: {app.interestRate}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center" style={{ padding: '3rem' }}>
          <i className="fas fa-file-alt" style={{ fontSize: '4rem', color: '#ccc', marginBottom: '1rem' }}></i>
          <h3 style={{ color: '#6c757d', marginBottom: '0.5rem' }}>No applications yet</h3>
          <p className="text-small">Your loan applications will appear here</p>
        </div>
      )}
    </div>
  );

  const renderActiveLoans = () => (
    <div className="card">
      <div className="card-header">
        <i className="fas fa-handshake"></i>
        <h2>Active Loans</h2>
      </div>

      {activeLoans.length > 0 ? (
        <div className="transactions-list">
          {activeLoans.map(loan => (
            <div key={loan.id} className="card" style={{ margin: '0.5rem 0', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--dark-color)' }}>
                    {loan.loanType}
                  </h4>
                  <p style={{ margin: '0 0 0.5rem 0' }}>
                    <strong>Principal:</strong> ${loan.principal.toLocaleString()}
                  </p>
                  <p style={{ margin: '0 0 0.5rem 0' }}>
                    <strong>Monthly EMI:</strong> ${loan.emi.toFixed(2)}
                  </p>
                  <p className="text-small" style={{ margin: 0 }}>
                    <i className="fas fa-calendar"></i>
                    Next Payment: {loan.nextPayment}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--danger-color)' }}>
                    ${loan.outstanding.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                    Outstanding
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--success-color)', marginTop: '0.5rem' }}>
                    {loan.paymentsLeft} payments left
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center" style={{ padding: '3rem' }}>
          <i className="fas fa-handshake" style={{ fontSize: '4rem', color: '#ccc', marginBottom: '1rem' }}></i>
          <h3 style={{ color: '#6c757d', marginBottom: '0.5rem' }}>No active loans</h3>
          <p className="text-small">Your approved loans will appear here</p>
        </div>
      )}
    </div>
  );

  return (
    <div className='container'>
      <div className="dashboard-header">
        <h1>
          <i className="fas fa-handshake"></i>
          Savoon Bank Loans
        </h1>
        <p className="lead">Apply for loans with competitive rates and flexible terms</p>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        marginBottom: '2rem', 
        borderBottom: '2px solid #eee',
        gap: '1rem'
      }}>
        <button
          className={`btn ${activeTab === 'apply' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('apply')}
          style={{ borderRadius: '8px 8px 0 0' }}
        >
          <i className="fas fa-plus"></i>
          Apply for Loan
        </button>
        <button
          className={`btn ${activeTab === 'applications' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('applications')}
          style={{ borderRadius: '8px 8px 0 0' }}
        >
          <i className="fas fa-file-alt"></i>
          My Applications ({loanApplications.length})
        </button>
        <button
          className={`btn ${activeTab === 'active' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('active')}
          style={{ borderRadius: '8px 8px 0 0' }}
        >
          <i className="fas fa-handshake"></i>
          Active Loans ({activeLoans.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'apply' && renderLoanApplication()}
      {activeTab === 'applications' && renderApplications()}
      {activeTab === 'active' && renderActiveLoans()}
    </div>
  );
};

export default Loans;
