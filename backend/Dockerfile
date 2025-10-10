# Multi-stage build for GGNetworks Backend
FROM maven:3.9.5-openjdk-17 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-jre-slim

# Set working directory
WORKDIR /app

# Create non-root user
RUN groupadd -r ggnetworks && useradd -r -g ggnetworks ggnetworks

# Copy the built JAR from build stage
COPY --from=build /app/target/ggnetworks-backend-1.0.0.jar app.jar

# Create logs directory
RUN mkdir -p /app/logs && chown -R ggnetworks:ggnetworks /app

# Switch to non-root user
USER ggnetworks

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/api/v1/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"] 