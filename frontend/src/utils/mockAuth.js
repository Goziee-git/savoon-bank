import { mockGetUserBalance } from './mockTransactions';

// Mock authentication for testing when backend is not available
export const mockLogin = async (email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if email is confirmed
  const emailConfirmed = localStorage.getItem('emailConfirmed');
  if (!emailConfirmed) {
    throw new Error('Please confirm your email before logging in');
  }
  
  // Mock successful login for any email/password combination
  if (email && password) {
    const userData = {
      id: 1,
      name: extractNameFromEmail(email),
      email: email,
      creditBalance: mockGetUserBalance(),
      emailConfirmed: true
    };
    
    return {
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        user: userData
      }
    };
  } else {
    throw new Error('Invalid credentials');
  }
};

export const mockRegister = async (name, email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (name && email && password) {
    // Store user data temporarily (pending email confirmation)
    const userData = {
      id: 1,
      name: name,
      email: email,
      creditBalance: mockGetUserBalance(),
      emailConfirmed: false
    };

    // Send welcome email (mock)
    await sendWelcomeEmail(name, email);
    
    // Store pending registration
    localStorage.setItem('pendingRegistration', JSON.stringify(userData));
    localStorage.setItem('pendingEmail', email);
    localStorage.removeItem('emailConfirmed'); // Reset confirmation status
    
    return {
      data: {
        message: 'Registration successful! Please check your email to confirm your account.',
        user: userData,
        requiresEmailConfirmation: true
      }
    };
  } else {
    throw new Error('All fields are required');
  }
};

export const mockLoadUser = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get user data from localStorage if available
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    const userData = JSON.parse(storedUser);
    return {
      data: {
        user: {
          ...userData,
          creditBalance: mockGetUserBalance()
        }
      }
    };
  }
  
  return {
    data: {
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        creditBalance: mockGetUserBalance(),
        emailConfirmed: true
      }
    }
  };
};

// Helper function to extract name from email
const extractNameFromEmail = (email) => {
  const username = email.split('@')[0];
  return username.charAt(0).toUpperCase() + username.slice(1);
};

// Mock email sending function
const sendWelcomeEmail = async (name, email) => {
  console.log(`📧 Welcome Email Sent to ${name} (${email})`);
  console.log(`
    ═══════════════════════════════════════════════════════════════
    📧 WELCOME TO SAVOON BANK - EMAIL CONFIRMATION REQUIRED
    ═══════════════════════════════════════════════════════════════
    
    Dear ${name},
    
    Welcome to Savoon Bank! 🎉
    
    To complete your registration, please confirm your email address
    by entering the confirmation code below:
    
    🔐 CONFIRMATION CODE: 123456
    
    Once confirmed, you'll be able to:
    ✅ Access your secure dashboard
    ✅ Track your spending and transactions
    ✅ Manage your credits securely
    ✅ Monitor your financial health
    ✅ Make bill payments and apply for loans
    
    If you didn't create this account, please ignore this email.
    
    Thank you for choosing Savoon Bank!
    
    Best regards,
    The Savoon Bank Team
    
    ═══════════════════════════════════════════════════════════════
  `);
  
  // Store email notification in localStorage for demo purposes
  const notifications = JSON.parse(localStorage.getItem('emailNotifications') || '[]');
  notifications.push({
    to: email,
    subject: 'Confirm Your Savoon Bank Account',
    confirmationCode: '123456',
    timestamp: new Date().toISOString(),
    type: 'confirmation'
  });
  localStorage.setItem('emailNotifications', JSON.stringify(notifications));
};
