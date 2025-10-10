import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GeneratePassword {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "#Kolombo@123%";
        String hashedPassword = encoder.encode(password);
        System.out.println("Original password: " + password);
        System.out.println("BCrypt hash: " + hashedPassword);
        
        // Test if the hash matches
        boolean matches = encoder.matches(password, hashedPassword);
        System.out.println("Password matches: " + matches);
    }
} 