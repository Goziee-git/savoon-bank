# Ultra-optimized Dockerfile for Savoon Bank Backend
# Avoids heavy build dependencies by using pre-built binaries and virtual packages

# Stage 1: Dependency builder with minimal footprint
FROM node:22-alpine AS deps

WORKDIR /app

# Copy package files for dependency resolution
COPY package*.json ./

# Use virtual package for build deps - can be removed cleanly
# Install only when sqlite3 needs compilation (fallback)
RUN apk add --no-cache --virtual .build-deps \
    python3 make g++ sqlite-dev \
    && npm ci --only=production --no-audit --no-fund --prefer-offline \
    && apk del .build-deps \
    && npm cache clean --force \
    && rm -rf /tmp/* /root/.npm

# Stage 2: Ultra-minimal runtime
FROM node:22-alpine AS runtime

# Install only essential runtime packages
RUN apk update && apk upgrade \
    && apk add --no-cache dumb-init sqlite curl \
    && rm -rf /var/cache/apk/* /tmp/*

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S appuser \
    && adduser -S appuser -u 1001 -G appuser

# Copy only production dependencies and source
COPY --from=deps --chown=appuser:appuser /app/node_modules ./node_modules
COPY --from=deps --chown=appuser:appuser /app/package*.json ./
COPY --chown=appuser:appuser server.js ./
COPY --chown=appuser:appuser config/ ./config/
COPY --chown=appuser:appuser controllers/ ./controllers/
COPY --chown=appuser:appuser middleware/ ./middleware/
COPY --chown=appuser:appuser models/ ./models/
COPY --chown=appuser:appuser routes/ ./routes/

# Create app directories with proper permissions
RUN mkdir -p database logs \
    && chown -R appuser:appuser /app

# Optimized environment variables
ENV NODE_ENV=production \
    PORT=5000 \
    DATABASE_PATH=/app/database/finance.sqlite \
    NODE_OPTIONS="--max-old-space-size=512" \
    NPM_CONFIG_PRODUCTION=true

USER appuser
EXPOSE 5000

# Lightweight health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=2 \
    CMD curl -f http://localhost:5000/api/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
