module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    // Disable some rules that might cause build issues
    'no-unused-vars': 'warn',
    'no-console': 'warn'
  },
  ignorePatterns: [
    'build/',
    'node_modules/',
    'public/'
  ]
};
