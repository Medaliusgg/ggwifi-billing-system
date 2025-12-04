#!/bin/bash

# Build and Deploy Backend Script
# This script builds the backend and prepares it for deployment

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║     BACKEND BUILD AND DEPLOYMENT SCRIPT                ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

BACKEND_DIR="$(cd "$(dirname "$0")/../../backend" && pwd)"
BUILD_DIR="$BACKEND_DIR/target"
JAR_FILE="$BUILD_DIR/ggnetworks-backend-1.0.0.jar"

cd "$BACKEND_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Cleaning previous build..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
mvn clean

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Compiling backend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
mvn compile -DskipTests

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Building JAR package..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
mvn package -DskipTests

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Build Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -f "$JAR_FILE" ]; then
    JAR_SIZE=$(du -h "$JAR_FILE" | cut -f1)
    echo "✅ Build successful!"
    echo "📦 JAR file: $JAR_FILE"
    echo "📊 Size: $JAR_SIZE"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Next Steps for VPS Deployment:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. Upload JAR to VPS:"
    echo "   scp $JAR_FILE user@139.84.241.182:/path/to/deployment/"
    echo ""
    echo "2. SSH into VPS:"
    echo "   ssh user@139.84.241.182"
    echo ""
    echo "3. Stop current service:"
    echo "   sudo systemctl stop ggwifi-backend"
    echo ""
    echo "4. Backup current JAR:"
    echo "   cp /path/to/current.jar /path/to/backup/ggwifi-backend-$(date +%Y%m%d-%H%M%S).jar"
    echo ""
    echo "5. Replace JAR:"
    echo "   cp $JAR_FILE /path/to/deployment/ggwifi-backend.jar"
    echo ""
    echo "6. Start service:"
    echo "   sudo systemctl start ggwifi-backend"
    echo ""
    echo "7. Check status:"
    echo "   sudo systemctl status ggwifi-backend"
    echo ""
    echo "8. View logs:"
    echo "   sudo journalctl -u ggwifi-backend -f"
    echo ""
else
    echo "❌ Build failed! JAR file not found."
    exit 1
fi

