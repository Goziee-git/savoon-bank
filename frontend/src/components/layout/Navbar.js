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
      <li>Hello {user && user.name}</li>
      <li>
        <Link to='/dashboard'>Dashboard</Link>
      </li>
      <li>
        <Link to='/transactions'>Transactions</Link>
      </li>
      <li>
        <a onClick={onLogout} href='#!'>
          Logout
        </a>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </>
  );

  return (
    <div className='navbar bg-primary'>
      <h1>
        <Link to='/'>
          <i className='fas fa-wallet'></i> Finance App
        </Link>
      </h1>
      <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
    </div>
  );
};

export default Navbar;
