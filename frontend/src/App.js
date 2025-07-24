import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EmailConfirmation from './pages/EmailConfirmation';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import BillPayments from './pages/BillPayments';
import Loans from './pages/Loans';
import NotFound from './pages/NotFound';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';

// Context
import AuthState from './context/auth/AuthState';
import TransactionState from './context/transaction/TransactionState';

import './App.css';

const App = () => {
  return (
    <AuthState>
      <TransactionState>
        <Router>
          <div className="App">
            <Navbar />
            <div className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/confirm-email" element={<EmailConfirmation />} />
                <Route 
                  path="/dashboard" 
                  element={<PrivateRoute component={Dashboard} />} 
                />
                <Route 
                  path="/transactions" 
                  element={<PrivateRoute component={Transactions} />} 
                />
                <Route 
                  path="/bill-payments" 
                  element={<PrivateRoute component={BillPayments} />} 
                />
                <Route 
                  path="/loans" 
                  element={<PrivateRoute component={Loans} />} 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </TransactionState>
    </AuthState>
  );
};

export default App;
