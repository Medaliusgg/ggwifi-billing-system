#!/bin/bash

# GGWIFI Java Standalone Server Startup Script
echo "🚀 Starting GGWIFI Java Standalone Server..."

# Navigate to backend directory
cd "$(dirname "$0")"

# Check if Java is available
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed or not in PATH"
    exit 1
fi

# Check if the compiled class exists
if [ ! -f "StandaloneServer.class" ]; then
    echo "📦 Compiling StandaloneServer.java..."
    javac StandaloneServer.java
    if [ $? -ne 0 ]; then
        echo "❌ Compilation failed"
        exit 1
    fi
    echo "✅ Compilation successful"
fi

# Start the server
echo "🌐 Starting server on port 8082..."
echo "📡 Available endpoints:"
echo "   GET  /api/v1/health"
echo "   GET  /api/v1/dashboard"
echo "   GET  /api/v1/routers"
echo "   GET  /api/v1/customers"
echo "   GET  /api/v1/packages"
echo "   POST /api/v1/auth/login"
echo "   GET  /"
echo ""
echo "🔐 Admin Credentials:"
echo "   Phone: 0773404760"
echo "   Password: Ashruha@123%"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

java StandaloneServer
