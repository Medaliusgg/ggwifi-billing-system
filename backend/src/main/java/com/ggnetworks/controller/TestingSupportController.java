package com.ggnetworks.controller;

import com.ggnetworks.entity.MediaCampaign;
import com.ggnetworks.entity.User;
import com.ggnetworks.repository.CustomerOTPRepository;
import com.ggnetworks.repository.MediaCampaignRepository;
import com.ggnetworks.repository.UserRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/testing")
public class TestingSupportController {

    private final CustomerOTPRepository customerOTPRepository;
    private final MediaCampaignRepository mediaCampaignRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public TestingSupportController(
            CustomerOTPRepository customerOTPRepository,
            MediaCampaignRepository mediaCampaignRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.customerOTPRepository = customerOTPRepository;
        this.mediaCampaignRepository = mediaCampaignRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/reset-otps")
    public ResponseEntity<Map<String, Object>> resetOtps() {
        customerOTPRepository.deleteAll();
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Customer OTP records cleared"));
    }

    @PostMapping("/seed-media-campaign")
    public ResponseEntity<Map<String, Object>> seedMediaCampaign() {
        // Clear existing test campaigns
        mediaCampaignRepository.deleteAll();

        // Create a test media campaign for portal
        MediaCampaign campaign = new MediaCampaign();
        campaign.setCampaignId("MEDIA-TEST");
        campaign.setTitle("Test Portal Promo");
        campaign.setMediaType(MediaCampaign.MediaType.VIDEO);
        campaign.setFileUrl("https://cdn.ggnetworks.com/test/promo.mp4");
        campaign.setDurationSeconds(6);
        campaign.setPriority(5);
        campaign.setSkipAllowed(true);
        campaign.setActive(true);
        campaign.setCreatedBy("testing");
        campaign.setImpressionsCount(0L);
        campaign.setUniqueViewers(0L);

        MediaCampaign saved = mediaCampaignRepository.save(campaign);

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Media campaign seeded",
            "campaignId", saved.getCampaignId()));
    }

    @PostMapping("/create-admin-user")
    public ResponseEntity<Map<String, Object>> createAdminUser() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check if test admin already exists
            String testUsername = "testadmin";
            if (userRepository.findByUsername(testUsername).isPresent()) {
                response.put("status", "success");
                response.put("message", "Test admin user already exists");
                response.put("username", testUsername);
                response.put("password", "testadmin123");
                response.put("role", "SUPER_ADMIN");
                return ResponseEntity.ok(response);
            }

            // Create test admin user
            User admin = new User();
            admin.setUsername(testUsername);
            admin.setEmail("testadmin@ggwifi.co.tz");
            admin.setPassword(passwordEncoder.encode("testadmin123"));
            admin.setFirstName("Test");
            admin.setLastName("Administrator");
            admin.setPhoneNumber("+255742844024");
            admin.setRole(User.UserRole.SUPER_ADMIN);
            admin.setIsActive(true);
            admin.setIsEmailVerified(true);
            admin.setIsPhoneVerified(true);
            admin.setStatus(User.UserStatus.ACTIVE);
            admin.setDepartment("Testing");
            admin.setPosition("Test Admin");
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());

            User saved = userRepository.save(admin);

            response.put("status", "success");
            response.put("message", "Test admin user created successfully");
            response.put("username", testUsername);
            response.put("password", "testadmin123");
            response.put("email", admin.getEmail());
            response.put("role", admin.getRole().name());
            response.put("userId", saved.getId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to create admin user: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/reset-admin")
    public ResponseEntity<Map<String, Object>> resetAdminUser() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Delete all existing admin and super_admin users
            java.util.List<User> adminUsers = userRepository.findAll().stream()
                .filter(user -> user.getRole() == User.UserRole.ADMIN || 
                               user.getRole() == User.UserRole.SUPER_ADMIN)
                .collect(java.util.stream.Collectors.toList());
            userRepository.deleteAll(adminUsers);
            
            // Create new admin user with specified credentials
            User admin = new User();
            admin.setUsername("medalius");
            admin.setPhoneNumber("0742844024");
            admin.setPassword(passwordEncoder.encode("Kolombo@123%"));
            admin.setFirstName("Medalius");
            admin.setLastName("Administrator");
            admin.setEmail("medalius@ggwifi.co.tz");
            admin.setRole(User.UserRole.SUPER_ADMIN);
            admin.setIsActive(true);
            admin.setIsEmailVerified(true);
            admin.setIsPhoneVerified(true);
            admin.setStatus(User.UserStatus.ACTIVE);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());

            User saved = userRepository.save(admin);

            response.put("status", "success");
            response.put("message", "Admin user reset successfully");
            response.put("username", "medalius");
            response.put("phoneNumber", "0742844024");
            response.put("role", "SUPER_ADMIN");
            response.put("userId", saved.getId());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to reset admin user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(response);
        }
    }
}

