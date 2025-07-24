# Savoon Bank Deployment Guide

## Overview

This document provides comprehensive deployment instructions for the Savoon Bank application, including CI/CD pipeline setup, Docker containerization, and Kubernetes deployment.

## Architecture

The application consists of two main microservices:
- **Backend**: Node.js/Express API server with SQLite database
- **Frontend**: React.js application served by Nginx

## CI/CD Pipeline

### GitHub Actions Workflows

1. **Main CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)
   - Runs on push to `main` and `develop` branches
   - Tests both backend and frontend
   - Builds and pushes Docker images
   - Performs security scanning
   - Deploys to production environment

2. **Security Scanning** (`.github/workflows/security-scan.yml`)
   - Runs weekly security scans
   - Dependency vulnerability scanning
   - Code security analysis with CodeQL

### Pipeline Stages

1. **Backend CI**
   - Node.js matrix testing (18.x, 20.x)
   - Dependency installation
   - Linting and testing
   - Security audit

2. **Frontend CI**
   - Node.js matrix testing (18.x, 20.x)
   - Dependency installation
   - Build and test
   - Security audit

3. **Docker Build**
   - Multi-stage Docker builds
   - Security hardening
   - Multi-platform builds (amd64, arm64)
   - Image pushing to GitHub Container Registry

4. **Security Scanning**
   - Trivy vulnerability scanning
   - SARIF report generation

5. **Deployment**
   - Environment-specific deployment
   - Health checks

## Docker Configuration

### Backend Dockerfile

- **Multi-stage build** for optimized image size
- **Non-root user** for security
- **Alpine Linux** base image for minimal attack surface
- **Health checks** for container monitoring
- **dumb-init** for proper signal handling

### Frontend Dockerfile

- **Multi-stage build** with Node.js builder and Nginx runtime
- **Custom Nginx configuration** with security headers
- **Non-root user** execution
- **Gzip compression** enabled
- **Health checks** implemented

### Security Features

- Non-root user execution
- Read-only root filesystem
- Dropped capabilities
- Security headers
- Minimal base images
- Comprehensive .dockerignore files

## Local Development

### Using Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Services

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:8080
- **Database**: SQLite file in Docker volume

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (1.20+)
- kubectl configured
- Container images pushed to registry

### Deployment Steps

1. **Create namespace**
   ```bash
   kubectl create namespace savoon-bank
   ```

2. **Create secrets**
   ```bash
   kubectl create secret generic savoon-bank-secrets \
     --from-literal=jwt-secret=your-jwt-secret \
     -n savoon-bank
   ```

3. **Deploy backend**
   ```bash
   kubectl apply -f k8s/backend-deployment.yml -n savoon-bank
   ```

4. **Deploy frontend**
   ```bash
   kubectl apply -f k8s/frontend-deployment.yml -n savoon-bank
   ```

### Monitoring

- Health checks configured for both services
- Resource limits and requests defined
- Liveness and readiness probes implemented

## Environment Variables

### Backend

- `NODE_ENV`: Environment (production/development)
- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: JWT signing secret
- `DB_PATH`: SQLite database path

### Frontend

- Built-time environment variables embedded in build
- Runtime configuration via Nginx

## Security Considerations

### Container Security

- Non-root user execution
- Read-only root filesystem
- Minimal base images
- Regular security scanning
- Dependency vulnerability monitoring

### Network Security

- Service-to-service communication within cluster
- Ingress controller for external access
- Security headers in Nginx configuration

### Data Security

- JWT token authentication
- Database encryption at rest
- Secrets management via Kubernetes secrets

## Monitoring and Logging

### Health Checks

- **Backend**: `/api/health`, `/api/health/ready`, `/api/health/live`
- **Frontend**: `/health`

### Logging

- Structured logging in JSON format
- Container logs accessible via `kubectl logs`
- Centralized logging recommended for production

## Backup and Recovery

### Database Backup

- Automated daily backups via Docker Compose
- Backup retention policy (7 days)
- Manual backup procedures documented

### Disaster Recovery

- Container images stored in registry
- Infrastructure as Code (IaC) for quick recovery
- Database backup restoration procedures

## Scaling

### Horizontal Scaling

- Backend: Multiple replicas supported
- Frontend: Stateless, easily scalable
- Load balancing via Kubernetes services

### Vertical Scaling

- Resource limits configurable
- CPU and memory requests defined
- Auto-scaling policies can be implemented

## Troubleshooting

### Common Issues

1. **Container startup failures**
   - Check resource limits
   - Verify environment variables
   - Review container logs

2. **Database connection issues**
   - Verify volume mounts
   - Check file permissions
   - Review SQLite configuration

3. **Network connectivity**
   - Verify service configurations
   - Check ingress rules
   - Review DNS resolution

### Debugging Commands

```bash
# Check pod status
kubectl get pods -n savoon-bank

# View pod logs
kubectl logs -f deployment/savoon-bank-backend -n savoon-bank

# Execute into container
kubectl exec -it deployment/savoon-bank-backend -n savoon-bank -- /bin/sh

# Check service endpoints
kubectl get endpoints -n savoon-bank
```

## Performance Optimization

### Backend

- Connection pooling for database
- Caching strategies
- Request rate limiting
- Compression middleware

### Frontend

- Static asset caching
- Gzip compression
- CDN integration
- Bundle optimization

## Security Compliance

### Regular Tasks

- Weekly dependency scans
- Monthly security reviews
- Quarterly penetration testing
- Annual security audits

### Compliance Standards

- OWASP Top 10 compliance
- Container security best practices
- Data protection regulations
- Industry-specific requirements
