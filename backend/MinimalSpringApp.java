import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.*;

@SpringBootApplication
@RestController
@CrossOrigin(origins = "*")
public class MinimalSpringApp {

    public static void main(String[] args) {
        SpringApplication.run(MinimalSpringApp.class, args);
    }

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "GGWIFI Spring Boot Backend is running! 🚀");
        response.put("status", "success");
        response.put("version", "1.0.0");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
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

    @GetMapping("/api/v1/routers")
    public ResponseEntity<Map<String, Object>> routers() {
        List<Map<String, Object>> routerList = new ArrayList<>();
        
        Map<String, Object> router1 = new HashMap<>();
        router1.put("id", 1);
        router1.put("name", "Main Router");
        router1.put("ipAddress", "192.168.1.1");
        router1.put("status", "ONLINE");
        router1.put("location", "Main Office");
        router1.put("cpuUsagePercent", 45);
        router1.put("memoryUsagePercent", 62);
        router1.put("activeConnections", 25);
        routerList.add(router1);

        Map<String, Object> response = new HashMap<>();
        response.put("routers", routerList);
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/v1/customers")
    public ResponseEntity<Map<String, Object>> customers() {
        List<Map<String, Object>> customerList = new ArrayList<>();
        
        Map<String, Object> customer1 = new HashMap<>();
        customer1.put("id", 1);
        customer1.put("fullName", "John Doe");
        customer1.put("phoneNumber", "+255123456789");
        customer1.put("userType", "HOTSPOT_USER");
        customer1.put("active", true);
        customer1.put("createdAt", "2024-01-15T10:30:00Z");
        customerList.add(customer1);

        Map<String, Object> response = new HashMap<>();
        response.put("customers", customerList);
        response.put("total", 1250);
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/v1/packages")
    public ResponseEntity<Map<String, Object>> packages() {
        List<Map<String, Object>> packageList = new ArrayList<>();
        
        Map<String, Object> package1 = new HashMap<>();
        package1.put("id", 1);
        package1.put("name", "Basic Plan");
        package1.put("description", "Basic internet package");
        package1.put("price", 25000);
        package1.put("durationDays", 30);
        package1.put("type", "HOTSPOT");
        package1.put("active", true);
        packageList.add(package1);

        Map<String, Object> response = new HashMap<>();
        response.put("packages", packageList);
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/v1/auth/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        String phoneNumber = loginRequest.get("phoneNumber");
        String password = loginRequest.get("password");

        // Admin credentials
        String ADMIN_PHONE = "0773404760";
        String ADMIN_PASSWORD = "Ashruha@123%";

        Map<String, Object> response = new HashMap<>();

        if (ADMIN_PHONE.equals(phoneNumber) && ADMIN_PASSWORD.equals(password)) {
            // Admin login
            Map<String, Object> user = new HashMap<>();
            user.put("id", 1);
            user.put("fullName", "GGWIFI Admin");
            user.put("phoneNumber", ADMIN_PHONE);
            user.put("role", "ADMIN");
            user.put("permissions", Arrays.asList("dashboard", "routers", "customers", "packages", "finance", "settings"));

            response.put("success", true);
            response.put("token", "spring-boot-admin-jwt-token-2024");
            response.put("refreshToken", "spring-boot-admin-refresh-token-2024");
            response.put("user", user);
            response.put("message", "Admin login successful");

            return ResponseEntity.ok(response);
        } else if (phoneNumber != null && password != null) {
            // Regular user login
            Map<String, Object> user = new HashMap<>();
            user.put("id", 2);
            user.put("fullName", "Regular User");
            user.put("phoneNumber", phoneNumber);
            user.put("role", "USER");

            response.put("success", true);
            response.put("token", "spring-boot-user-jwt-token-2024");
            response.put("refreshToken", "spring-boot-user-refresh-token-2024");
            user.put("user", user);
            response.put("message", "Login successful");

            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("error", "Phone number and password are required");
            return ResponseEntity.badRequest().body(response);
        }
    }
}
