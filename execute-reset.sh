#!/bin/bash

# Production Admin Reset - Execute Script
# This script will reset the admin user on your production VPS

echo "🔐 Production Admin Reset"
echo "========================"
echo ""

# Database credentials - UPDATE THESE IF DIFFERENT
DB_HOST="${DB_HOST:-localhost}"
DB_NAME="${DB_NAME:-ggnetworks_radius}"
DB_USER="${DB_USER:-ggnetworks}"
DB_PASSWORD="${DB_PASSWORD:-ggnetworks123}"

echo "📋 Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Execute the SQL script
echo "🔄 Executing admin reset..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < reset-admin-production.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Admin reset completed successfully!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔑 New Admin Credentials:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  Username: medalius"
    echo "  Phone Number: 0742844024"
    echo "  Password: Kolombo@123%"
    echo "  Role: SUPER_ADMIN"
    echo ""
    echo "🌐 Login at: https://admin.ggwifi.co.tz/login"
    echo ""
else
    echo ""
    echo "❌ Error executing reset"
    echo "💡 Make sure:"
    echo "  1. MySQL credentials are correct"
    echo "  2. You have SSH access to the VPS"
    echo "  3. Database exists and is accessible"
    exit 1
fi




