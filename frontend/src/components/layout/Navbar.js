import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import TransactionContext from '../../context/transaction/transactionContext';

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const transactionContext = useContext(TransactionContext);

  const { isAuthenticated, logout, user } = authContext;
  const { clearTransactions } = transactionContext;

  const onLogout = () => {
    logout();
    clearTransactions();
  };

  const authLinks = (
    <>
      <li>
        <Link to='/dashboard'>
          <i className="fas fa-chart-line"></i>
          Dashboard
        </Link>
      </li>
      <li>
        <Link to='/transactions'>
          <i className="fas fa-exchange-alt"></i>
          Transactions
        </Link>
      </li>
      <li>
        <Link to='/analytics'>
          <i className="fas fa-chart-bar"></i>
          Analytics
        </Link>
      </li>
      <li>
        <Link to='/bill-payments'>
          <i className="fas fa-file-invoice-dollar"></i>
          Bill Payments
        </Link>
      </li>
      <li>
        <Link to='/loans'>
          <i className="fas fa-handshake"></i>
          Loans
        </Link>
      </li>
      <li className="welcome">
        <span>
          <i className="fas fa-user"></i>
          Hello, {user?.name || 'User'}
        </span>
        <a onClick={onLogout} href='#!' style={{ color: 'rgba(255,255,255,0.8)' }}>
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </a>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li>
        <Link to='/'>
          <i className="fas fa-home"></i>
          Home
        </Link>
      </li>
      <li>
        <Link to='/register'>
          <i className="fas fa-user-plus"></i>
          Register
        </Link>
      </li>
      <li>
        <Link to='/login'>
          <i className="fas fa-sign-in-alt"></i>
          Login
        </Link>
      </li>
    </>
  );

  return (
    <div className='navbar'>
      <div className="logo">
        <Link to={isAuthenticated ? '/dashboard' : '/'}>
          <i className='fas fa-university'></i>
          Savoon Bank
        </Link>
      </div>
      <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
    </div>
  );
};

export default Navbar;
