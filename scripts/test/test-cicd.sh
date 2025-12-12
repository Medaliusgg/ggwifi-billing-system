#!/bin/bash

# Test CI/CD Pipeline Script
# Creates a test branch and PR to trigger staging deployment

set -e

echo "🧪 Testing CI/CD Pipeline..."
echo ""

# Check we're in the right directory
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Switch to develop branch
echo "📋 Switching to develop branch..."
git checkout develop 2>/dev/null || git checkout -b develop origin/develop
git pull origin develop

# Create test branch
BRANCH_NAME="feature/test-cicd-$(date +%Y%m%d-%H%M%S)"
echo "🌿 Creating test branch: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME"

# Make a small test change
echo ""
echo "📝 Making test change..."
if [ ! -f "backend/README.md" ]; then
    touch backend/README.md
fi

echo "" >> backend/README.md
echo "## CI/CD Test - $(date '+%Y-%m-%d %H:%M:%S')" >> backend/README.md
echo "Testing automated deployment to staging." >> backend/README.md
echo "" >> backend/README.md

# Commit and push
echo "💾 Committing changes..."
git add backend/README.md
git commit -m "test: CI/CD pipeline validation - $(date '+%Y-%m-%d %H:%M:%S')"

echo "🚀 Pushing to GitHub..."
git push origin "$BRANCH_NAME"

echo ""
echo "✅ Test branch created and pushed!"
echo ""
echo "📋 Next steps:"
echo "1. Go to: https://github.com/Medaliusgg/ggwifi-billing-system"
echo "2. Click 'Compare & pull request' for branch: $BRANCH_NAME"
echo "3. Base: develop ← Compare: $BRANCH_NAME"
echo "4. Create PR"
echo "5. Watch GitHub Actions deploy to staging!"
echo ""
echo "🔗 Direct PR link:"
echo "https://github.com/Medaliusgg/ggwifi-billing-system/compare/develop...$BRANCH_NAME"

