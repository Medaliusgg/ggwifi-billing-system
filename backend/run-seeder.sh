#!/bin/bash

# GGWIFI Data Seeder Runner
# This script runs the data seeder to populate the database with initial data

echo "🌱 GGWIFI Data Seeder"
echo "===================="

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if MySQL client is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL client is not installed. Please install MySQL client first."
    exit 1
fi

# Check if required Python packages are installed
echo "📦 Checking Python dependencies..."
python3 -c "import mysql.connector, bcrypt" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "⚠️  Installing required Python packages..."
    pip3 install mysql-connector-python bcrypt
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Python packages. Please install them manually:"
        echo "   pip3 install mysql-connector-python bcrypt"
        exit 1
    fi
fi

# Check if database exists
echo "🔍 Checking database connection..."
mysql -u root -p'kolombo@123%' -e "USE ggwifi;" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "❌ Database 'ggwifi' does not exist or connection failed."
    echo "Please ensure:"
    echo "  1. MySQL is running"
    echo "  2. Database 'ggwifi' exists"
    echo "  3. User 'root' has access with password 'kolombo@123%'"
    exit 1
fi

# Run the data seeder
echo "🚀 Running data seeder..."
python3 data-seeder.py

echo ""
echo "✨ Seeder completed!"
echo ""
echo "🔐 Admin Login Credentials:"
echo "   Phone: 0773404760"
echo "   Password: Ashruha@123%"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8080"
