#!/bin/bash

# Snyk setup validation script
set -e

echo "🔍 Validating Snyk setup for Savoon Bank CI/CD..."

# Check if Snyk CLI is available
if command -v snyk &> /dev/null; then
    echo "✅ Snyk CLI is installed"
    snyk --version
else
    echo "❌ Snyk CLI not found. Installing..."
    npm install -g snyk
fi

# Check if SNYK_TOKEN is set
if [ -n "$SNYK_TOKEN" ]; then
    echo "✅ SNYK_TOKEN environment variable is set"
else
    echo "⚠️  SNYK_TOKEN not set. This is required for CI/CD."
    echo "   Set it locally with: export SNYK_TOKEN=your_token_here"
    echo "   Or add it to GitHub Secrets for CI/CD"
fi

# Test backend dependencies
echo ""
echo "🔍 Testing backend dependencies..."
cd backend
if [ -f package.json ]; then
    echo "✅ Backend package.json found"
    npm ci --omit=dev --silent
    echo "✅ Backend dependencies installed"
    
    if [ -n "$SNYK_TOKEN" ]; then
        echo "🔍 Running Snyk test on backend..."
        snyk test --prod --severity-threshold=high || echo "⚠️  Vulnerabilities found in backend"
    else
        echo "⚠️  Skipping Snyk test (no token)"
    fi
else
    echo "❌ Backend package.json not found"
fi

# Test frontend dependencies
echo ""
echo "🔍 Testing frontend dependencies..."
cd ../frontend
if [ -f package.json ]; then
    echo "✅ Frontend package.json found"
    npm ci --omit=dev --silent
    echo "✅ Frontend dependencies installed"
    
    if [ -n "$SNYK_TOKEN" ]; then
        echo "🔍 Running Snyk test on frontend..."
        snyk test --prod --severity-threshold=high || echo "⚠️  Vulnerabilities found in frontend"
    else
        echo "⚠️  Skipping Snyk test (no token)"
    fi
else
    echo "❌ Frontend package.json not found"
fi

cd ..

# Check .snyk configuration
echo ""
echo "🔍 Checking Snyk configuration..."
if [ -f .snyk ]; then
    echo "✅ .snyk configuration file found"
else
    echo "❌ .snyk configuration file not found"
fi

# Check GitHub Actions workflow
echo ""
echo "🔍 Checking GitHub Actions workflow..."
if [ -f .github/workflows/ci-cd.yml ]; then
    echo "✅ CI/CD workflow file found"
    
    if grep -q "snyk/actions/node" .github/workflows/ci-cd.yml; then
        echo "✅ Snyk actions configured in workflow"
    else
        echo "❌ Snyk actions not found in workflow"
    fi
    
    if grep -q "SNYK_TOKEN" .github/workflows/ci-cd.yml; then
        echo "✅ SNYK_TOKEN referenced in workflow"
    else
        echo "❌ SNYK_TOKEN not referenced in workflow"
    fi
else
    echo "❌ CI/CD workflow file not found"
fi

echo ""
echo "🎉 Validation complete!"
echo ""
echo "Next steps:"
echo "1. Set SNYK_TOKEN in GitHub repository secrets"
echo "2. Push changes to trigger CI/CD pipeline"
echo "3. Monitor results in GitHub Actions and Snyk dashboard"
echo ""
echo "For detailed setup instructions, see SNYK_SETUP.md"
