# GGNetworks Backend Makefile
# Common development and deployment tasks

.PHONY: help build test clean run docker-build docker-run docker-stop docker-clean db-setup db-migrate db-reset logs

# Default target
help:
	@echo "GGNetworks Backend - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  build        - Build the application with Maven"
	@echo "  test         - Run tests"
	@echo "  clean        - Clean build artifacts"
	@echo "  run          - Run the application locally"
	@echo "  db-setup     - Set up the database"
	@echo "  db-migrate   - Run database migrations"
	@echo "  db-reset     - Reset database (WARNING: Destructive)"
	@echo ""
	@echo "Docker:"
	@echo "  docker-build - Build Docker image"
	@echo "  docker-run   - Run with Docker Compose"
	@echo "  docker-stop  - Stop Docker containers"
	@echo "  docker-clean - Clean Docker resources"
	@echo ""
	@echo "Monitoring:"
	@echo "  logs         - View application logs"
	@echo "  health       - Check application health"
	@echo ""
	@echo "Production:"
	@echo "  prod-build   - Build for production"
	@echo "  prod-deploy  - Deploy to production"
	@echo "  prod-logs    - View production logs"

# Development Commands
build:
	@echo "Building GGNetworks Backend..."
	mvn clean compile

test:
	@echo "Running tests..."
	mvn test

clean:
	@echo "Cleaning build artifacts..."
	mvn clean

run:
	@echo "Starting GGNetworks Backend..."
	mvn spring-boot:run

# Database Commands
db-setup:
	@echo "Setting up database..."
	@echo "Please ensure MySQL is running and create the database:"
	@echo "CREATE DATABASE ggnetworks;"
	@echo "CREATE USER 'ggnetworks'@'localhost' IDENTIFIED BY 'password';"
	@echo "GRANT ALL PRIVILEGES ON ggnetworks.* TO 'ggnetworks'@'localhost';"
	@echo "FLUSH PRIVILEGES;"

db-migrate:
	@echo "Running database migrations..."
	mvn flyway:migrate

db-reset:
	@echo "WARNING: This will reset the database!"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	mvn flyway:clean flyway:migrate

# Docker Commands
docker-build:
	@echo "Building Docker image..."
	docker build -t ggnetworks-backend .

docker-run:
	@echo "Starting GGNetworks Backend with Docker Compose..."
	docker-compose up -d

docker-stop:
	@echo "Stopping Docker containers..."
	docker-compose down

docker-clean:
	@echo "Cleaning Docker resources..."
	docker-compose down -v --remove-orphans
	docker system prune -f

# Monitoring Commands
logs:
	@echo "Viewing application logs..."
	@if [ -f "logs/ggnetworks-backend.log" ]; then \
		tail -f logs/ggnetworks-backend.log; \
	else \
		echo "No log file found. Starting application first..."; \
		make run; \
	fi

health:
	@echo "Checking application health..."
	@curl -f http://localhost:8080/api/v1/health || echo "Application is not running"

# Production Commands
prod-build:
	@echo "Building for production..."
	mvn clean package -DskipTests
	docker build -t ggnetworks-backend:prod .

prod-deploy:
	@echo "Deploying to production..."
	@if [ ! -f ".env" ]; then \
		echo "Error: .env file not found. Please copy env.example to .env and configure it."; \
		exit 1; \
	fi
	docker-compose -f docker-compose.prod.yml up -d

prod-logs:
	@echo "Viewing production logs..."
	docker-compose -f docker-compose.prod.yml logs -f ggnetworks-backend

# Utility Commands
install-deps:
	@echo "Installing dependencies..."
	mvn dependency:resolve

format:
	@echo "Formatting code..."
	mvn spotless:apply

lint:
	@echo "Running code analysis..."
	mvn spotless:check

# Quick start for development
dev-setup: install-deps db-setup db-migrate
	@echo "Development environment setup complete!"
	@echo "Run 'make run' to start the application"

# Quick start with Docker
docker-dev: docker-build docker-run
	@echo "Docker development environment started!"
	@echo "Application available at: http://localhost:8080"
	@echo "Swagger UI available at: http://localhost:8080/swagger-ui.html"

# Clean everything
full-clean: clean docker-clean
	@echo "Full cleanup completed!" 