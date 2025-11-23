#!/bin/bash
# Cloudflare Pages Build Script for Customer Portal
# This script ensures the correct build command is used

set -e

echo "🚀 Building Customer Portal..."
cd "$(dirname "$0")"
npm run build

echo "✅ Build complete!"

