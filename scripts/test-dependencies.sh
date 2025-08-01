#!/bin/bash

# Comprehensive dependency testing script
set -e

SERVICE=${1:-"backend"}
echo "🔍 Testing dependencies for $SERVICE..."

cd "$SERVICE"

echo "📋 Analyzing package.json structure..."
echo "Production dependencies:"
if command -v jq &> /dev/null; then
    jq -r '.dependencies | keys[]' package.json | sed 's/^/  - /'
else
    echo "  (install jq for detailed analysis)"
    grep -A 20 '"dependencies"' package.json | grep '"' | sed 's/^/  - /'
fi

echo -e "\nDevelopment dependencies:"
if command -v jq &> /dev/null; then
    jq -r '.devDependencies | keys[]' package.json | sed 's/^/  - /'
else
    grep -A 20 '"devDependencies"' package.json | grep '"' | sed 's/^/  - /'
fi

echo -e "\n📦 Installing ALL dependencies for comparison..."
npm ci

echo -e "\n🛡️ Full audit (all dependencies):"
npm audit --audit-level=moderate || echo "Issues found in full audit"

echo -e "\n📦 Installing PRODUCTION ONLY dependencies..."
rm -rf node_modules
npm ci --omit=dev

echo -e "\n🛡️ Production-only audit:"
npm audit --omit=dev --audit-level=moderate || echo "Issues found in production audit"

if command -v snyk &> /dev/null && [ -n "$SNYK_TOKEN" ]; then
    echo -e "\n🐍 Snyk scan (production only):"
    snyk test --prod --severity-threshold=high || echo "Snyk found issues"
    
    echo -e "\n📊 Snyk dependency tree (production only):"
    snyk test --prod --print-deps
else
    echo -e "\n⚠️ Snyk not available or SNYK_TOKEN not set"
    echo "Install: npm install -g snyk"
    echo "Auth: snyk auth"
fi

echo -e "\n✅ Dependency analysis complete!"
echo "💡 Focus on production dependencies for security scanning"
