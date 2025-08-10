#!/bin/bash

# Security scanning script with production dependency focus
set -e

SERVICE=${1:-"backend"}
SEVERITY=${2:-"high"}

echo "Running security scan for $SERVICE with $SEVERITY severity threshold..."
echo "Focusing on PRODUCTION dependencies only"

# Change to service directory
cd "$SERVICE"

echo "Installing production dependencies only..."
npm ci --omit=dev --silent

echo "Running npm audit (production only)..."
if npm audit --omit=dev --audit-level=moderate; then
    echo "npm audit passed"
else
    echo "npm audit found issues, continuing with Snyk scan..."
fi

echo "Running Snyk scan (production dependencies only)..."
if command -v snyk &> /dev/null; then
    # Use local Snyk CLI if available
    snyk test --prod --severity-threshold="$SEVERITY" --timeout=300s
elif [ -n "$SNYK_TOKEN" ]; then
    # Use Docker if Snyk CLI not available but token is set
    docker run --rm \
        -e SNYK_TOKEN="$SNYK_TOKEN" \
        -v "$(pwd)":/project \
        -w /project \
        snyk/snyk:node \
        test --prod --severity-threshold="$SEVERITY" --timeout=300s
else
    echo "Snyk not available and no SNYK_TOKEN set"
    echo "Install Snyk CLI: npm install -g snyk"
    echo "Or set SNYK_TOKEN environment variable"
    exit 1
fi

echo "Security scan completed successfully!"
echo "Scanned production dependencies only for better security focus"
