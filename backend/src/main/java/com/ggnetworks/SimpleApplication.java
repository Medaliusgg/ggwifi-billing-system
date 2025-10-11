package com.ggnetworks;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
@RestController
@CrossOrigin(origins = "*")
public class SimpleApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(SimpleApplication.class, args);
    }
    
        @GetMapping("/test")
        public ResponseEntity<Map<String, Object>> test() {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Spring Boot is running! - Complete CI/CD Test " + System.currentTimeMillis());
            response.put("timestamp", System.currentTimeMillis());
            response.put("deployment", "GitHub Actions CI/CD - FULLY CONFIGURED");
            response.put("status", "PRODUCTION READY");
            return ResponseEntity.ok(response);
        }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "GGNetworks Backend");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        Map<String, Object> response = new HashMap<>();
        
        String phoneNumber = loginRequest.get("phoneNumber");
        String password = loginRequest.get("password");
        
        // Real admin authentication
        if ("0773404760".equals(phoneNumber) && "Ashruha@123%".equals(password)) {
            response.put("success", true);
            response.put("message", "Login successful!");
            response.put("token", "mock-jwt-token-12345");
            response.put("user", Map.of(
                "id", 1,
                "phoneNumber", phoneNumber,
                "username", phoneNumber,
                "role", "ADMIN",
                "name", "Admin User"
            ));
            response.put("refreshToken", "mock-refresh-token-67890");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("error", "Invalid phone number or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
    
    @GetMapping("/packages")
    public ResponseEntity<Map<String, Object>> getPackages() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("data", java.util.List.of(
            Map.of("id", 1, "name", "Basic Plan", "price", 10000),
            Map.of("id", 2, "name", "Premium Plan", "price", 20000),
            Map.of("id", 3, "name", "Enterprise Plan", "price", 50000)
        ));
        return ResponseEntity.ok(response);
    }
}
