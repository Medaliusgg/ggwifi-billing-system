#!/bin/bash

# Script to start GGNetworks Backend Server
# Usage: ./START_BACKEND.sh

cd "$(dirname "$0")/backend" || exit 1

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 STARTING GGNETWORKS BACKEND SERVER"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if JAR exists
if [ ! -f "target/ggnetworks-backend-1.0.0.jar" ]; then
    echo "❌ JAR file not found. Building..."
    mvn clean package -DskipTests
    if [ $? -ne 0 ]; then
        echo "❌ Build failed!"
        exit 1
    fi
fi

# Check if backend is already running
EXISTING_PID=$(ps aux | grep "[j]ava.*ggnetworks" | awk '{print $2}' | head -1)
if [ -n "$EXISTING_PID" ]; then
    echo "⚠️  Backend already running (PID: $EXISTING_PID)"
    read -p "   Kill existing process and restart? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🛑 Stopping existing backend..."
        kill $EXISTING_PID
        sleep 2
    else
        echo "✅ Keeping existing backend running"
        exit 0
    fi
fi

# Create logs directory
mkdir -p logs

# Start backend
echo "🚀 Starting backend server..."
nohup java -jar target/ggnetworks-backend-1.0.0.jar > logs/backend.log 2>&1 &
BACKEND_PID=$!

echo "✅ Backend started with PID: $BACKEND_PID"
echo ""
echo "⏳ Waiting for backend to start (this may take 30-60 seconds)..."
echo ""

# Wait for backend to start
MAX_WAIT=60
WAITED=0
while [ $WAITED -lt $MAX_WAIT ]; do
    sleep 2
    WAITED=$((WAITED + 2))
    
    # Check if process is still running
    if ! ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "❌ Backend process died! Check logs:"
        tail -20 logs/backend.log
        exit 1
    fi
    
    # Check if port is listening
    if netstat -tlnp 2>/dev/null | grep -q :8080 || ss -tlnp 2>/dev/null | grep -q :8080; then
        echo "✅ Backend is listening on port 8080"
        break
    fi
    
    echo -n "."
done

echo ""
echo ""

# Test API endpoint
echo "🧪 Testing API endpoint..."
sleep 2
API_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" http://localhost:8080/api/v1/customer-portal/packages 2>&1)
HTTP_CODE=$(echo "$API_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "400" ]; then
    echo "✅ Backend is responding (HTTP $HTTP_CODE)"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ BACKEND SUCCESSFULLY STARTED!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📋 Backend Information:"
    echo "   PID: $BACKEND_PID"
    echo "   Port: 8080"
    echo "   Logs: backend/logs/backend.log"
    echo "   API: http://localhost:8080/api/v1"
    echo ""
    echo "📋 Useful Commands:"
    echo "   View logs: tail -f backend/logs/backend.log"
    echo "   Stop backend: kill $BACKEND_PID"
    echo "   Check status: ps aux | grep java"
    echo ""
else
    echo "⚠️  Backend may still be starting..."
    echo "   Check logs: tail -f backend/logs/backend.log"
    echo "   HTTP Code: $HTTP_CODE"
fi

