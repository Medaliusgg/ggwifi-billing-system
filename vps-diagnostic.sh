#!/bin/bash

echo "🔍 VPS Diagnostic Script"
echo "======================="
echo ""
echo "⚠️  This script needs to be run ON YOUR VPS"
echo "   SSH to your VPS first: ssh root@your-vps-ip"
echo "   Then run this script"
echo ""

echo "📋 Diagnostic Commands to Run on VPS:"
echo "====================================="
echo ""

echo "1️⃣ Check what's using port 8080:"
echo "   sudo lsof -i :8080"
echo "   netstat -tlnp | grep 8080"
echo ""

echo "2️⃣ Check Java processes:"
echo "   ps aux | grep java"
echo "   pgrep -f ggnetworks"
echo ""

echo "3️⃣ Check Spring Boot logs:"
echo "   tail -f /var/log/ggwifi-backend.log"
echo "   tail -20 /var/log/ggwifi-backend.log"
echo ""

echo "4️⃣ Check if Spring Boot is running locally on VPS:"
echo "   curl http://localhost:8080/api/v1/test"
echo "   curl http://127.0.0.1:8080/api/v1/test"
echo ""

echo "5️⃣ Check deployment directory:"
echo "   ls -la /opt/ggwifi-billing-system/backend/"
echo "   ls -la /opt/ggwifi-billing-system/backend/target/"
echo ""

echo "6️⃣ Check if JAR file exists:"
echo "   ls -la /opt/ggwifi-billing-system/backend/target/ggnetworks-backend-1.0.0.jar"
echo ""

echo "7️⃣ Check recent deployment logs:"
echo "   tail -50 /var/log/ggwifi-backend.log"
echo ""

echo "8️⃣ Manual start test:"
echo "   cd /opt/ggwifi-billing-system/backend"
echo "   java -jar target/ggnetworks-backend-1.0.0.jar"
echo ""

echo "🔧 Quick Fix Commands:"
echo "====================="
echo ""

echo "If Spring Boot is not running:"
echo "   cd /opt/ggwifi-billing-system/backend"
echo "   sudo pkill -f java"
echo "   nohup java -jar target/ggnetworks-backend-1.0.0.jar > /var/log/ggwifi-backend.log 2>&1 &"
echo ""

echo "If port 8080 is occupied by something else:"
echo "   sudo lsof -i :8080"
echo "   sudo kill -9 <PID>"
echo ""

echo "If JAR file is missing or corrupted:"
echo "   cd /opt/ggwifi-billing-system/backend"
echo "   git pull origin main"
echo "   mvn clean package -DskipTests"
echo ""

echo "📱 Expected Results:"
echo "==================="
echo ""
echo "✅ Port 8080 should show Java process"
echo "✅ ps aux | grep java should show Spring Boot"
echo "✅ curl localhost:8080/api/v1/test should return JSON"
echo "✅ Logs should show 'Started SimpleApplication'"
echo ""

echo "🚨 Common Issues:"
echo "================="
echo ""
echo "❌ Port 8080 occupied by another service"
echo "❌ Java process crashed during startup"
echo "❌ JAR file missing or corrupted"
echo "❌ Database connection issues"
echo "❌ Memory/resource constraints"
echo ""

echo "🎯 Run these commands on your VPS to diagnose the issue!"
echo "   Most likely: Spring Boot process crashed or didn't start properly"
