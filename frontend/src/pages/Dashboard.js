import React, { useContext, useEffect } from 'react';
import AuthContext from '../context/auth/authContext';
import TransactionContext from '../context/transaction/transactionContext';

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const transactionContext = useContext(TransactionContext);

  const { user } = authContext;
  const { transactions, getTransactions } = transactionContext;

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <div className='container'>
      <h1>Welcome {user && user.name}</h1>
      <div className='grid-2'>
        <div>
          <div className='card bg-light'>
            <h3 className='text-primary'>Your Balance</h3>
            <h2>{user && user.creditBalance} Credits</h2>
          </div>
        </div>
        <div>
          <div className='card bg-light'>
            <h3 className='text-primary'>Recent Transactions</h3>
            {transactions.slice(0, 5).map(transaction => (
              <div key={transaction._id} className='transaction-item'>
                <p>
                  {transaction.description}{' '}
                  <span
                    className={
                      transaction.type === 'credit'
                        ? 'text-success'
                        : 'text-danger'
                    }
                  >
                    {transaction.type === 'credit' ? '+' : '-'}
                    {transaction.amount}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
