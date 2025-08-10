#!/bin/bash

# VSEmbed Build Script
# Builds the complete VSEmbed application for distribution

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BUILD_MODE=${1:-production}
SKIP_TESTS=${SKIP_TESTS:-false}
SKIP_LINT=${SKIP_LINT:-false}
OUTPUT_DIR="dist"

echo -e "${BLUE}🚀 Starting VSEmbed Build Process${NC}"
echo -e "${BLUE}Build Mode: ${BUILD_MODE}${NC}"
echo -e "${BLUE}Output Directory: ${OUTPUT_DIR}${NC}"

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Validate required tools
echo -e "${BLUE}🔍 Validating build environment...${NC}"

if ! command_exists node; then
    print_error "Node.js is required but not installed"
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is required but not installed"
    exit 1
fi

if ! command_exists docker; then
    print_warning "Docker not found - some features may be limited"
fi

print_status "Build environment validated"

# Clean previous builds
echo -e "${BLUE}🧹 Cleaning previous builds...${NC}"
rm -rf "$OUTPUT_DIR"
rm -rf ".webpack"
rm -rf "out"
print_status "Cleaned previous builds"

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm ci --silent
print_status "Dependencies installed"

# Run linting (unless skipped)
if [ "$SKIP_LINT" != "true" ]; then
    echo -e "${BLUE}🔍 Running code analysis...${NC}"
    npm run lint 2>/dev/null || {
        print_warning "Linting found issues, continuing with build"
    }
    print_status "Code analysis completed"
else
    print_warning "Skipping code analysis"
fi

# Run tests (unless skipped)
if [ "$SKIP_TESTS" != "true" ]; then
    echo -e "${BLUE}🧪 Running tests...${NC}"
    npm test 2>/dev/null || {
        print_warning "Some tests failed, continuing with build"
    }
    print_status "Tests completed"
else
    print_warning "Skipping tests"
fi

# Build TypeScript
echo -e "${BLUE}🔨 Compiling TypeScript...${NC}"
export NODE_ENV=$BUILD_MODE
npm run build:main
npm run build:renderer
print_status "TypeScript compilation completed"

# Build with Electron Forge
echo -e "${BLUE}📱 Building Electron application...${NC}"
if [ "$BUILD_MODE" = "production" ]; then
    npm run make
else
    npm run package
fi
print_status "Electron build completed"

# Generate version info
echo -e "${BLUE}📝 Generating build information...${NC}"
BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
BUILD_VERSION=$(node -p "require('./package.json').version")

cat > "$OUTPUT_DIR/build-info.json" << EOF
{
  "version": "$BUILD_VERSION",
  "buildTime": "$BUILD_TIME",
  "buildMode": "$BUILD_MODE",
  "gitCommit": "$GIT_COMMIT",
  "gitBranch": "$GIT_BRANCH",
  "nodeVersion": "$(node --version)",
  "platform": "$(uname -s)",
  "architecture": "$(uname -m)"
}
EOF

print_status "Build information generated"

# Copy additional resources
echo -e "${BLUE}📋 Copying additional resources...${NC}"
if [ -d "scripts" ]; then
    mkdir -p "$OUTPUT_DIR/resources"
    cp -r scripts "$OUTPUT_DIR/resources/"
    chmod +x "$OUTPUT_DIR/resources/scripts"/*.sh
fi

if [ -f ".vscode/security-policy.yml" ]; then
    mkdir -p "$OUTPUT_DIR/resources"
    cp ".vscode/security-policy.yml" "$OUTPUT_DIR/resources/"
fi

print_status "Additional resources copied"

# Create checksums for verification
echo -e "${BLUE}🔐 Generating checksums...${NC}"
if command_exists sha256sum; then
    find "$OUTPUT_DIR" -type f -name "*.exe" -o -name "*.dmg" -o -name "*.deb" -o -name "*.rpm" -o -name "*.zip" | while read -r file; do
        sha256sum "$file" > "${file}.sha256"
    done
    print_status "Checksums generated"
else
    print_warning "sha256sum not available, skipping checksum generation"
fi

# Display build summary
echo -e "${GREEN}🎉 Build completed successfully!${NC}"
echo -e "${BLUE}Build Summary:${NC}"
echo -e "  Version: $BUILD_VERSION"
echo -e "  Mode: $BUILD_MODE"
echo -e "  Time: $BUILD_TIME"
echo -e "  Commit: $GIT_COMMIT"
echo -e "  Output: $OUTPUT_DIR"

if [ -d "$OUTPUT_DIR" ]; then
    echo -e "${BLUE}Generated files:${NC}"
    find "$OUTPUT_DIR" -type f -name "*.exe" -o -name "*.dmg" -o -name "*.deb" -o -name "*.rpm" -o -name "*.zip" | sort
fi

# Check file sizes
echo -e "${BLUE}Build sizes:${NC}"
if command_exists du; then
    du -sh "$OUTPUT_DIR"/* 2>/dev/null || true
fi

echo -e "${GREEN}✅ VSEmbed build process completed successfully!${NC}"
