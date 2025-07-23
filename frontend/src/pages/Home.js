import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='container'>
      <div className='text-center'>
        <h1 className='x-large'>Welcome to Finance App</h1>
        <p className='lead'>
          Manage your credits and transactions with our simple and secure platform
        </p>
        <div className='buttons'>
          <Link to='/register' className='btn btn-primary'>
            Sign Up
          </Link>
          <Link to='/login' className='btn btn-light'>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
