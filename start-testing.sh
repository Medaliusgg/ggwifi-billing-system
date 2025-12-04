#!/bin/bash

# GG-WIFI Testing Quick Start Script
# This script helps you start both backend and frontend for testing

echo "🚀 Starting GG-WIFI Testing Environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Backend directory not found!"
    exit 1
fi

# Check if frontend directory exists
if [ ! -d "Frontend/customer_portal" ]; then
    echo "❌ Frontend directory not found!"
    exit 1
fi

echo -e "${BLUE}📋 Test Phone Number: 0742844024 (+255742844024)${NC}"
echo ""

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Check if backend is already running
if check_port 8080; then
    echo -e "${GREEN}✅ Backend already running on port 8080${NC}"
else
    echo -e "${YELLOW}⚠️  Backend not running. Starting backend...${NC}"
    echo "   Run in a separate terminal:"
    echo "   cd backend && ./mvnw spring-boot:run"
    echo ""
fi

# Check if frontend is already running
if check_port 5173; then
    echo -e "${GREEN}✅ Frontend already running on port 5173${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend not running. Starting frontend...${NC}"
    cd Frontend/customer_portal
    npm run dev &
    FRONTEND_PID=$!
    echo -e "${GREEN}✅ Frontend starting (PID: $FRONTEND_PID)${NC}"
    cd ../..
fi

echo ""
echo -e "${GREEN}✅ Testing Environment Ready!${NC}"
echo ""
echo "📱 Test Phone: 0742844024"
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:8080/api/v1"
echo ""
echo "📖 See MANUAL_TESTING_GUIDE.md for detailed testing instructions"
echo ""
echo "Press Ctrl+C to stop frontend (if started by this script)"

# Wait for user interrupt
wait $FRONTEND_PID 2>/dev/null






