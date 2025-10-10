import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.*;

@SpringBootApplication
@RestController
public class SimpleSpringBootApp {

    public static void main(String[] args) {
        SpringApplication.run(SimpleSpringBootApp.class, args);
    }

    @GetMapping("/api/v1/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "GGWIFI Spring Boot Backend");
        response.put("version", "1.0.0");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/v1/auth/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        Map<String, Object> response = new HashMap<>();
        
        String phoneNumber = credentials.get("phoneNumber");
        String password = credentials.get("password");
        
        // Simple authentication for now
        if ("0773404760".equals(phoneNumber) && "Ashruha@123%".equals(password)) {
            response.put("success", true);
            response.put("token", "spring-boot-jwt-token-" + System.currentTimeMillis());
            response.put("refreshToken", "spring-boot-refresh-token-" + System.currentTimeMillis());
            
            Map<String, Object> user = new HashMap<>();
            user.put("id", 1);
            user.put("fullName", "GGWIFI Admin");
            user.put("phoneNumber", phoneNumber);
            user.put("role", "ADMIN");
            user.put("permissions", Arrays.asList("dashboard", "routers", "customers", "packages", "finance", "settings"));
            
            response.put("user", user);
            response.put("message", "Login successful");
            
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("error", "Invalid credentials");
            response.put("message", "Login failed. Please check your credentials and try again.");
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/api/v1/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard() {
        Map<String, Object> response = new HashMap<>();
        response.put("totalCustomers", 1250);
        response.put("activeRouters", 8);
        response.put("todaysRevenue", 450000);
        response.put("activeSessions", 342);
        response.put("status", "success");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome to GGWIFI Spring Boot Backend!");
        response.put("version", "1.0.0");
        response.put("status", "running");
        return ResponseEntity.ok(response);
    }
}
