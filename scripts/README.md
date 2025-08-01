# Security Scanning Scripts

This directory contains scripts for dependency security scanning focused on production dependencies.

## Scripts Overview

### 🛡️ `security-scan.sh`
Quick security scan focusing on production dependencies only.

**Usage:**
```bash
./scripts/security-scan.sh [service] [severity]
```

**Examples:**
```bash
./scripts/security-scan.sh backend high
./scripts/security-scan.sh frontend medium
```

### 📊 `test-dependencies.sh`
Comprehensive dependency analysis comparing all vs production-only dependencies.

**Usage:**
```bash
./scripts/test-dependencies.sh [service]
```

**Examples:**
```bash
./scripts/test-dependencies.sh backend
./scripts/test-dependencies.sh frontend
```

### 📋 `security-help.sh`
Display help and usage information for all security scripts.

**Usage:**
```bash
./scripts/security-help.sh
```

## NPM Scripts Integration

Both backend and frontend now include security scripts in their package.json:

**Backend:**
```bash
cd backend
npm run audit:prod        # Quick production audit
npm run security:scan     # Full security scan
npm run security:test     # Comprehensive analysis
```

**Frontend:**
```bash
cd frontend
npm run audit:prod        # Quick production audit
npm run security:scan     # Full security scan
npm run security:test     # Comprehensive analysis
```

## Why Production Dependencies Only?

- **Security Priority**: Production code is what gets deployed
- **Performance**: Faster scans, fewer false positives
- **Focus**: Better prioritization of security issues
- **Compliance**: Aligns with security standards

## Setup Requirements

1. **Snyk CLI** (optional but recommended):
   ```bash
   npm install -g snyk
   snyk auth
   ```

2. **Environment Variables**:
   - `SNYK_TOKEN`: Required for CI/CD and Docker usage

3. **Dependencies**:
   - `jq`: For JSON parsing (optional, fallback available)
   - Docker: For Snyk scanning when CLI not available

## GitHub Actions Integration

The security scan workflow (`.github/workflows/security-scan.yml`) has been updated to:
- Use production dependencies only (`--omit=dev`)
- Include proper timeouts and error handling
- Pin action versions for stability
- Upload results to GitHub Security tab
