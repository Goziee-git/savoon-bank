# Multi-stage build for Savoon Bank Backend
# Stage 1: Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Remove unnecessary files
RUN rm -rf .env.example README.md *.md

# Stage 2: Production stage
FROM node:18-alpine AS production

# Install security updates
RUN apk update && apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/server.js ./
COPY --from=builder --chown=nodejs:nodejs /app/config ./config
COPY --from=builder --chown=nodejs:nodejs /app/controllers ./controllers
COPY --from=builder --chown=nodejs:nodejs /app/middleware ./middleware
COPY --from=builder --chown=nodejs:nodejs /app/models ./models
COPY --from=builder --chown=nodejs:nodejs /app/routes ./routes
COPY --from=builder --chown=nodejs:nodejs /app/database ./database

# Create directory for SQLite database with proper permissions
RUN mkdir -p /app/data && chown -R nodejs:nodejs /app/data

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]
