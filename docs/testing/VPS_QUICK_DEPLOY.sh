#!/bin/bash

# Quick VPS Deployment Script
# This script helps deploy to your VPS: root@139.84.241.182

VPS_IP="139.84.241.182"
VPS_USER="root"
VPS_SSH="root@139.84.241.182"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "╔════════════════════════════════════════════════════════╗"
echo "║     VPS Quick Deployment - 139.84.241.182            ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Test SSH connection
echo -e "${BLUE}Step 1: Testing SSH connection...${NC}"
if ssh -o ConnectTimeout=5 -o BatchMode=yes "$VPS_SSH" "echo 'Connected'" 2>/dev/null; then
    echo -e "${GREEN}✅ SSH connection successful${NC}"
else
    echo -e "${YELLOW}⚠️  SSH connection test failed (may require password)${NC}"
    echo "   You'll be prompted for password when connecting"
fi
echo ""

# Step 2: Upload setup script
echo -e "${BLUE}Step 2: Uploading database setup script...${NC}"
if scp docs/testing/VPS_DATABASE_SETUP.sh "$VPS_SSH:/tmp/" 2>/dev/null; then
    echo -e "${GREEN}✅ Setup script uploaded${NC}"
else
    echo -e "${RED}❌ Failed to upload script${NC}"
    echo "   Please upload manually: scp docs/testing/VPS_DATABASE_SETUP.sh $VPS_SSH:/tmp/"
    exit 1
fi
echo ""

# Step 3: Instructions
echo -e "${BLUE}Step 3: Next steps on VPS${NC}"
echo ""
echo "SSH into VPS and run:"
echo -e "${YELLOW}  ssh $VPS_SSH${NC}"
echo ""
echo "Then execute:"
echo -e "${YELLOW}  chmod +x /tmp/VPS_DATABASE_SETUP.sh${NC}"
echo -e "${YELLOW}  /tmp/VPS_DATABASE_SETUP.sh${NC}"
echo ""

# Step 4: Test connection
read -p "Do you want to test VPS backend connection now? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo -e "${BLUE}Testing VPS backend...${NC}"
    HEALTH=$(curl -s --connect-timeout 5 "http://$VPS_IP:8080/api/v1/health" 2>/dev/null)
    if [ $? -eq 0 ] && [ -n "$HEALTH" ]; then
        echo -e "${GREEN}✅ VPS backend is responding${NC}"
        echo "$HEALTH" | jq . 2>/dev/null || echo "$HEALTH"
    else
        echo -e "${YELLOW}⚠️  VPS backend not responding (may not be running)${NC}"
        echo "   This is normal if backend hasn't been started yet"
    fi
fi
echo ""

# Summary
echo -e "${GREEN}=== Quick Deploy Summary ===${NC}"
echo ""
echo "VPS Details:"
echo "  IP: $VPS_IP"
echo "  User: $VPS_USER"
echo "  SSH: $VPS_SSH"
echo ""
echo "Next Steps:"
echo "  1. SSH: ssh $VPS_SSH"
echo "  2. Run: /tmp/VPS_DATABASE_SETUP.sh"
echo "  3. Update application config"
echo "  4. Restart backend"
echo "  5. Test: bash docs/testing/VPS_REMOTE_TEST.sh"
echo ""




