import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock the AuthProvider to avoid context issues in tests
jest.mock('./context/auth/AuthState', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="auth-provider">{children}</div>
}));

// Mock the TransactionProvider
jest.mock('./context/transaction/TransactionState', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="transaction-provider">{children}</div>
}));

// Mock the AnalyticsProvider
jest.mock('./context/analytics/AnalyticsState', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="analytics-provider">{children}</div>
}));

// Mock all the page components to avoid complex rendering
jest.mock('./pages/Home', () => () => <div data-testid="home-page">Home Page</div>);
jest.mock('./pages/Login', () => () => <div data-testid="login-page">Login Page</div>);
jest.mock('./pages/Register', () => () => <div data-testid="register-page">Register Page</div>);
jest.mock('./pages/EmailConfirmation', () => () => <div data-testid="email-confirmation-page">Email Confirmation Page</div>);
jest.mock('./pages/Dashboard', () => () => <div data-testid="dashboard-page">Dashboard Page</div>);
jest.mock('./pages/Transactions', () => () => <div data-testid="transactions-page">Transactions Page</div>);
jest.mock('./pages/BillPayments', () => () => <div data-testid="bill-payments-page">Bill Payments Page</div>);
jest.mock('./pages/Loans', () => () => <div data-testid="loans-page">Loans Page</div>);
jest.mock('./pages/Analytics', () => () => <div data-testid="analytics-page">Analytics Page</div>);
jest.mock('./pages/NotFound', () => () => <div data-testid="not-found-page">Not Found Page</div>);

// Mock components
jest.mock('./components/layout/Navbar', () => () => <nav data-testid="navbar">Navbar</nav>);
jest.mock('./components/layout/Footer', () => () => <footer data-testid="footer">Footer</footer>);
jest.mock('./components/routing/PrivateRoute', () => ({ component: Component }) => <Component />);

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    
    // Check if the app renders without throwing an error
    expect(document.body).toBeInTheDocument();
  });

  test('renders auth provider wrapper', () => {
    render(<App />);
    
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  });

  test('renders transaction provider wrapper', () => {
    render(<App />);
    
    expect(screen.getByTestId('transaction-provider')).toBeInTheDocument();
  });

  test('renders analytics provider wrapper', () => {
    render(<App />);
    
    expect(screen.getByTestId('analytics-provider')).toBeInTheDocument();
  });

  test('renders navbar and footer', () => {
    render(<App />);
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('renders home page by default', () => {
    render(<App />);
    
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });
});
