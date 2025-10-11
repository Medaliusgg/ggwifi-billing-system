#!/bin/bash

# VPS Spring Boot Fix Script
# Run this on your VPS after SSH connection

echo "🚀 Starting Spring Boot Fix on VPS..."

# 1. Update system and install Java 21 JDK
echo "📦 Installing Java 21 JDK..."
apt update
apt install -y openjdk-21-jdk

# 2. Set Java 21 as default
echo "☕ Setting Java 21 as default..."
update-alternatives --set java /usr/lib/jvm/java-21-openjdk-amd64/bin/java
update-alternatives --set javac /usr/lib/jvm/java-21-openjdk-amd64/bin/javac

# 3. Verify Java installation
echo "✅ Verifying Java installation..."
java -version
javac -version

# 4. Navigate to project directory
echo "📁 Navigating to project directory..."
cd /opt/ggwifi-billing-system/backend

# 5. Pull latest changes from GitHub
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

# 6. Update pom.xml for Java 21
echo "🔧 Updating pom.xml for Java 21..."
sed -i 's/<java.version>25<\/java.version>/<java.version>21<\/java.version>/' pom.xml
sed -i 's/<maven.compiler.source>25<\/maven.compiler.source>/<maven.compiler.source>21<\/maven.compiler.source>/' pom.xml
sed -i 's/<maven.compiler.target>25<\/maven.compiler.target>/<maven.compiler.target>21<\/maven.compiler.target>/' pom.xml
sed -i 's/<source>25<\/source>/<source>21<\/source>/' pom.xml
sed -i 's/<target>25<\/target>/<target>21<\/target>/' pom.xml

# 7. Clean and build Spring Boot
echo "🔨 Building Spring Boot application..."
mvn clean package -DskipTests

# 8. Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Spring Boot build successful!"
    echo "🚀 Starting Spring Boot application..."
    java -jar target/ggnetworks-backend-1.0.0.jar
else
    echo "❌ Build failed. Checking for errors..."
    mvn compile -DskipTests
fi

echo "🎉 Spring Boot fix completed!"
