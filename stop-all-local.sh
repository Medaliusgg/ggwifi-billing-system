#!/bin/bash

# Stop All Local Services

echo "Stopping all local services..."

# Kill backend
pkill -f "spring-boot:run" && echo "✓ Backend stopped" || echo "Backend not running"

# Kill frontend dev servers
pkill -f "vite" && echo "✓ Frontend servers stopped" || echo "Frontend servers not running"

# Remove PID file if exists
[ -f .local-pids ] && rm .local-pids && echo "✓ PID file removed"

echo "All services stopped!"

