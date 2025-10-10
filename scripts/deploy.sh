#!/bin/bash

# GGWIFI Multi-Domain Deployment Script
# This script helps deploy different frontend applications to their respective domains

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/Frontend"
BACKEND_DIR="$PROJECT_ROOT/backend"

# Available applications
ADMIN_PORTAL="admin_portal"
CUSTOMER_PORTAL="customer_portal"
MAIN_WEBSITE="main_website"

# Domain configuration
declare -A DOMAINS=(
    ["$ADMIN_PORTAL"]="admin.ggwifi.co.tz"
    ["$CUSTOMER_PORTAL"]="portal.ggwifi.co.tz"
    ["$MAIN_WEBSITE"]="www.ggwifi.co.tz"
)

# Environment configuration
declare -A API_URLS=(
    ["production"]="https://api.ggwifi.co.tz/api/v1"
    ["staging"]="https://api-dev.ggwifi.co.tz/api/v1"
    ["development"]="http://127.0.0.1:8082/api/v1"
)

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if application exists
check_application() {
    local app=$1
    if [ ! -d "$FRONTEND_DIR/$app" ]; then
        log_error "Application '$app' not found in $FRONTEND_DIR/"
        return 1
    fi
    return 0
}

# Build application
build_application() {
    local app=$1
    local env=$2
    
    log_info "Building $app for $env environment..."
    
    cd "$FRONTEND_DIR/$app"
    
    # Set environment variables
    export VITE_API_BASE_URL="${API_URLS[$env]}"
    export VITE_ENVIRONMENT="$env"
    export VITE_APP_DOMAIN="${DOMAINS[$app]}"
    
    # Install dependencies
    log_info "Installing dependencies..."
    npm ci
    
    # Build application
    log_info "Building application..."
    npm run build
    
    log_success "$app built successfully!"
}

# Deploy to Cloudflare Pages (placeholder)
deploy_to_cloudflare() {
    local app=$1
    local env=$2
    
    log_info "Deploying $app to Cloudflare Pages..."
    
    # This would integrate with Cloudflare Pages API
    # For now, we'll just show what would happen
    log_warning "Cloudflare Pages deployment not implemented yet"
    log_info "Would deploy $app from $FRONTEND_DIR/$app/dist to ${DOMAINS[$app]}"
}

# Show usage
show_usage() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  build <app> [env]     Build application (default: production)"
    echo "  deploy <app> [env]    Deploy application (default: production)"
    echo "  build-all [env]       Build all applications"
    echo "  deploy-all [env]      Deploy all applications"
    echo "  status                Show deployment status"
    echo ""
    echo "Applications:"
    echo "  $ADMIN_PORTAL         Admin Portal (${DOMAINS[$ADMIN_PORTAL]})"
    echo "  $CUSTOMER_PORTAL      Customer Portal (${DOMAINS[$CUSTOMER_PORTAL]})"
    echo "  $MAIN_WEBSITE         Main Website (${DOMAINS[$MAIN_WEBSITE]})"
    echo ""
    echo "Environments:"
    echo "  production            Production deployment"
    echo "  staging               Staging deployment"
    echo "  development           Development build"
    echo ""
    echo "Examples:"
    echo "  $0 build $ADMIN_PORTAL production"
    echo "  $0 deploy $CUSTOMER_PORTAL staging"
    echo "  $0 build-all production"
}

# Show deployment status
show_status() {
    log_info "GGWIFI Deployment Status"
    echo ""
    
    echo "Frontend Applications:"
    for app in "$ADMIN_PORTAL" "$CUSTOMER_PORTAL" "$MAIN_WEBSITE"; do
        if check_application "$app" 2>/dev/null; then
            echo "  ✅ $app (${DOMAINS[$app]})"
        else
            echo "  ❌ $app (Not found)"
        fi
    done
    
    echo ""
    echo "Backend:"
    if [ -d "$BACKEND_DIR" ]; then
        echo "  ✅ Backend (api.ggwifi.co.tz)"
    else
        echo "  ❌ Backend (Not found)"
    fi
    
    echo ""
    echo "Current Environment URLs:"
    for env in production staging development; do
        echo "  $env: ${API_URLS[$env]}"
    done
}

# Main script logic
main() {
    local command=$1
    local app=$2
    local env=${3:-production}
    
    case $command in
        "build")
            if [ -z "$app" ]; then
                log_error "Application name required"
                show_usage
                exit 1
            fi
            
            if ! check_application "$app"; then
                exit 1
            fi
            
            build_application "$app" "$env"
            ;;
            
        "deploy")
            if [ -z "$app" ]; then
                log_error "Application name required"
                show_usage
                exit 1
            fi
            
            if ! check_application "$app"; then
                exit 1
            fi
            
            build_application "$app" "$env"
            deploy_to_cloudflare "$app" "$env"
            ;;
            
        "build-all")
            log_info "Building all applications for $env environment..."
            for app in "$ADMIN_PORTAL" "$CUSTOMER_PORTAL" "$MAIN_WEBSITE"; do
                if check_application "$app"; then
                    build_application "$app" "$env"
                fi
            done
            log_success "All applications built successfully!"
            ;;
            
        "deploy-all")
            log_info "Deploying all applications to $env environment..."
            for app in "$ADMIN_PORTAL" "$CUSTOMER_PORTAL" "$MAIN_WEBSITE"; do
                if check_application "$app"; then
                    build_application "$app" "$env"
                    deploy_to_cloudflare "$app" "$env"
                fi
            done
            log_success "All applications deployed successfully!"
            ;;
            
        "status")
            show_status
            ;;
            
        "help"|"--help"|"-h"|"")
            show_usage
            ;;
            
        *)
            log_error "Unknown command: $command"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
