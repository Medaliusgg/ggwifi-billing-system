#!/bin/bash

# Script to fix admin password hash on VPS
# This script safely updates the password hash for the 'medalius' admin user

# Configuration
DB_NAME="ggnetworks"
DB_USER="ggnetworks"
DB_PASSWORD="secure_password"
DB_HOST="localhost"

# Admin credentials
ADMIN_USERNAME="medalius"
ADMIN_PASSWORD_HASH='$2a$10$YNq4hCKiuzZ5Wc6.ghp2kuBtaewzeuwMNayw37XiJ2Sb41P9pqwEm'

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 Fixing Admin Password Hash"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Database: $DB_NAME"
echo "User: $ADMIN_USERNAME"
echo ""

# Check if MySQL client is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ Error: MySQL client is not installed."
    exit 1
fi

# Update password hash using heredoc to avoid shell interpretation of $ signs
echo "📝 Updating password hash..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" << 'EOF'
UPDATE users 
SET password = '$2a$10$YNq4hCKiuzZ5Wc6.ghp2kuBtaewzeuwMNayw37XiJ2Sb41P9pqwEm' 
WHERE username = 'medalius';
EOF

if [ $? -eq 0 ]; then
    echo "✅ Password hash updated successfully!"
    echo ""
    echo "📋 Verifying update..."
    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" << 'EOF'
SELECT 
    username, 
    LEFT(password, 30) as hash_start, 
    LENGTH(password) as hash_length,
    role,
    status
FROM users 
WHERE username = 'medalius';
EOF
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ Admin password reset complete!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Login Credentials:"
    echo "  Username: medalius"
    echo "  Phone: 0742844024"
    echo "  Password: Kolombo@123%"
    echo ""
else
    echo "❌ Error: Failed to update password hash."
    exit 1
fi




