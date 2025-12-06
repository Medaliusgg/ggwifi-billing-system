#!/bin/bash

# Verify and fix admin password hash

DB_NAME="ggnetworks"
DB_USER="ggnetworks"
DB_PASSWORD="secure_password"
CORRECT_HASH='$2a$10$YNq4hCKiuzZ5Wc6.ghp2kuBtaewzeuwMNayw37XiJ2Sb41P9pqwEm'

echo "🔍 Checking current password hash..."
echo ""

# Check current hash
CURRENT_HASH=$(mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -sN -e "SELECT password FROM users WHERE username = 'medalius';" 2>/dev/null)

if [ -z "$CURRENT_HASH" ]; then
    echo "❌ User 'medalius' not found!"
    exit 1
fi

echo "Current hash (first 30 chars): ${CURRENT_HASH:0:30}"
echo "Expected hash (first 30 chars): ${CORRECT_HASH:0:30}"
echo ""

if [ "$CURRENT_HASH" = "$CORRECT_HASH" ]; then
    echo "✅ Hash is correct!"
    echo ""
    echo "If login still fails, check:"
    echo "1. Backend logs: journalctl -u ggnetworks-backend -n 50"
    echo "2. Password being sent: Should be exactly 'Kolombo@123%'"
    echo "3. Username: Should be exactly 'medalius'"
else
    echo "⚠️  Hash doesn't match! Updating..."
    echo ""
    
    mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" <<EOF
UPDATE users 
SET password = '$CORRECT_HASH' 
WHERE username = 'medalius';
EOF

    if [ $? -eq 0 ]; then
        echo "✅ Password hash updated!"
        echo ""
        echo "Verifying..."
        NEW_HASH=$(mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -sN -e "SELECT password FROM users WHERE username = 'medalius';" 2>/dev/null)
        
        if [ "$NEW_HASH" = "$CORRECT_HASH" ]; then
            echo "✅ Verification successful!"
            echo ""
            echo "Now try logging in:"
            echo "  Username: medalius"
            echo "  Phone: 0742844024"
            echo "  Password: Kolombo@123%"
        else
            echo "❌ Update failed! Hash still doesn't match."
        fi
    else
        echo "❌ Failed to update password hash"
        exit 1
    fi
fi



