#!/bin/bash

# Quick deployment commands for VPS: 139.84.241.182
# Run these commands in order

echo "============================================"
echo "STEP 1: Copy script to VPS"
echo "============================================"
cd "/home/medalius/Desktop/PROJECT 3./GG-WIFI WEB-APP"
scp deploy-to-vps.sh root@139.84.241.182:/root/

echo ""
echo "✅ Script copied! Now SSH into VPS and run:"
echo "   ssh root@139.84.241.182"
echo "   chmod +x /root/deploy-to-vps.sh"
echo "   /root/deploy-to-vps.sh"
echo ""
echo "After deployment, come back and run STEP 2 to test."

