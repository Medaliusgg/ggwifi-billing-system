#!/bin/bash

# GGWIFI Database Setup Script
# This script sets up the MySQL database for both the backend and FreeRADIUS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database configuration
DB_NAME="ggwifi"
DB_USER="root"
DB_PASSWORD="kolombo@123%"
DB_HOST="localhost"
DB_PORT="3306"

# FreeRADIUS configuration
RADIUS_USER="freeradius"
RADIUS_PASSWORD="freeradius_password"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}    GGWIFI Database Setup Script      ${NC}"
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

# Function to test MySQL connection
test_mysql_connection() {
    print_status "Testing MySQL connection..."
    
    if mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" > /dev/null 2>&1; then
        print_status "MySQL connection successful!"
        return 0
    else
        print_error "Failed to connect to MySQL. Please check your credentials."
        return 1
    fi
}

# Function to create database
create_database() {
    print_status "Creating database '$DB_NAME'..."
    
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        print_status "Database '$DB_NAME' created successfully!"
    else
        print_error "Failed to create database '$DB_NAME'"
        exit 1
    fi
}

# Function to run SQL script
run_sql_script() {
    local script_file="$1"
    local description="$2"
    
    print_status "Running $description..."
    
    if [ -f "$script_file" ]; then
        mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < "$script_file"
        
        if [ $? -eq 0 ]; then
            print_status "$description completed successfully!"
        else
            print_error "Failed to run $description"
            exit 1
        fi
    else
        print_error "SQL script not found: $script_file"
        exit 1
    fi
}

# Function to create FreeRADIUS user
create_freeradius_user() {
    print_status "Creating FreeRADIUS database user..."
    
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "
        CREATE USER IF NOT EXISTS '$RADIUS_USER'@'localhost' IDENTIFIED BY '$RADIUS_PASSWORD';
        CREATE USER IF NOT EXISTS '$RADIUS_USER'@'%' IDENTIFIED BY '$RADIUS_PASSWORD';
        
        GRANT SELECT, INSERT, UPDATE ON $DB_NAME.* TO '$RADIUS_USER'@'localhost';
        GRANT SELECT, INSERT, UPDATE ON $DB_NAME.* TO '$RADIUS_USER'@'%';
        
        FLUSH PRIVILEGES;
    " 2>/dev/null
    
    if [ $? -eq 0 ]; then
        print_status "FreeRADIUS user created successfully!"
    else
        print_warning "Failed to create FreeRADIUS user. You may need to do this manually."
    fi
}

# Function to verify setup
verify_setup() {
    print_status "Verifying database setup..."
    
    # Check if main tables exist
    local tables=("users" "packages" "radius_users" "radcheck" "radacct" "nas")
    
    for table in "${tables[@]}"; do
        local count=$(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$DB_NAME' AND table_name='$table';" -s -N 2>/dev/null)
        
        if [ "$count" -eq 1 ]; then
            print_status "✓ Table '$table' exists"
        else
            print_warning "⚠ Table '$table' not found"
        fi
    done
    
    # Check FreeRADIUS user
    local user_exists=$(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT COUNT(*) FROM mysql.user WHERE User='$RADIUS_USER';" -s -N 2>/dev/null)
    
    if [ "$user_exists" -gt 0 ]; then
        print_status "✓ FreeRADIUS user '$RADIUS_USER' exists"
    else
        print_warning "⚠ FreeRADIUS user '$RADIUS_USER' not found"
    fi
}

# Function to show connection info
show_connection_info() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}    Database Connection Information   ${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    echo -e "${GREEN}Backend Configuration:${NC}"
    echo "  Database: $DB_NAME"
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo "  Username: $DB_USER"
    echo "  Password: $DB_PASSWORD"
    echo ""
    echo -e "${GREEN}FreeRADIUS Configuration:${NC}"
    echo "  Database: $DB_NAME"
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo "  Username: $RADIUS_USER"
    echo "  Password: $RADIUS_PASSWORD"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Copy FreeRADIUS config files to /etc/freeradius/3.0/"
    echo "2. Restart FreeRADIUS service: sudo systemctl restart freeradius"
    echo "3. Test authentication: radtest test_user test123 localhost 0 testing123"
    echo "4. Start the Spring Boot backend application"
    echo ""
}

# Main execution
main() {
    echo -e "${YELLOW}Starting GGWIFI database setup...${NC}"
    echo ""
    
    # Test MySQL connection
    if ! test_mysql_connection; then
        print_error "Cannot proceed without MySQL connection. Please check your credentials and try again."
        exit 1
    fi
    
    # Create database
    create_database
    
    # Run backend schema migration
    if [ -f "src/main/resources/db/migration/V1__Create_initial_schema.sql" ]; then
        run_sql_script "src/main/resources/db/migration/V1__Create_initial_schema.sql" "Backend schema migration"
    else
        print_warning "Backend schema migration file not found. Make sure Flyway migrations are up to date."
    fi
    
    # Run FreeRADIUS configuration
    run_sql_script "freeradius-mysql-config.sql" "FreeRADIUS MySQL configuration"
    
    # Create FreeRADIUS user
    create_freeradius_user
    
    # Verify setup
    verify_setup
    
    # Show connection information
    show_connection_info
    
    print_status "Database setup completed successfully!"
}

# Check if MySQL client is installed
if ! command -v mysql &> /dev/null; then
    print_error "MySQL client is not installed. Please install it first."
    exit 1
fi

# Run main function
main "$@"
