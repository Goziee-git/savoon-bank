# Savoon Bank - Digital Banking Made Simple

![Savoon Bank Logo](https://img.shields.io/badge/Savoon-Bank-orange?style=for-the-badge&logo=university)

A modern, secure, and user-friendly digital banking application built with React.js. Savoon Bank provides a comprehensive platform for managing your finances with an intuitive interface and robust features.

## 🌟 Features for the app.

### 🔐 Authentication & Security
- **Secure User Registration** - Create your account with email verification
- **Protected Login System** - JWT-based authentication
- **Welcome Email Notifications** - Automated email system for new users
- **Session Management** - Secure token-based sessions

### 💰 Financial Management
- **Real-time Balance Tracking** - Monitor your account balance instantly
- **Transaction History** - Complete record of all your financial activities
- **Spend & Deposit** - Easy money management with intuitive forms
- **Balance Alerts** - Smart notifications for low balance warnings

### 📊 Dashboard & Analytics
- **Personalized Welcome** - Fancy welcome message with user's name
- **Financial Overview** - Quick stats on earnings, spending, and balance
- **Transaction Analytics** - Visual representation of your financial data
- **Account Status Monitoring** - Health indicators for your account

### 🎨 User Experience
- **Modern UI/UX** - Beautiful orange-green gradient design
- **Responsive Design** - Full-screen optimized for all devices
- **Fancy Typography** - Premium fonts (Inter, Poppins, Playfair Display)
- **Smooth Animations** - Engaging transitions and hover effects
- **Glassmorphism Design** - Modern blur effects and transparency

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finance-app/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
savoon-bank-frontend/
├── public/
│   ├── index.html          # Main HTML template
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.js   # Navigation component
│   │   │   └── Footer.js   # Footer component
│   │   └── routing/
│   │       └── PrivateRoute.js # Protected route wrapper
│   ├── context/
│   │   ├── auth/           # Authentication context
│   │   └── transaction/    # Transaction context
│   ├── pages/
│   │   ├── Home.js         # Landing page
│   │   ├── Login.js        # Login page
│   │   ├── Register.js     # Registration page
│   │   ├── Dashboard.js    # Main dashboard
│   │   └── Transactions.js # Transaction management
│   ├── utils/
│   │   ├── mockAuth.js     # Mock authentication system
│   │   ├── mockTransactions.js # Mock transaction system
│   │   └── setAuthToken.js # Token management
│   ├── App.js              # Main application component
│   ├── App.css             # Global styles
│   └── index.js            # Application entry point
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## 🎨 Design System

### Color Palette
- **Primary Orange**: `#ff6b35` - Main brand color
- **Secondary Green**: `#4caf50` - Success and positive actions
- **Dark**: `#2c3e50` - Text and headings
- **Success**: `#27ae60` - Positive feedback
- **Danger**: `#e74c3c` - Errors and warnings

### Typography
- **Headings**: Playfair Display (Serif)
- **Body Text**: Inter (Sans-serif)
- **UI Elements**: Poppins (Sans-serif)

### Key Features
- **Gradient Backgrounds**: Orange to green gradients
- **Glassmorphism**: Blur effects and transparency
- **Responsive Grid**: Auto-fit grid layouts
- **Smooth Animations**: CSS transitions and transforms

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App

## 📱 Features in Detail

### User Registration
- **Full Name Collection**: Personalized experience from day one
- **Email Verification**: Secure account creation process
- **Password Validation**: Strong password requirements
- **Welcome Email**: Automated email notification system
- **Instant Redirect**: Seamless transition to dashboard

### Dashboard Experience
- **Personalized Greeting**: "Welcome, [User Name]!" with fancy styling
- **Real-time Balance**: Live balance updates
- **Quick Stats**: Total earned, spent, and transaction count
- **Recent Transactions**: Last 5 transactions preview
- **Account Health**: Visual indicators for balance status

### Transaction Management
- **Spend Money**: Easy transaction creation with validation
- **Add Funds**: Deposit money to your account
- **Transaction History**: Complete chronological record
- **Balance Tracking**: Real-time balance updates
- **Smart Validation**: Prevents overdrafts and invalid transactions

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Private route protection
- **Input Validation**: Client-side and server-side validation
- **Session Management**: Automatic token refresh and logout
- **Error Handling**: Comprehensive error management

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📧 Email System

The application includes a mock email system that simulates sending welcome emails to new users:

- **Welcome Email**: Sent automatically upon registration
- **Email Logging**: Console logging for development
- **Notification Storage**: LocalStorage for demo purposes

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The build folder can be deployed to any static hosting service like:
- Netlify
- Vercel
- AWS S3
- GitHub Pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Font Awesome** - For the beautiful icons
- **Google Fonts** - For the premium typography
- **Create React App** - For the development setup

## 📞 Support

For support, email support@savoonbank.com or create an issue in the repository.

---

**Savoon Bank** - Your Trusted Digital Banking Partner 🏦✨
