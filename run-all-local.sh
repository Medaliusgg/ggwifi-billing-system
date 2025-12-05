#!/bin/bash

# Run All Services Locally
# This script starts backend, admin portal, and customer portal

set -e

echo "=========================================="
echo "GG-WIFI Local Development Environment"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check Java
if ! command -v java &> /dev/null; then
    echo -e "${RED}Error: Java is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Java found${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found${NC}"

# Check MySQL
if ! command -v mysql &> /dev/null; then
    echo -e "${YELLOW}Warning: MySQL client not found (database might be on remote server)${NC}"
else
    echo -e "${GREEN}✓ MySQL client found${NC}"
fi

echo ""
echo "=========================================="
echo "Starting Services"
echo "=========================================="
echo ""

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        return 0
    else
        return 1
    fi
}

# Check ports
if check_port 8080; then
    echo -e "${YELLOW}Warning: Port 8080 is already in use (backend might already be running)${NC}"
fi

if check_port 5173; then
    echo -e "${YELLOW}Warning: Port 5173 is already in use${NC}"
fi

if check_port 5174; then
    echo -e "${YELLOW}Warning: Port 5174 is already in use${NC}"
fi

echo ""
echo "=========================================="
echo "1. Starting Backend..."
echo "=========================================="

cd "$PROJECT_ROOT/backend"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from template...${NC}"
    cat > .env << EOF
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ggwifi_billing
DB_USER=ggwifi_user
DB_PASSWORD=your_password

# JWT
JWT_SECRET=local-development-secret-key-change-in-production
JWT_EXPIRATION=86400000

# API URLs
API_BASE_URL=http://localhost:8080/api/v1
EOF
    echo -e "${YELLOW}Please update backend/.env with your database credentials${NC}"
fi

# Start backend in background
echo "Starting Spring Boot backend..."
mvn spring-boot:run > ../backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}Backend started (PID: $BACKEND_PID)${NC}"
echo "Logs: tail -f backend.log"

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 10

# Check if backend is running
if curl -s http://localhost:8080/api/v1/admin/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend is running on http://localhost:8080${NC}"
else
    echo -e "${YELLOW}Backend might still be starting...${NC}"
fi

echo ""
echo "=========================================="
echo "2. Starting Admin Portal..."
echo "=========================================="

cd "$PROJECT_ROOT/Frontend/admin_portal"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating .env.local file...${NC}"
    cat > .env.local << EOF
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_API_URL=http://localhost:8080/api/v1
VITE_APP_DOMAIN=localhost:5173
VITE_APP_NAME=GGWIFI Admin Portal
VITE_ENVIRONMENT=development
EOF
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start admin portal
echo "Starting admin portal..."
npm run dev > ../../admin-portal.log 2>&1 &
ADMIN_PID=$!
echo -e "${GREEN}Admin Portal started (PID: $ADMIN_PID)${NC}"
echo "Logs: tail -f admin-portal.log"

sleep 5
echo -e "${GREEN}✓ Admin Portal should be running on http://localhost:5173${NC}"

echo ""
echo "=========================================="
echo "3. Starting Customer Portal..."
echo "=========================================="

cd "$PROJECT_ROOT/Frontend/customer_portal"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating .env.local file...${NC}"
    cat > .env.local << EOF
VITE_API_URL=http://localhost:8080/api/v1
VITE_APP_NAME=GGWIFI Customer Portal
VITE_APP_DOMAIN=localhost:5174
VITE_ENVIRONMENT=development
EOF
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start customer portal
echo "Starting customer portal..."
npm run dev > ../../customer-portal.log 2>&1 &
CUSTOMER_PID=$!
echo -e "${GREEN}Customer Portal started (PID: $CUSTOMER_PID)${NC}"
echo "Logs: tail -f customer-portal.log"

sleep 5
echo -e "${GREEN}✓ Customer Portal should be running on http://localhost:5174${NC}"

echo ""
echo "=========================================="
echo "All Services Started!"
echo "=========================================="
echo ""
echo -e "${GREEN}Backend:${NC}        http://localhost:8080"
echo -e "${GREEN}Admin Portal:${NC}  http://localhost:5173"
echo -e "${GREEN}Customer Portal:${NC} http://localhost:5174"
echo ""
echo "Process IDs:"
echo "  Backend: $BACKEND_PID"
echo "  Admin Portal: $ADMIN_PID"
echo "  Customer Portal: $CUSTOMER_PID"
echo ""
echo "To stop all services, run:"
echo "  kill $BACKEND_PID $ADMIN_PID $CUSTOMER_PID"
echo ""
echo "Or use: pkill -f 'spring-boot:run|vite'"
echo ""
echo "Logs:"
echo "  Backend: tail -f backend.log"
echo "  Admin Portal: tail -f admin-portal.log"
echo "  Customer Portal: tail -f customer-portal.log"
echo ""

# Save PIDs to file
echo "$BACKEND_PID $ADMIN_PID $CUSTOMER_PID" > .local-pids

echo -e "${GREEN}Setup complete! Happy testing! 🚀${NC}"

