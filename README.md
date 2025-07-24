# SAVOON BANK Application 💴

A full-stack application built with Node.js, Express, React, and SQLite that allows users to manage credits and transactions. This application uses SQLite for its database, making it lightweight and easy to set up with no additional database server required.

## Features

- User Authentication (Register/Login)
- JWT Token-based Authorization
- Automatic Credit Bonus on Signup
- Credit Balance Management
- Transaction History
- Protected Routes
- Responsive Design
- RESTful API
- Real-time Balance Updates
- SQLite Database with Sequelize ORM

## Tech Stack

### Backend
- Node.js
- Express.js
- SQLite3 (lightweight SQL database)
- Sequelize ORM
- JWT for Authentication
- bcryptjs for Password Hashing
- Express Validator
- Cors
- Dotenv for Environment Variables
- Morgan for Logging

### Frontend
- React (Create React App)
- React Router v6
- Context API for State Management
- Axios for HTTP Requests
- Custom CSS

## Getting Started

### Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14 or higher)
- npm (v6 or higher) or yarn
- Git

### Installation Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd finance-app
```

2. Set up the Backend:
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create database directory
mkdir -p database

# Create .env file
cat > .env << EOL
PORT=5000
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRE=24h
SIGNUP_CREDIT_AMOUNT=1000
EOL
```
### to get a JWT token for backend access

3. Set up the Frontend:
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOL
REACT_APP_API_URL=http://localhost:5000
EOL
```

### Database Setup

The SQLite database will be automatically created when you first start the server. The database file will be located at:
```/backend/database/finance.sqlite```

To manually initialize the database:
```bash
cd backend
node -e "require('./config/database').sync()"
```

### Running the Application

1. Start the Backend Server:
```bash
# From the backend directory
cd backend
npm run dev

# You should see:
# Database synced successfully
# Server running on port 5000
```

2. Start the Frontend Development Server:
```bash
# From the frontend directory
cd frontend
npm start

# The application will open in your browser at http://localhost:3000
```

### Verifying the Setup

1. Check Database Creation:
```bash
# From the backend directory
ls database/finance.sqlite
# Should show the SQLite database file
```

2. Test API Connection:
```bash
# Test the API health endpoint
curl http://localhost:5000/api/health
# Should return: {"status": "ok"}
```

## Database Management

### Viewing Database Content

You can use SQLite command line tool to view the database:
```bash
# Install SQLite command line tool if needed
# Ubuntu/Debian:
sudo apt-get install sqlite3

# Access the database
sqlite3 backend/database/finance.sqlite

# Common SQLite commands:
.tables                    # List all tables
.schema Users             # Show Users table schema
.schema Transactions      # Show Transactions table schema
SELECT * FROM Users;      # View all users
SELECT * FROM Transactions;  # View all transactions
.quit                     # Exit SQLite CLI
```

## API Endpoints

### Authentication Routes
- POST /api/auth/register - Register a new user
  ```bash
  curl -X POST http://localhost:5000/api/auth/register \\
    -H "Content-Type: application/json" \\
    -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
  ```

- POST /api/auth/login - Login user
  ```bash
  curl -X POST http://localhost:5000/api/auth/login \\
    -H "Content-Type: application/json" \\
    -d '{"email":"test@example.com","password":"password123"}'
  ```

- GET /api/auth/me - Get logged in user info
  ```bash
  curl -X GET http://localhost:5000/api/auth/me \\
    -H "Authorization: Bearer YOUR_JWT_TOKEN"
  ```

### Transaction Routes
- GET /api/transactions - Get all transactions
- GET /api/transactions/:id - Get specific transaction
- POST /api/transactions/spend - Create a new spending transaction

## Troubleshooting

### Common Issues and Solutions

1. Database Connection Issues:
```bash
# Check if database file exists
ls backend/database/finance.sqlite

# Check file permissions
ls -l backend/database/finance.sqlite

# Ensure database directory exists
mkdir -p backend/database
```

2. Server Won't Start:
```bash
# Check if port 5000 is already in use
lsof -i :5000
# Kill process if needed
kill -9 <PID>
```

3. Database Reset:
```bash
#Remove and recreate database
rm backend/database/finance.sqlite
node -e "require('./config/database').sync()"
```

## Development

### Backend Development

To add new features to the backend:

1. Create new models in /backend/models using Sequelize syntax
2. Add new controllers in /backend/controllers
3. Create new routes in /backend/routes
4. Update server.js if needed

### Frontend Development

To add new features to the frontend:

1. Add new components in ```/frontend/src/components```
2. Create new pages in ```/frontend/src/pages```
3. Update context if needed in ```/frontend/src/context```
4. Modify App.js to include new routes

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Building for Production

### Backend
```bash
cd backend
npm run build
```

### Frontend
```bash
cd frontend
npm run build
```

## Deployment

1. Deploy Backend:
   - Configure environment variables
   - Ensure SQLite file permissions are correct
   - Deploy to hosting service (e.g., Heroku, AWS, DigitalOcean)

2. Deploy Frontend:
   - Build the React application
   - Deploy static files to hosting service
   - Configure environment variables correctly
   

## Support

For support, please open an issue in the repository or contact the development team.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React Documentation
- Express.js Documentation
- Node.js Documentation
- Sequelize Documentation
- SQLite Documentation
- JWT Documentation
