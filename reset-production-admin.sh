#!/bin/bash

# Production Admin Reset Script
# Run this on your VPS to reset the admin user

echo "🔐 Production Admin Reset Script"
echo "================================"
echo ""

# Default values - UPDATE THESE FOR YOUR VPS
DB_HOST="${DB_HOST:-localhost}"
DB_NAME="${DB_NAME:-ggnetworks_radius}"
DB_USER="${DB_USER:-ggnetworks}"
DB_PASSWORD="${DB_PASSWORD:-ggnetworks123}"

echo "📋 Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Delete all admin users
echo "🗑️  Deleting all existing admin users..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" <<EOF
DELETE FROM users WHERE role IN ('ADMIN', 'SUPER_ADMIN');
EOF

if [ $? -eq 0 ]; then
    echo "✅ All admin users deleted"
else
    echo "❌ Error deleting admin users"
    echo "💡 Make sure MySQL credentials are correct"
    exit 1
fi

# Create new admin user
echo "👤 Creating new admin user..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" <<EOF
INSERT INTO users (
    username,
    phone_number,
    password,
    first_name,
    last_name,
    email,
    role,
    status,
    is_active,
    is_email_verified,
    is_phone_verified,
    created_at,
    updated_at
) VALUES (
    'medalius',
    '0742844024',
    '\$2a\$10\$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa',
    'Medalius',
    'Administrator',
    'medalius@ggwifi.co.tz',
    'SUPER_ADMIN',
    'ACTIVE',
    1,
    1,
    1,
    NOW(),
    NOW()
);
EOF

if [ $? -eq 0 ]; then
    echo "✅ New admin user created successfully!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔑 Login Credentials:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  Username: medalius"
    echo "  Phone Number: 0742844024"
    echo "  Password: Kolombo@123%"
    echo "  Role: SUPER_ADMIN"
    echo ""
    echo "🌐 Login URL: https://admin.ggwifi.co.tz/login"
    echo ""
    echo "🎯 You can now login to the admin portal!"
else
    echo "❌ Error creating admin user"
    exit 1
fi


