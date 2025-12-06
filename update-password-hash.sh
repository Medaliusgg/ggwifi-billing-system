#!/bin/bash

# Update admin password hash in database
# Hash: $2a$10$YNq4hCKiuzZ5Wc6.ghp2kuBtaewzeuwMNayw37XiJ2Sb41P9pqwEm
# Password: Kolombo@123%

DB_NAME="ggnetworks"
DB_USER="ggnetworks"
DB_PASSWORD="secure_password"
HASH='$2a$10$YNq4hCKiuzZ5Wc6.ghp2kuBtaewzeuwMNayw37XiJ2Sb41P9pqwEm'

echo "🔄 Updating admin password hash..."
echo ""

mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" <<EOF
UPDATE users 
SET password = '$HASH' 
WHERE username = 'medalius';
EOF

if [ $? -eq 0 ]; then
    echo "✅ Password hash updated successfully!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Verifying update..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SELECT username, phone_number, role, is_active FROM users WHERE username = 'medalius';"
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ Ready to test login!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Go to: https://admin.ggwifi.co.tz"
    echo "Username: medalius"
    echo "Phone: 0742844024"
    echo "Password: Kolombo@123%"
else
    echo "❌ Failed to update password hash"
    exit 1
fi


