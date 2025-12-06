#!/bin/bash

# Deploy Customer Portal Frontend to Cloudflare Pages
# Usage: ./deploy-to-cloudflare.sh

set -e

echo "🚀 Deploying Customer Portal to Cloudflare Pages..."
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Check if logged in to Cloudflare
if ! wrangler whoami &> /dev/null; then
    echo "⚠️  Not logged in to Cloudflare. Please login:"
    echo "   wrangler login"
    exit 1
fi

# Build the project
echo "📦 Building customer portal..."
npm run build

# Copy deployment files
echo "📋 Copying deployment files..."
cp _headers dist/ 2>/dev/null || true
cp _redirects dist/ 2>/dev/null || true

# Deploy to Cloudflare Pages
echo "🌐 Deploying to Cloudflare Pages..."
wrangler pages deploy dist \
    --project-name=ggwifi-customer-portal \
    --branch=main

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your customer portal should be live at: https://hotspot.ggwifi.co.tz"
echo ""
echo "📝 Next steps:"
echo "   1. Verify the deployment in Cloudflare Dashboard"
echo "   2. Test the portal functionality"
echo "   3. Check API connectivity"

