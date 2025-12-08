#!/bin/bash

# Generate BCrypt hash for password using Python
# This will generate a proper BCrypt hash that Spring Security can verify

PASSWORD="Kolombo@123%"

echo "🔐 Generating BCrypt hash for password: $PASSWORD"
echo ""

# Check if Python3 is available
if command -v python3 &> /dev/null; then
    echo "Using Python3 with bcrypt library..."
    python3 << EOF
import bcrypt
import sys

password = "$PASSWORD"
# Generate BCrypt hash with cost factor 10 (Spring Security default)
hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=10))
print(hashed.decode('utf-8'))
EOF
elif command -v python &> /dev/null; then
    echo "Using Python with bcrypt library..."
    python << EOF
import bcrypt
import sys

password = "$PASSWORD"
# Generate BCrypt hash with cost factor 10 (Spring Security default)
hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=10))
print(hashed.decode('utf-8'))
EOF
else
    echo "❌ Python not found. Installing bcrypt library..."
    echo ""
    echo "Please install Python and bcrypt:"
    echo "  pip3 install bcrypt"
    echo ""
    echo "Or use this online BCrypt generator:"
    echo "  https://bcrypt-generator.com/"
    echo ""
    echo "Password: $PASSWORD"
    echo "Rounds: 10"
    exit 1
fi

echo ""
echo "✅ Copy the hash above and use it in the SQL UPDATE command"




