#!/bin/bash

# GGWIFI Backend Dependencies Fix Script
# This script installs and configures all required dependencies

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  GGWIFI Backend Dependencies Fix      ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to print status
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Update package list
print_status "Updating package list..."
sudo apt update

# Install Maven
if ! command_exists mvn; then
    print_status "Installing Maven..."
    sudo apt install -y maven
else
    print_status "Maven already installed"
fi

# Install FreeRADIUS
if ! command_exists freeradius; then
    print_status "Installing FreeRADIUS..."
    sudo apt install -y freeradius freeradius-mysql freeradius-utils
else
    print_status "FreeRADIUS already installed"
fi

# Install additional MySQL packages
print_status "Installing additional MySQL packages..."
sudo apt install -y mysql-client mysql-server

# Configure MySQL root password
print_status "Configuring MySQL root authentication..."

# Try to set root password using mysql_secure_installation approach
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'kolombo@123%';" 2>/dev/null || {
    print_warning "Could not set MySQL root password. You may need to do this manually."
    echo "Run: sudo mysql"
    echo "Then execute: ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'kolombo@123%';"
    echo "Then: FLUSH PRIVILEGES;"
}

# Start and enable services
print_status "Starting and enabling services..."

# MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# FreeRADIUS
sudo systemctl start freeradius
sudo systemctl enable freeradius

# Check service status
print_status "Checking service status..."

echo ""
echo -e "${BLUE}MySQL Status:${NC}"
sudo systemctl status mysql --no-pager -l

echo ""
echo -e "${BLUE}FreeRADIUS Status:${NC}"
sudo systemctl status freeradius --no-pager -l

# Test MySQL connection
print_status "Testing MySQL connection..."
if mysql -u root -p'kolombo@123%' -e "SELECT 'MySQL connection successful!' as status;" 2>/dev/null; then
    print_status "✓ MySQL connection successful"
else
    print_warning "⚠ MySQL connection failed. You may need to configure authentication manually."
fi

# Create database and setup
print_status "Setting up database..."
mysql -u root -p'kolombo@123%' -e "CREATE DATABASE IF NOT EXISTS ggwifi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || {
    print_warning "Could not create database. You may need to configure MySQL authentication first."
}

# Check Java version
print_status "Checking Java version..."
java -version

# Check Maven version
print_status "Checking Maven version..."
mvn -version

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Dependencies Setup Complete!         ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. If MySQL authentication failed, run:"
echo "   sudo mysql"
echo "   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'kolombo@123%';"
echo "   FLUSH PRIVILEGES;"
echo ""
echo "2. Run the database setup script:"
echo "   ./setup-database.sh"
echo ""
echo "3. Start the backend:"
echo "   mvn spring-boot:run"
echo ""
