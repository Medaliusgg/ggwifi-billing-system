#!/bin/bash

# GGWIFI Backend Deployment Script
# This script helps deploy the backend to various cloud providers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 GGWIFI Backend Deployment Script${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "StandaloneServer.java" ]; then
    echo -e "${RED}❌ Error: Please run this script from the backend directory${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Backend Deployment Options:${NC}"
echo ""
echo "1. 🐳 Docker Deployment (Recommended)"
echo "2. ☁️  DigitalOcean Droplet"
echo "3. 🚂 Railway.app"
echo "4. 🟣 Heroku"
echo "5. 🧪 Test locally with ngrok"
echo ""

read -p "Choose deployment option (1-5): " choice

case $choice in
    1)
        echo -e "${BLUE}🐳 Setting up Docker deployment...${NC}"
        
        # Create Dockerfile
        cat > Dockerfile << 'EOF'
FROM openjdk:17-jdk-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    mysql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy Maven dependencies
COPY . /app/

# Download Maven dependencies
RUN if [ -d "$HOME/.m2/repository" ]; then \
        mkdir -p /root/.m2/repository && \
        cp -r $HOME/.m2/repository/* /root/.m2/repository/; \
    fi

# Compile the application
RUN javac -cp ".:$(find /root/.m2/repository -name "*.jar" 2>/dev/null | tr '\n' ':' 2>/dev/null)" StandaloneServer.java

# Expose port
EXPOSE 8082

# Run the application
CMD ["java", "-cp", ".:$(find /root/.m2/repository -name '*.jar' 2>/dev/null | tr '\n' ':' 2>/dev/null)", "StandaloneServer"]
EOF

        # Create docker-compose.yml
        cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8082:8082"
    environment:
      - DB_HOST=mysql
      - DB_NAME=ggwifi
      - DB_USER=root
      - DB_PASSWORD=kolombo@123%
    depends_on:
      - mysql
    
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: kolombo@123%
      MYSQL_DATABASE: ggwifi
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./src/main/resources/db/migration:/docker-entrypoint-initdb.d

volumes:
  mysql_data:
EOF

        echo -e "${GREEN}✅ Docker files created!${NC}"
        echo -e "${YELLOW}📝 To deploy:${NC}"
        echo "   docker-compose up -d"
        echo "   docker-compose logs -f backend"
        ;;
        
    2)
        echo -e "${BLUE}☁️  DigitalOcean Droplet Setup${NC}"
        echo ""
        echo -e "${YELLOW}📝 Steps to deploy:${NC}"
        echo "1. Create a DigitalOcean Droplet (Ubuntu 22.04)"
        echo "2. SSH into your droplet:"
        echo "   ssh root@YOUR_DROPLET_IP"
        echo ""
        echo "3. Run these commands on the droplet:"
        echo "   apt update && apt install -y git openjdk-17-jdk mysql-server"
        echo "   git clone https://github.com/Medaliusgg/ggwifi-billing-system.git"
        echo "   cd ggwifi-billing-system/backend"
        echo "   mysql_secure_installation"
        echo "   mysql -u root -p -e 'CREATE DATABASE ggwifi;'"
        echo "   java -cp \".:\$(find ~/.m2/repository -name \"*.jar\" | tr '\n' ':')\" StandaloneServer"
        ;;
        
    3)
        echo -e "${BLUE}🚂 Railway.app Deployment${NC}"
        echo ""
        echo -e "${YELLOW}📝 Steps:${NC}"
        echo "1. Go to https://railway.app"
        echo "2. Connect your GitHub account"
        echo "3. Select 'ggwifi-billing-system' repository"
        echo "4. Choose 'backend' folder"
        echo "5. Add environment variables:"
        echo "   DB_HOST=mysql"
        echo "   DB_NAME=ggwifi"
        echo "   DB_USER=root"
        echo "   DB_PASSWORD=kolombo@123%"
        ;;
        
    4)
        echo -e "${BLUE}🟣 Heroku Deployment${NC}"
        echo ""
        echo -e "${YELLOW}📝 Steps:${NC}"
        echo "1. Install Heroku CLI"
        echo "2. Create Heroku app:"
        echo "   heroku create ggwifi-api"
        echo "3. Add Java buildpack:"
        echo "   heroku buildpacks:set heroku/java"
        echo "4. Deploy:"
        echo "   git subtree push --prefix backend heroku main"
        ;;
        
    5)
        echo -e "${BLUE}🧪 Local testing with ngrok${NC}"
        echo ""
        echo -e "${YELLOW}📝 Steps:${NC}"
        echo "1. Install ngrok: https://ngrok.com/download"
        echo "2. Start your backend locally:"
        echo "   java -cp \".:\$(find ~/.m2/repository -name \"*.jar\" | tr '\n' ':')\" StandaloneServer"
        echo "3. In another terminal, expose it:"
        echo "   ngrok http 8082"
        echo "4. Copy the HTTPS URL and update Cloudflare Pages environment variable"
        echo "   VITE_API_BASE_URL=https://your-ngrok-url.ngrok.io/api/v1"
        ;;
        
    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Deployment instructions provided!${NC}"
echo -e "${BLUE}📞 Need help? Contact: medaliusggg@gmail.com${NC}"
