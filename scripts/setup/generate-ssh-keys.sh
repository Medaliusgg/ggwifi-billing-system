#!/bin/bash

# Generate SSH Keys for GitHub Actions
# This script creates SSH keys for CI/CD deployment

set -e

KEY_NAME="github_actions_ggwifi"
KEY_PATH="$HOME/.ssh/$KEY_NAME"

echo "🔐 Generating SSH keys for GitHub Actions..."
echo ""

# Check if key already exists
if [ -f "$KEY_PATH" ]; then
    echo "⚠️  Key already exists at $KEY_PATH"
    read -p "Do you want to overwrite it? (yes/no): " OVERWRITE
    if [ "$OVERWRITE" != "yes" ]; then
        echo "❌ Aborted"
        exit 1
    fi
    rm -f "$KEY_PATH" "$KEY_PATH.pub"
fi

# Generate key pair
ssh-keygen -t rsa -b 4096 -C "github-actions@ggwifi.co.tz" -f "$KEY_PATH" -N ""

echo ""
echo "✅ SSH keys generated successfully!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Add public key to your VPS:"
echo "   ssh-copy-id -i $KEY_PATH.pub root@139.84.241.182"
echo ""
echo "2. Copy private key to GitHub Secrets:"
echo "   cat $KEY_PATH"
echo ""
echo "   Add to GitHub:"
echo "   - STAGING_SSH_KEY"
echo "   - PRODUCTION_SSH_KEY"
echo ""
echo "3. Test SSH connection:"
echo "   ssh -i $KEY_PATH root@139.84.241.182 'echo Connection successful'"
echo ""

