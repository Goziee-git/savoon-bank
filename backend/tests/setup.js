// Test setup file
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.DB_PATH = ':memory:'; // Use in-memory database for tests

// Global test timeout
jest.setTimeout(10000);
