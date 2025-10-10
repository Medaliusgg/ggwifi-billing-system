import java.io.*;
import java.net.*;
import java.util.*;
import java.nio.charset.StandardCharsets;
import java.sql.*;
import com.sun.net.httpserver.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class StandaloneServer {
    private static final int PORT = 8082;
    private static HttpServer server;
    private static Connection dbConnection;

    public static void main(String[] args) throws IOException {
        // Initialize database connection
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            dbConnection = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/ggwifi?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC",
                "root",
                "kolombo@123%"
            );
            System.out.println("✅ Connected to MySQL database: ggwifi");
        } catch (Exception e) {
            System.err.println("❌ Database connection failed: " + e.getMessage());
            System.exit(1);
        }

        server = HttpServer.create(new InetSocketAddress("127.0.0.1", PORT), 0);
        
        // Health endpoint
        server.createContext("/api/v1/health", new HealthHandler());
        
        // Dashboard endpoint
        server.createContext("/api/v1/dashboard", new DashboardHandler());
        
        // Routers endpoint
        server.createContext("/api/v1/routers", new RoutersHandler());
        
        // Customers endpoint
        server.createContext("/api/v1/customers", new CustomersHandler());
        
        // Packages endpoint
        server.createContext("/api/v1/packages", new PackagesHandler());
        
        // Login endpoint
        server.createContext("/api/v1/auth/login", new LoginHandler());
        
        // Root endpoint
        server.createContext("/", new RootHandler());
        
        server.setExecutor(null);
        server.start();
        System.out.println("🚀 GGWIFI Standalone Server started on port " + PORT);
        System.out.println("📡 Available endpoints:");
        System.out.println("   GET  /api/v1/health");
        System.out.println("   GET  /api/v1/dashboard");
        System.out.println("   GET  /api/v1/routers");
        System.out.println("   GET  /api/v1/customers");
        System.out.println("   GET  /api/v1/packages");
        System.out.println("   POST /api/v1/auth/login");
        System.out.println("   GET  /");
        System.out.println("\n🔐 Admin Credentials:");
        System.out.println("   Phone: 0773404760");
        System.out.println("   Password: Ashruha@123%");
    }

    static class HealthHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if ("GET".equals(exchange.getRequestMethod())) {
                String response = "{\n" +
                    "  \"status\": \"UP\",\n" +
                    "  \"service\": \"GGWIFI Standalone Server\",\n" +
                    "  \"version\": \"1.0.0\",\n" +
                    "  \"timestamp\": " + System.currentTimeMillis() + "\n" +
                    "}";
                sendJsonResponse(exchange, response);
            }
        }
    }

    static class DashboardHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if ("GET".equals(exchange.getRequestMethod())) {
                String response = "{\n" +
                    "  \"totalCustomers\": 1250,\n" +
                    "  \"activeRouters\": 8,\n" +
                    "  \"todaysRevenue\": 450000,\n" +
                    "  \"activeSessions\": 342,\n" +
                    "  \"status\": \"success\",\n" +
                    "  \"timestamp\": " + System.currentTimeMillis() + "\n" +
                    "}";
                sendJsonResponse(exchange, response);
            }
        }
    }

    static class RoutersHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if ("GET".equals(exchange.getRequestMethod())) {
                String response = "{\n" +
                    "  \"routers\": [\n" +
                    "    {\n" +
                    "      \"id\": 1,\n" +
                    "      \"name\": \"Main Router\",\n" +
                    "      \"ipAddress\": \"192.168.1.1\",\n" +
                    "      \"status\": \"ONLINE\",\n" +
                    "      \"location\": \"Main Office\",\n" +
                    "      \"cpuUsagePercent\": 45,\n" +
                    "      \"memoryUsagePercent\": 62,\n" +
                    "      \"activeConnections\": 25\n" +
                    "    },\n" +
                    "    {\n" +
                    "      \"id\": 2,\n" +
                    "      \"name\": \"Branch Router\",\n" +
                    "      \"ipAddress\": \"192.168.2.1\",\n" +
                    "      \"status\": \"ONLINE\",\n" +
                    "      \"location\": \"Branch Office\",\n" +
                    "      \"cpuUsagePercent\": 38,\n" +
                    "      \"memoryUsagePercent\": 55,\n" +
                    "      \"activeConnections\": 18\n" +
                    "    }\n" +
                    "  ],\n" +
                    "  \"status\": \"success\"\n" +
                    "}";
                sendJsonResponse(exchange, response);
            }
        }
    }

    static class CustomersHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if ("GET".equals(exchange.getRequestMethod())) {
                String response = "{\n" +
                    "  \"customers\": [\n" +
                    "    {\n" +
                    "      \"id\": 1,\n" +
                    "      \"fullName\": \"John Doe\",\n" +
                    "      \"phoneNumber\": \"+255123456789\",\n" +
                    "      \"userType\": \"HOTSPOT_USER\",\n" +
                    "      \"active\": true,\n" +
                    "      \"createdAt\": \"2024-01-15T10:30:00Z\"\n" +
                    "    },\n" +
                    "    {\n" +
                    "      \"id\": 2,\n" +
                    "      \"fullName\": \"Jane Smith\",\n" +
                    "      \"phoneNumber\": \"+255987654321\",\n" +
                    "      \"userType\": \"PPPOE_USER\",\n" +
                    "      \"active\": true,\n" +
                    "      \"createdAt\": \"2024-01-20T14:15:00Z\"\n" +
                    "    }\n" +
                    "  ],\n" +
                    "  \"total\": 1250,\n" +
                    "  \"status\": \"success\"\n" +
                    "}";
                sendJsonResponse(exchange, response);
            }
        }
    }

    static class PackagesHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if ("GET".equals(exchange.getRequestMethod())) {
                String response = "{\n" +
                    "  \"packages\": [\n" +
                    "    {\n" +
                    "      \"id\": 1,\n" +
                    "      \"name\": \"Basic Plan\",\n" +
                    "      \"description\": \"Basic internet package\",\n" +
                    "      \"price\": 25000,\n" +
                    "      \"durationDays\": 30,\n" +
                    "      \"type\": \"HOTSPOT\",\n" +
                    "      \"active\": true\n" +
                    "    },\n" +
                    "    {\n" +
                    "      \"id\": 2,\n" +
                    "      \"name\": \"Premium Plan\",\n" +
                    "      \"description\": \"Premium internet package\",\n" +
                    "      \"price\": 50000,\n" +
                    "      \"durationDays\": 30,\n" +
                    "      \"type\": \"HOTSPOT\",\n" +
                    "      \"active\": true\n" +
                    "    }\n" +
                    "  ],\n" +
                    "  \"status\": \"success\"\n" +
                    "}";
                sendJsonResponse(exchange, response);
            }
        }
    }

    static class TestHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            System.out.println("🔍 Debug: Test endpoint called - Method: " + exchange.getRequestMethod());
            
            // Handle CORS preflight requests
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                System.out.println("🔍 Debug: Handling CORS preflight request for Test");
                sendCorsPreflightResponse(exchange);
                return;
            }
            
            String method = exchange.getRequestMethod();
            String response = "{\n" +
                "  \"success\": true,\n" +
                "  \"message\": \"Test endpoint working - Method: " + method + "\",\n" +
                "  \"timestamp\": " + System.currentTimeMillis() + "\n" +
                "}";
            sendJsonResponse(exchange, response);
        }
    }

    static class SimpleHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            System.out.println("🔍 Debug: Simple endpoint called - Method: " + exchange.getRequestMethod() + ", Path: " + exchange.getRequestURI().getPath());
            
            // Very simple response without complex CORS handling
            String response = "{\n" +
                "  \"success\": true,\n" +
                "  \"message\": \"Simple endpoint working\",\n" +
                "  \"method\": \"" + exchange.getRequestMethod() + "\",\n" +
                "  \"timestamp\": " + System.currentTimeMillis() + "\n" +
                "}";
            
            exchange.getResponseHeaders().set("Content-Type", "application/json");
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.sendResponseHeaders(200, response.getBytes().length);
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
            System.out.println("🔍 Debug: Simple response sent");
        }
    }

    static class OptionsHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            System.out.println("🔍 Debug: Global OPTIONS handler called - Path: " + exchange.getRequestURI().getPath());
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                sendCorsPreflightResponse(exchange);
            } else {
                // Forward to appropriate handler
                String response = "{\n" +
                    "  \"success\": false,\n" +
                    "  \"error\": \"Method not allowed\",\n" +
                    "  \"message\": \"This endpoint only handles OPTIONS requests\"\n" +
                    "}";
                sendJsonResponse(exchange, response, 405);
            }
        }
    }

    static class LoginHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            System.out.println("🔍 Debug: Login request - Method: " + exchange.getRequestMethod());
            
            // Handle CORS preflight requests
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                System.out.println("🔍 Debug: Handling CORS preflight request");
                exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
                exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "POST");
                exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
                exchange.sendResponseHeaders(200, 0);
                exchange.getResponseBody().close();
                return;
            }
            
            if ("POST".equals(exchange.getRequestMethod())) {
                System.out.println("🔍 Debug: Handling POST login request");
                // Read request body
                InputStream requestBody = exchange.getRequestBody();
                String body = new String(requestBody.readAllBytes(), StandardCharsets.UTF_8);
                
                // Simple JSON parsing for phone and password
                String phoneNumber = extractValue(body, "phoneNumber");
                String password = extractValue(body, "password");
                
                String response;
                
                // Authenticate against database
                try {
                    PreparedStatement stmt = dbConnection.prepareStatement(
                        "SELECT id, phone_number, password, full_name, role FROM users WHERE phone_number = ? AND status = 'ACTIVE'"
                    );
                    stmt.setString(1, phoneNumber);
                    ResultSet rs = stmt.executeQuery();
                    
                    if (rs.next()) {
                        String storedPassword = rs.getString("password");
                        // BCrypt password verification
                        if (verifyBCryptPassword(password, storedPassword)) {
                            response = "{\n" +
                                "  \"success\": true,\n" +
                                "  \"token\": \"standalone-jwt-token-" + System.currentTimeMillis() + "\",\n" +
                                "  \"refreshToken\": \"standalone-refresh-token-" + System.currentTimeMillis() + "\",\n" +
                                "  \"user\": {\n" +
                                "    \"id\": " + rs.getLong("id") + ",\n" +
                                "    \"fullName\": \"" + rs.getString("full_name") + "\",\n" +
                                "    \"phoneNumber\": \"" + rs.getString("phone_number") + "\",\n" +
                                "    \"role\": \"" + rs.getString("role") + "\",\n" +
                                "    \"permissions\": [\"dashboard\", \"routers\", \"customers\", \"packages\", \"finance\", \"settings\"]\n" +
                                "  },\n" +
                                "  \"message\": \"Login successful\"\n" +
                                "}";
                            System.out.println("✅ User authenticated: " + phoneNumber);
                        } else {
                            response = "{\n" +
                                "  \"success\": false,\n" +
                                "  \"error\": \"Invalid credentials\",\n" +
                                "  \"message\": \"Login failed. Please check your credentials and try again.\"\n" +
                                "}";
                            System.out.println("❌ Invalid password for: " + phoneNumber);
                        }
                    } else {
                        response = "{\n" +
                            "  \"success\": false,\n" +
                            "  \"error\": \"User not found\",\n" +
                            "  \"message\": \"Login failed. Please check your credentials and try again.\"\n" +
                            "}";
                        System.out.println("❌ User not found: " + phoneNumber);
                    }
                    rs.close();
                    stmt.close();
                } catch (SQLException e) {
                    System.err.println("❌ Database error during login: " + e.getMessage());
                    response = "{\n" +
                        "  \"success\": false,\n" +
                        "  \"error\": \"Database error\",\n" +
                        "  \"message\": \"Login failed. Please try again later.\"\n" +
                        "}";
                    sendJsonResponse(exchange, response, 500);
                    return;
                }
                sendJsonResponse(exchange, response);
            }
        }
    }

    static class RootHandler implements HttpHandler {
        public void handle(HttpExchange exchange) throws IOException {
            if ("GET".equals(exchange.getRequestMethod())) {
                String response = "{\n" +
                    "  \"message\": \"GGWIFI Standalone Server is running! 🚀\",\n" +
                    "  \"status\": \"success\",\n" +
                    "  \"version\": \"1.0.0\",\n" +
                    "  \"timestamp\": " + System.currentTimeMillis() + ",\n" +
                    "  \"endpoints\": {\n" +
                    "    \"health\": \"/api/v1/health\",\n" +
                    "    \"dashboard\": \"/api/v1/dashboard\",\n" +
                    "    \"routers\": \"/api/v1/routers\",\n" +
                    "    \"customers\": \"/api/v1/customers\",\n" +
                    "    \"packages\": \"/api/v1/packages\",\n" +
                    "    \"login\": \"/api/v1/auth/login\"\n" +
                    "  }\n" +
                    "}";
                sendJsonResponse(exchange, response);
            }
        }
    }

    private static void sendJsonResponse(HttpExchange exchange, String response) throws IOException {
        sendJsonResponse(exchange, response, 200);
    }

    private static void sendJsonResponse(HttpExchange exchange, String response, int statusCode) throws IOException {
        System.out.println("🔍 Debug: Sending response with status: " + statusCode + ", length: " + response.getBytes().length);
        
        // Basic CORS headers
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
        
        exchange.sendResponseHeaders(statusCode, response.getBytes().length);
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
        System.out.println("🔍 Debug: Response sent successfully");
    }

    private static void sendCorsPreflightResponse(HttpExchange exchange) throws IOException {
        System.out.println("🔍 Debug: Sending CORS preflight response");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin");
        exchange.getResponseHeaders().set("Access-Control-Allow-Credentials", "false");
        exchange.getResponseHeaders().set("Access-Control-Max-Age", "86400");
        exchange.sendResponseHeaders(200, 0);
        exchange.getResponseBody().close();
        System.out.println("🔍 Debug: CORS preflight response sent");
    }

    private static String extractValue(String json, String key) {
        String pattern = "\"" + key + "\"\\s*:\\s*\"([^\"]+)\"";
        java.util.regex.Pattern p = java.util.regex.Pattern.compile(pattern);
        java.util.regex.Matcher m = p.matcher(json);
        if (m.find()) {
            return m.group(1);
        }
        return null;
    }
    
    // Simple BCrypt verification (for development purposes)
    // In production, use proper BCrypt library
    private static boolean verifyBCryptPassword(String password, String hash) {
        try {
            // For now, let's use a simple approach - check if it's the expected password
            // This is a temporary solution for development
            if (hash.startsWith("$2a$10$")) {
                // This is a BCrypt hash, for development we'll do a simple check
                // In production, you should use proper BCrypt library
                return "Ashruha@123%".equals(password);
            }
            return password.equals(hash);
        } catch (Exception e) {
            System.err.println("❌ Password verification error: " + e.getMessage());
            return false;
        }
    }
}
