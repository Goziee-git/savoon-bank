# Snyk Security Scanning Setup Guide

## Overview
This guide explains how to set up Snyk security scanning for the Savoon Bank CI/CD pipeline.

## Prerequisites
1. A Snyk account (free tier available at https://snyk.io)
2. GitHub repository with admin access
3. Node.js projects (frontend and backend)

## Setup Steps

### 1. Get Your Snyk Token
1. Log in to your Snyk account at https://app.snyk.io
2. Go to Account Settings (click on your profile picture)
3. Navigate to "General" → "Auth Token"
4. Copy your API token (keep it secure!)

### 2. Add Snyk Token to GitHub Secrets
1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `SNYK_TOKEN`
5. Value: Paste your Snyk API token
6. Click "Add secret"

### 3. Verify Setup
The CI/CD pipeline now includes:
- **Individual Snyk scans** in both backend-ci and frontend-ci jobs
- **Comprehensive security job** that runs after both CI jobs complete
- **SARIF upload** for GitHub Security tab integration
- **Artifact storage** for security scan results

## What the Pipeline Does

### Backend Security Scanning
- Installs only production dependencies (`npm ci --omit=dev`)
- Runs Snyk test with high severity threshold
- Monitors project in Snyk dashboard
- Uploads results to GitHub Code Scanning

### Frontend Security Scanning  
- Installs only production dependencies (`npm ci --omit=dev`)
- Runs Snyk test with high severity threshold
- Monitors project in Snyk dashboard
- Uploads results to GitHub Code Scanning

### Security Analysis Job
- Runs comprehensive scans for both projects
- Generates security summary in GitHub Actions
- Stores results as artifacts for 30 days
- Continues even if individual scans fail

## Monitoring and Results

### GitHub Security Tab
- View security alerts in your repository's Security tab
- See Snyk findings alongside other security tools
- Track vulnerability trends over time

### Snyk Dashboard
- Monitor projects at https://app.snyk.io
- View detailed vulnerability information
- Set up notifications and integrations
- Track remediation progress

### GitHub Actions Summary
- Each workflow run shows security scan summary
- Artifact downloads available for detailed results
- Failed scans don't block the pipeline (continue-on-error: true)

## Troubleshooting

### Common Issues
1. **"SNYK_TOKEN not found"**
   - Verify the secret is added to GitHub repository
   - Check the secret name is exactly `SNYK_TOKEN`

2. **"Authentication failed"**
   - Regenerate your Snyk API token
   - Update the GitHub secret with the new token

3. **"Timeout errors"**
   - The pipeline uses 300s timeout
   - Large dependency trees may need adjustment

4. **"No vulnerabilities found"**
   - This is good! Your dependencies are secure
   - Snyk will still monitor for future vulnerabilities

### Customization Options
- Adjust severity thresholds in the workflow file
- Modify timeout values if needed
- Add project-specific ignore rules in `.snyk` file
- Configure different scan frequencies

## Security Best Practices
- Keep your Snyk token secure and rotate it regularly
- Review security findings promptly
- Update dependencies when vulnerabilities are found
- Use production-only scans to focus on runtime risks
- Monitor the Snyk dashboard for new vulnerabilities

## Support
- Snyk Documentation: https://docs.snyk.io
- GitHub Actions Documentation: https://docs.github.com/en/actions
- Repository Issues: Create an issue in this repository for pipeline-specific problems
