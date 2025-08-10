#!/bin/bash

# Optimized Build Script for Savoon Bank
# Demonstrates the improvements in build time and image size

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
BACKEND_IMAGE="savoon-bank-backend"
FRONTEND_IMAGE="savoon-bank-frontend"
TAG="optimized"
PLATFORM="linux/amd64"

echo -e "${BLUE}🚀 Savoon Bank Optimized Build Script${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# Function to build and measure
build_and_measure() {
    local service=$1
    local image_name=$2
    local dockerfile_path=$3
    
    echo -e "${YELLOW}Building $service...${NC}"
    
    # Start timing
    start_time=$(date +%s)
    
    # Build the image
    docker build \
        --platform $PLATFORM \
        -f $dockerfile_path/Dockerfile \
        -t $image_name:$TAG \
        --progress=plain \
        $dockerfile_path
    
    # End timing
    end_time=$(date +%s)
    duration=$((end_time - start_time))
    
    # Get image size
    image_size=$(docker images --format "{{.Size}}" $image_name:$TAG | head -1)
    
    echo -e "${GREEN}✅ $service build completed!${NC}"
    echo -e "   Build time: ${CYAN}${duration}s${NC}"
    echo -e "   Image size: ${CYAN}$image_size${NC}"
    echo ""
    
    return 0
}

# Build backend
echo -e "${BLUE}📦 Building Backend Service${NC}"
echo -e "${BLUE}===========================${NC}"
build_and_measure "Backend" $BACKEND_IMAGE "./backend"

# Build frontend
echo -e "${BLUE}🎨 Building Frontend Service${NC}"
echo -e "${BLUE}============================${NC}"
build_and_measure "Frontend" $FRONTEND_IMAGE "./frontend"

# Show final summary
echo -e "${BLUE}📊 Build Summary${NC}"
echo -e "${BLUE}================${NC}"
echo ""
echo -e "${CYAN}Backend Image:${NC}"
docker images $BACKEND_IMAGE:$TAG --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
echo ""
echo -e "${CYAN}Frontend Image:${NC}"
docker images $FRONTEND_IMAGE:$TAG --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
echo ""

# Show optimization benefits
echo -e "${GREEN}🎯 Optimization Benefits:${NC}"
echo -e "${GREEN}=========================${NC}"
echo -e "✅ ${YELLOW}Backend optimizations:${NC}"
echo -e "   • Virtual packages eliminate build deps after sqlite3 compilation"
echo -e "   • Single-stage approach reduces layer complexity"
echo -e "   • Minimal runtime dependencies (only sqlite, curl, dumb-init)"
echo -e "   • Optimized npm install with --prefer-offline and --no-audit"
echo ""
echo -e "✅ ${YELLOW}Frontend optimizations:${NC}"
echo -e "   • Eliminated unnecessary build dependencies (python3, make, g++)"
echo -e "   • React builds don't need native compilation tools"
echo -e "   • Optimized build settings (no sourcemaps, no inline runtime)"
echo -e "   • Minimal nginx base with only essential packages"
echo ""
echo -e "✅ ${YELLOW}General optimizations:${NC}"
echo -e "   • Streamlined .dockerignore reduces build context"
echo -e "   • Better layer caching with package.json copying first"
echo -e "   • Reduced health check intervals for faster startup"
echo -e "   • Non-root user security with minimal permissions"
echo ""

# Show how to run the containers
echo -e "${BLUE}🏃 Running the Containers${NC}"
echo -e "${BLUE}=========================${NC}"
echo -e "Backend:"
echo -e "${CYAN}docker run -d -p 5000:5000 --name savoon-backend $BACKEND_IMAGE:$TAG${NC}"
echo ""
echo -e "Frontend:"
echo -e "${CYAN}docker run -d -p 8080:8080 --name savoon-frontend $FRONTEND_IMAGE:$TAG${NC}"
echo ""

# Show docker-compose option
echo -e "${BLUE}🐳 Docker Compose (Recommended)${NC}"
echo -e "${BLUE}===============================${NC}"
echo -e "For full application stack:"
echo -e "${CYAN}docker-compose up -d${NC}"
echo ""

echo -e "${GREEN}🎉 Build completed successfully!${NC}"
echo -e "Your optimized Savoon Bank application is ready to deploy."
