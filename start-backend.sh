#!/bin/bash

# GG WiFi Backend Startup Script
# This script starts the Spring Boot backend server

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_DIR="backend"
JAR_FILE="target/ggnetworks-backend-1.0.0.jar"
LOG_FILE="backend.log"
PID_FILE="backend.pid"

echo -e "${BLUE}🚀 Starting GG WiFi Backend Server...${NC}"

# Navigate to backend directory
cd "$(dirname "$0")/$BACKEND_DIR" || exit 1

# Check if JAR file exists
if [ ! -f "$JAR_FILE" ]; then
    echo -e "${RED}❌ Error: JAR file not found at $JAR_FILE${NC}"
    echo -e "${YELLOW}💡 Building the project first...${NC}"
    
    # Build the project
    if ! mvn clean package -DskipTests; then
        echo -e "${RED}❌ Build failed!${NC}"
        exit 1
    fi
fi

# Check if backend is already running
if [ -f "$PID_FILE" ]; then
    OLD_PID=$(cat "$PID_FILE")
    if ps -p "$OLD_PID" > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Backend is already running (PID: $OLD_PID)${NC}"
        echo -e "${YELLOW}💡 To restart, run: pkill -f ggnetworks-backend${NC}"
        exit 0
    else
        rm -f "$PID_FILE"
    fi
fi

# Start the backend
echo -e "${BLUE}📦 Starting backend from: $JAR_FILE${NC}"

# Run in background
nohup java -jar "$JAR_FILE" > "$LOG_FILE" 2>&1 &
BACKEND_PID=$!

# Save PID
echo $BACKEND_PID > "$PID_FILE"

echo -e "${GREEN}✅ Backend started successfully!${NC}"
echo -e "${BLUE}📊 PID: $BACKEND_PID${NC}"
echo -e "${BLUE}📝 Logs: backend/$LOG_FILE${NC}"

# Wait a moment for startup
sleep 3

# Check if it's still running
if ps -p "$BACKEND_PID" > /dev/null 2>&1; then
    """
    echo -e "${GREEN}✅ Backend is running!${NC}"
    echo -e "${BLUE}🔗 Testing endpoint...${NC}"
    
    # Test the endpoint
    if curl -s http://localhost:8080/api/v1/customer-portal/test > /dev/null; then
        echo -e "${GREEN}✅ Backend is responding!${NC}"
        echo -e ""
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}   UdderSystems Started Successfully!${NC}"
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}🔗 Backend URL: http://localhost:8080${NC}"
        echo -e "${BLUE}📊 API Endpoint: http://localhost:8080/api/v1${NC}"
        echo -e "${BLUE}📝 Logs: tail -f backend/$LOG_FILE${NC}"
        echo -e "${BLUE}🛑 Stop: pkill -f ggnetworks-backend${NC}"
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend started but not responding yet...${NC}"
        echo -e "${BLUE}💡 Check logs: tail -f backend/$LOG_FILE${NC}"
    fi
else
    echo -e "${RED}❌ Backend crashed on startup!${NC}"
    echo -e "${BLUE}💡 Check logs: tail -f backend/$LOG_FILE${NC}"
    rm -f "$PID_FILE"
    exit 1
fi


