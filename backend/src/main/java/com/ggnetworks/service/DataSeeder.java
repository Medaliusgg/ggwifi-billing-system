package com.ggnetworks.service;

import com.ggnetworks.entity.User;
import com.ggnetworks.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if admin user already exists
        if (userRepository.findByUsernameAndDeletedAtIsNull("medaliusgg").isEmpty() &&
            userRepository.findByPhoneNumberAndDeletedAtIsNull("0676591880").isEmpty()) {
            
            // Create admin user
            User adminUser = new User();
            adminUser.setUsername("medaliusgg");
            adminUser.setPhoneNumber("0676591880");
            adminUser.setPassword(passwordEncoder.encode("#Kolombo@123%"));
            adminUser.setFullName("Medalius GG");
            adminUser.setRole(User.UserRole.ADMIN);
            adminUser.setStatus(User.UserStatus.ACTIVE);
            adminUser.setCreatedAt(LocalDateTime.now());
            adminUser.setUpdatedAt(LocalDateTime.now());
            
            userRepository.save(adminUser);
            
            System.out.println("✅ Admin user created successfully!");
            System.out.println("Username: medaliusgg");
            System.out.println("Phone: 0676591880");
            System.out.println("Password: #Kolombo@123%");
        } else {
            System.out.println("ℹ️ Admin user already exists, skipping creation.");
        }
    }
} 