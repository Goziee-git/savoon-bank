import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/auth/authContext';
import TransactionContext from '../context/transaction/transactionContext';

const Transactions = () => {
  const authContext = useContext(AuthContext);
  const transactionContext = useContext(TransactionContext);

  const { user } = authContext;
  const { transactions, addTransaction, getTransactions } = transactionContext;

  const [transaction, setTransaction] = useState({
    amount: '',
    description: ''
  });

  useEffect(() => {
    getTransactions();
  }, []);

  const { amount, description } = transaction;

  const onChange = e =>
    setTransaction({ ...transaction, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await addTransaction({
        amount: parseFloat(amount),
        description
      });
      setTransaction({
        amount: '',
        description: ''
      });
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className='container'>
      <div className='grid-2'>
        <div>
          <h2>Make a Transaction</h2>
          <form onSubmit={onSubmit}>
            <div className='form-group'>
              <label htmlFor='amount'>Amount</label>
              <input
                type='number'
                name='amount'
                value={amount}
                onChange={onChange}
                required
                min='0.01'
                step='0.01'
              />
            </div>
            <div className='form-group'>
              <label htmlFor='description'>Description</label>
              <input
                type='text'
                name='description'
                value={description}
                onChange={onChange}
                required
              />
            </div>
            <input
              type='submit'
              value='Spend Credits'
              className='btn btn-primary btn-block'
            />
          </form>
        </div>
        <div>
          <h2>Transaction History</h2>
          <div className='transactions-list'>
            {transactions.map(transaction => (
              <div key={transaction._id} className='card'>
                <h3>{transaction.description}</h3>
                <p>
                  Amount:{' '}
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
                <p>Balance after: {transaction.balance}</p>
                <p className='text-small'>
                  {new Date(transaction.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
