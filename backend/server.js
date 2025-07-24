const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const sequelize = require('./config/database');
// Import models with associations
require('./models/index');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));

// Database sync and server start
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.sync();
    console.log('Database synced successfully');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to sync database:', error);
    process.exit(1);
  }
}

startServer();
