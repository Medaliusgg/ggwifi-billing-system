#!/usr/bin/env python3
"""
Simple GGWIFI Backend Server
Simulates the Spring Boot backend API for testing purposes
"""

import json
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading

class GGWIFIHandler(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Set CORS headers
        self.send_cors_headers()
        
        if path == '/api/v1/health':
            self.send_json_response({
                "status": "UP",
                "service": "GGWIFI Backend API",
                "version": "1.0.0",
                "timestamp": int(time.time() * 1000)
            })
        elif path == '/api/v1/dashboard':
            self.send_json_response({
                "totalCustomers": 1250,
                "activeRouters": 8,
                "todaysRevenue": 450000,
                "activeSessions": 342,
                "status": "success",
                "timestamp": int(time.time() * 1000)
            })
        elif path == '/api/v1/routers':
            self.send_json_response({
                "routers": [
                    {
                        "id": 1,
                        "name": "Main Router",
                        "ipAddress": "192.168.1.1",
                        "status": "ONLINE",
                        "location": "Main Office",
                        "cpuUsagePercent": 45,
                        "memoryUsagePercent": 62,
                        "activeConnections": 25
                    },
                    {
                        "id": 2,
                        "name": "Branch Router",
                        "ipAddress": "192.168.2.1",
                        "status": "ONLINE",
                        "location": "Branch Office",
                        "cpuUsagePercent": 38,
                        "memoryUsagePercent": 55,
                        "activeConnections": 18
                    }
                ],
                "status": "success"
            })
        elif path == '/api/v1/customers':
            self.send_json_response({
                "customers": [
                    {
                        "id": 1,
                        "fullName": "John Doe",
                        "phoneNumber": "+255123456789",
                        "userType": "HOTSPOT_USER",
                        "active": True,
                        "createdAt": "2024-01-15T10:30:00Z"
                    },
                    {
                        "id": 2,
                        "fullName": "Jane Smith",
                        "phoneNumber": "+255987654321",
                        "userType": "PPPOE_USER",
                        "active": True,
                        "createdAt": "2024-01-20T14:15:00Z"
                    }
                ],
                "total": 1250,
                "status": "success"
            })
        elif path == '/api/v1/packages':
            self.send_json_response({
                "packages": [
                    {
                        "id": 1,
                        "name": "Basic Plan",
                        "description": "Basic internet package",
                        "price": 25000,
                        "durationDays": 30,
                        "type": "HOTSPOT",
                        "active": True
                    },
                    {
                        "id": 2,
                        "name": "Premium Plan",
                        "description": "Premium internet package",
                        "price": 50000,
                        "durationDays": 30,
                        "type": "HOTSPOT",
                        "active": True
                    }
                ],
                "status": "success"
            })
        elif path == '/api/v1/seed':
            self.send_json_response({
                "message": "Database seeder endpoint",
                "instructions": "Run the seeder script to populate database with initial data",
                "commands": [
                    "cd backend && python3 data-seeder.py",
                    "cd backend && ./run-seeder.sh"
                ],
                "admin_credentials": {
                    "phone": "0773404760",
                    "password": "Ashruha@123%"
                }
            })
        elif path == '/':
            self.send_json_response({
                "message": "GGWIFI Backend is running! 🚀",
                "status": "success",
                "version": "1.0.0",
                "timestamp": int(time.time() * 1000),
                "endpoints": {
                    "health": "/api/v1/health",
                    "dashboard": "/api/v1/dashboard",
                    "routers": "/api/v1/routers",
                    "customers": "/api/v1/customers",
                    "packages": "/api/v1/packages",
                    "login": "/api/v1/auth/login",
                    "seeder": "/api/v1/seed"
                }
            })
        else:
            self.send_error(404, "Not Found")
    
    def do_POST(self):
        self.send_cors_headers()
        
        if self.path == '/api/v1/auth/login':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                phone_number = data.get('phoneNumber', '').strip()
                password = data.get('password', '').strip()
                
                # Admin credentials
                ADMIN_PHONE = "0773404760"
                ADMIN_PASSWORD = "Ashruha@123%"
                
                # Check admin credentials
                if phone_number == ADMIN_PHONE and password == ADMIN_PASSWORD:
                    self.send_json_response({
                        "success": True,
                        "token": "admin-jwt-token-ggwifi-2024",
                        "refreshToken": "admin-refresh-token-ggwifi-2024",
                        "user": {
                            "id": 1,
                            "fullName": "GGWIFI Admin",
                            "phoneNumber": ADMIN_PHONE,
                            "role": "ADMIN",
                            "permissions": ["dashboard", "routers", "customers", "packages", "finance", "settings"]
                        },
                        "message": "Admin login successful"
                    })
                # Mock authentication for other users
                elif phone_number and password:
                    self.send_json_response({
                        "success": True,
                        "token": "user-jwt-token-12345",
                        "refreshToken": "user-refresh-token-67890",
                        "user": {
                            "id": 2,
                            "fullName": "Regular User",
                            "phoneNumber": phone_number,
                            "role": "USER"
                        },
                        "message": "Login successful"
                    })
                else:
                    self.send_json_response({
                        "success": False,
                        "error": "Phone number and password are required"
                    }, 400)
            except json.JSONDecodeError:
                self.send_json_response({
                    "success": False,
                    "error": "Invalid JSON format"
                }, 400)
        else:
            self.send_error(404, "Not Found")
    
    def do_OPTIONS(self):
        self.send_cors_headers()
        self.end_headers()
    
    def send_cors_headers(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Access-Control-Max-Age', '3600')
    
    def send_json_response(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        response = json.dumps(data, indent=2)
        self.wfile.write(response.encode('utf-8'))
    
    def log_message(self, format, *args):
        # Custom log format
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {format % args}")

def run_server(port=8080):
    server_address = ('', port)
    httpd = HTTPServer(server_address, GGWIFIHandler)
    print(f"🚀 GGWIFI Backend Server starting on port {port}")
    print(f"📡 Health check: http://localhost:{port}/api/v1/health")
    print(f"📊 Dashboard: http://localhost:{port}/api/v1/dashboard")
    print(f"🔌 Routers: http://localhost:{port}/api/v1/routers")
    print(f"👥 Customers: http://localhost:{port}/api/v1/customers")
    print(f"📦 Packages: http://localhost:{port}/api/v1/packages")
    print(f"🔐 Login: POST http://localhost:{port}/api/v1/auth/login")
    print("=" * 60)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
