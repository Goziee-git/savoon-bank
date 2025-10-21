# Ultra-optimized Dockerfile for Savoon Bank Frontend
# Eliminates heavy build dependencies and creates minimal production image

# Stage 1: Build stage with minimal dependencies
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files for better Docker layer caching
COPY package*.json ./

# Install dependencies without heavy build tools
# React apps typically don't need python3/make/g++ for building
RUN npm install --no-audit --no-fund \
    && npm cache clean --force

# Copy source code
COPY . .

# Build the application with optimizations
ENV NODE_ENV=production \
    GENERATE_SOURCEMAP=false \
    INLINE_RUNTIME_CHUNK=false

RUN npm run build \
    && rm -rf node_modules src public package*.json

# Stage 2: Ultra-minimal production with nginx
FROM nginx:1.25-alpine AS production

# Install only essential packages and remove package cache
RUN apk update && apk upgrade \
    && apk add --no-cache dumb-init curl \
    && rm -rf /var/cache/apk/* /tmp/* \
    && rm -rf /usr/share/nginx/html/*

# Create non-root user
RUN addgroup -g 1001 -S appuser \
    && adduser -S appuser -u 1001 -G appuser

# Copy built application (only the build output)
COPY --from=builder --chown=appuser:appuser /app/build /usr/share/nginx/html

# Copy optimized nginx configuration
COPY --chown=appuser:appuser nginx.conf /etc/nginx/nginx.conf

# Set up nginx directories with minimal permissions
RUN mkdir -p /var/cache/nginx/{client_temp,proxy_temp,fastcgi_temp,uwsgi_temp,scgi_temp} \
    && mkdir -p /var/log/nginx \
    && chown -R appuser:appuser /var/cache/nginx /usr/share/nginx/html /etc/nginx /var/log/nginx \
    && touch /var/run/nginx.pid \
    && chown appuser:appuser /var/run/nginx.pid

USER appuser
EXPOSE 8080

# Minimal health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=2 \
    CMD curl -f http://localhost:8080/ || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["nginx", "-g", "daemon off;"]
