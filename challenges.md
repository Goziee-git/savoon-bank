# Savoon Bank CI/CD Pipeline Challenges and Solutions

## Challenge 1: npm ci Dependency Synchronization Error

### Problem Description
The CI/CD pipeline is failing during the backend build process with the error:
```
npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync.
```

This error occurs because the `package.json` and `package-lock.json` files are out of sync, with several dependencies missing from the lock file.

### Root Cause Analysis
1. **Missing Dependencies in Lock File**: The package-lock.json is missing critical dependencies that are declared in package.json:
   - `eslint@8.57.1` (declared in package.json devDependencies)
   - `supertest@6.3.4` (declared in package.json devDependencies)
   - Multiple transitive dependencies of the above packages

2. **Package Name Mismatch**: The package-lock.json shows `"name": "finance-app-backend"` while package.json shows `"name": "savoon-bank-backend"`

3. **Incomplete Dependency Tree**: The lock file doesn't contain the complete dependency tree for all declared dependencies

### Impact
- CI/CD pipeline fails at the dependency installation step
- Backend cannot be built or tested
- Development workflow is blocked
- Docker image builds fail

## Solutions

### Solution 1: Regenerate package-lock.json (Recommended)

**Step 1: Clean existing lock file and node_modules**
```bash
cd backend
rm -rf node_modules package-lock.json
```

**Step 2: Install dependencies fresh**
```bash
npm install
```

**Step 3: Verify the installation**
```bash
npm ci  # This should now work without errors
```

**Step 4: Commit the updated package-lock.json**
```bash
git add package-lock.json
git commit -m "fix: regenerate package-lock.json to sync with package.json"
```

### Solution 2: Update CI/CD Pipeline (Temporary Workaround)

If you need an immediate fix while working on Solution 1, modify the CI/CD pipeline:

**Update `.github/workflows/ci-cd.yml`:**
```yaml
    - name: Install backend dependencies
      working-directory: ./backend
      run: |
        # Remove existing lock file if sync issues exist
        if ! npm ci 2>/dev/null; then
          echo "Lock file out of sync, regenerating..."
          rm -f package-lock.json
          npm install --package-lock-only
          npm ci
        fi
```

### Solution 3: Add Dependency Validation Step

Add a pre-build validation step to catch these issues early:

```yaml
    - name: Validate package dependencies
      working-directory: ./backend
      run: |
        echo "Validating package.json and package-lock.json sync..."
        npm ls --depth=0 || echo "Dependencies may be out of sync"
        
    - name: Install backend dependencies
      working-directory: ./backend
      run: npm ci
```

## Prevention Strategies

### 1. Git Hooks
Add a pre-commit hook to validate package-lock.json:

**Create `.git/hooks/pre-commit`:**
```bash
#!/bin/sh
# Check if package-lock.json is in sync with package.json
cd backend
if [ -f package.json ] && [ -f package-lock.json ]; then
    if ! npm ci --dry-run >/dev/null 2>&1; then
        echo "Error: package.json and package-lock.json are out of sync"
        echo "Run 'npm install' to fix this issue"
        exit 1
    fi
fi
```

### 2. Development Guidelines
- Always commit `package-lock.json` along with `package.json` changes
- Use `npm ci` in production/CI environments
- Use `npm install` only for development dependency changes
- Never manually edit `package-lock.json`

### 3. Enhanced CI/CD Pipeline

**Improved backend-ci job:**
```yaml
  backend-ci:
    name: Backend CI/CD
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
        cache-dependency-path: backend/package-lock.json
        
    - name: Validate dependencies
      working-directory: ./backend
      run: |
        echo "Checking package.json and package-lock.json consistency..."
        npm ls --depth=0 || true
        
    - name: Install backend dependencies
      working-directory: ./backend
      run: npm ci
      
    - name: Verify installation
      working-directory: ./backend
      run: |
        echo "Verifying all dependencies are properly installed..."
        npm ls --depth=0
        
    - name: Run backend linting
      working-directory: ./backend
      run: npm run lint
        
    - name: Run backend tests
      working-directory: ./backend
      run: npm test
      env:
        NODE_ENV: test
        
    - name: Run security audit
      working-directory: ./backend
      run: npm audit --audit-level=moderate
      
    - name: Build backend (if applicable)
      working-directory: ./backend
      run: |
        echo "Backend build completed successfully"
```

## Additional Improvements

### 1. Package.json Cleanup
Update the backend package.json to ensure consistency:

```json
{
  "name": "savoon-bank-backend",
  "version": "1.0.0",
  "description": "Savoon Bank backend with SQLite",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint . --ext .js --ignore-pattern node_modules/",
    "lint:fix": "eslint . --ext .js --fix --ignore-pattern node_modules/"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-validator": "^7.0.1",
    "jsonwebtoken": "^9.0.1",
    "morgan": "^1.10.0",
    "sequelize": "^6.32.1",
    "sqlite3": "^5.1.6"
  },
  "devDependencies": {
    "eslint": "^8.57.1",
    "jest": "^29.6.2",
    "nodemon": "^3.0.1",
    "supertest": "^6.3.4"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

### 2. ESLint Configuration
Create `.eslintrc.js` in the backend directory:

```javascript
module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'semi': ['error', 'always'],
    'quotes': ['error', 'single']
  },
  ignorePatterns: [
    'node_modules/',
    'coverage/',
    'dist/'
  ]
};
```

## Testing the Fix

After implementing Solution 1, test the fix:

```bash
# 1. Navigate to backend directory
cd backend

# 2. Clean install
rm -rf node_modules package-lock.json
npm install

# 3. Test CI command
npm ci

# 4. Run all scripts to ensure they work
npm run lint
npm test
npm run start &
sleep 5
pkill -f "node server.js"

# 5. Commit changes
git add package-lock.json
git commit -m "fix: regenerate package-lock.json to resolve dependency sync issues"
git push
```

## Monitoring and Maintenance

1. **Regular Dependency Updates**: Schedule monthly dependency updates
2. **Security Audits**: Run `npm audit` regularly and address vulnerabilities
3. **Lock File Validation**: Include lock file validation in PR checks
4. **Documentation**: Keep this challenges.md updated with new issues and solutions

## Success Criteria

- [ ] `npm ci` runs successfully in CI/CD pipeline
- [ ] All backend tests pass
- [ ] ESLint runs without errors
- [ ] Security audit passes with acceptable risk level
- [ ] Docker build completes successfully
- [ ] No dependency-related pipeline failures

---

**Last Updated**: July 25, 2025
**Status**: Active Issue - Requires immediate attention
**Priority**: High - Blocking CI/CD pipeline
