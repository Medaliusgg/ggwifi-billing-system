package com.ggnetworks.controller;

import com.ggnetworks.entity.*;
import com.ggnetworks.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
@Tag(name = "Public Portal", description = "Public portal endpoints for GGNetworks main website")
public class PublicController {

    private final PackageService packageService;
    private final PromotionService promotionService;
    private final BlogPostService blogPostService;
    private final ContactMessageService contactMessageService;
    private final FeedbackService feedbackService;
    private final InternetApplicationFormService applicationFormService;
    private final UserService userService;
    private final OtpService otpService;
    private final LocationService locationService;

    // ==================== COMPANY INFORMATION ====================

    @GetMapping("/company-info")
    @Operation(summary = "Get company information", description = "Get general company information")
    public ResponseEntity<Map<String, Object>> getCompanyInfo() {
        try {
            Map<String, Object> companyInfo = new HashMap<>();
            companyInfo.put("name", "GGWIFI");
            companyInfo.put("description", "Leading Internet Service Provider in Tanzania");
            companyInfo.put("services", List.of("PPPoE Internet", "Hotspot Services", "Static IP", "Business Solutions"));
            companyInfo.put("coverage", "Dar es Salaam, Arusha, Mwanza, and expanding");
            companyInfo.put("contact", Map.of(
                "phone", "+255 676 591 880",
                "email", "info@ggwifi.co.tz",
                "address", "Dar es Salaam, Tanzania"
            ));
            
            return ResponseEntity.ok(companyInfo);
        } catch (Exception e) {
            log.error("Failed to get company info", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to retrieve company information"));
        }
    }

    // ==================== PACKAGES ====================

    @GetMapping("/packages")
    @Operation(summary = "Get all packages", description = "Get all available packages for both PPPoE and Hotspot")
    public ResponseEntity<Map<String, Object>> getAllPackages() {
        try {
            List<com.ggnetworks.entity.Package> hotspotPackages = packageService.getPackagesByType(com.ggnetworks.entity.Package.PackageType.HOTSPOT);
            List<com.ggnetworks.entity.Package> pppoePackages = packageService.getPackagesByType(com.ggnetworks.entity.Package.PackageType.PPPOE);

            Map<String, Object> response = new HashMap<>();
            response.put("hotspotPackages", hotspotPackages);
            response.put("pppoePackages", pppoePackages);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get packages", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to retrieve packages"));
        }
    }

    @GetMapping("/packages/{type}")
    @Operation(summary = "Get packages by type", description = "Get packages filtered by type (HOTSPOT or PPPOE)")
    public ResponseEntity<List<com.ggnetworks.entity.Package>> getPackagesByType(@PathVariable String type) {
        try {
            com.ggnetworks.entity.Package.PackageType packageType = com.ggnetworks.entity.Package.PackageType.valueOf(type.toUpperCase());
            List<com.ggnetworks.entity.Package> packages = packageService.getPackagesByType(packageType);
            return ResponseEntity.ok(packages);
        } catch (Exception e) {
            log.error("Failed to get packages by type", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/packages/active")
    @Operation(summary = "Get active packages", description = "Get all active packages for customer portal")
    public ResponseEntity<List<com.ggnetworks.entity.Package>> getActivePackages() {
        try {
            List<com.ggnetworks.entity.Package> packages = packageService.getActivePackages();
            return ResponseEntity.ok(packages);
        } catch (Exception e) {
            log.error("Failed to get active packages", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== PROMOTIONS ====================

    @GetMapping("/promotions")
    @Operation(summary = "Get active promotions", description = "Get all active promotions")
    public ResponseEntity<List<Promotion>> getActivePromotions() {
        try {
            List<Promotion> promotions = promotionService.getActivePromotions();
            return ResponseEntity.ok(promotions);
        } catch (Exception e) {
            log.error("Failed to get promotions", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== BLOG POSTS ====================

    @GetMapping("/blog")
    @Operation(summary = "Get blog posts", description = "Get published blog posts with pagination")
    public ResponseEntity<Map<String, Object>> getBlogPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<BlogPost> blogPosts = blogPostService.getPublishedBlogPosts(pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("blogPosts", blogPosts.getContent());
            response.put("totalElements", blogPosts.getTotalElements());
            response.put("totalPages", blogPosts.getTotalPages());
            response.put("currentPage", blogPosts.getNumber());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get blog posts", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to retrieve blog posts"));
        }
    }

    @GetMapping("/blog/{postId}")
    @Operation(summary = "Get blog post by ID", description = "Get a specific blog post by ID")
    public ResponseEntity<BlogPost> getBlogPost(@PathVariable Long postId) {
        try {
            BlogPost blogPost = blogPostService.getBlogPostById(postId);
            if (blogPost != null && blogPost.getIsPublished()) {
                return ResponseEntity.ok(blogPost);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Failed to get blog post", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==================== CONTACT & FEEDBACK ====================

    @PostMapping("/contact")
    @Operation(summary = "Submit contact message", description = "Submit a contact message")
    public ResponseEntity<Map<String, Object>> submitContactMessage(@RequestBody ContactMessage contactMessage) {
        try {
            ContactMessage savedMessage = contactMessageService.createContactMessage(contactMessage);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Contact message submitted successfully");
            response.put("id", savedMessage.getId());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to submit contact message", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to submit contact message"));
        }
    }

    @PostMapping("/feedback")
    @Operation(summary = "Submit feedback", description = "Submit customer feedback")
    public ResponseEntity<Map<String, Object>> submitFeedback(@RequestBody Feedback feedback) {
        try {
            Feedback savedFeedback = feedbackService.createFeedback(feedback);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Feedback submitted successfully");
            response.put("id", savedFeedback.getId());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to submit feedback", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to submit feedback"));
        }
    }

    // ==================== APPLICATION FORMS ====================

    @PostMapping("/application")
    @Operation(summary = "Submit application form", description = "Submit internet application form")
    public ResponseEntity<Map<String, Object>> submitApplicationForm(@RequestBody InternetApplicationForm applicationForm) {
        try {
            InternetApplicationForm savedForm = applicationFormService.createApplicationForm(applicationForm);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Application submitted successfully");
            response.put("applicationId", savedForm.getId());
            response.put("status", savedForm.getStatus());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to submit application form", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to submit application form"));
        }
    }

    @GetMapping("/application/{applicationId}/status")
    @Operation(summary = "Get application status", description = "Get the status of an application form")
    public ResponseEntity<Map<String, Object>> getApplicationStatus(@PathVariable Long applicationId) {
        try {
            InternetApplicationForm application = applicationFormService.getApplicationFormById(applicationId);
            if (application == null) {
                return ResponseEntity.notFound().build();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("applicationId", application.getId());
            response.put("status", application.getStatus());
            response.put("submittedAt", application.getCreatedAt());
            response.put("estimatedCost", application.getEstimatedCost());
            response.put("adminNotes", application.getAdminNotes());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to get application status", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to retrieve application status"));
        }
    }

    // ==================== OTP FOR PUBLIC REGISTRATION ====================

    @PostMapping("/otp/generate")
    @Operation(summary = "Generate OTP for registration", description = "Generate OTP for user registration")
    public ResponseEntity<Map<String, Object>> generateRegistrationOtp(@RequestBody Map<String, String> request) {
        try {
            String phoneNumber = request.get("phoneNumber");
            if (phoneNumber == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Phone number is required"));
            }

            // Check if user already exists
            if (userService.getUserByPhoneNumber(phoneNumber) != null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "User with this phone number already exists"));
            }

            Otp otp = otpService.generateOtp(phoneNumber, Otp.OtpType.REGISTRATION);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "OTP generated successfully");
            response.put("phoneNumber", phoneNumber);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to generate registration OTP", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to generate OTP"));
        }
    }

    @PostMapping("/otp/validate")
    @Operation(summary = "Validate OTP for registration", description = "Validate OTP for user registration")
    public ResponseEntity<Map<String, Object>> validateRegistrationOtp(@RequestBody Map<String, String> request) {
        try {
            String phoneNumber = request.get("phoneNumber");
            String otpCode = request.get("otpCode");

            if (phoneNumber == null || otpCode == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Phone number and OTP code are required"));
            }

            boolean isValid = otpService.validateOtp(phoneNumber, otpCode, Otp.OtpType.REGISTRATION);

            if (isValid) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "OTP validated successfully");
                response.put("phoneNumber", phoneNumber);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid OTP code"));
            }
        } catch (Exception e) {
            log.error("Failed to validate registration OTP", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to validate OTP"));
        }
    }

    // ==================== COVERAGE AREAS ====================

    @GetMapping("/coverage-areas")
    @Operation(summary = "Get all coverage areas", description = "Get all active coverage areas")
    public ResponseEntity<List<Location>> getAllCoverageAreas() {
        try {
            List<Location> locations = locationService.getActiveLocations();
            return ResponseEntity.ok(locations);
        } catch (Exception e) {
            log.error("Failed to get coverage areas", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/coverage-areas/city/{city}")
    @Operation(summary = "Get coverage areas by city", description = "Get coverage areas filtered by city")
    public ResponseEntity<List<Location>> getCoverageAreasByCity(@PathVariable String city) {
        try {
            List<Location> locations = locationService.getLocationsByCity(city);
            return ResponseEntity.ok(locations);
        } catch (Exception e) {
            log.error("Failed to get coverage areas by city", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/coverage-areas/{id}")
    @Operation(summary = "Get coverage area by ID", description = "Get a specific coverage area by ID")
    public ResponseEntity<Location> getCoverageAreaById(@PathVariable Long id) {
        try {
            Location location = locationService.getLocationById(id);
            if (location != null) {
                return ResponseEntity.ok(location);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Failed to get coverage area by ID", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/coverage-areas/check")
    @Operation(summary = "Check coverage availability", description = "Check if a location has coverage")
    public ResponseEntity<Map<String, Object>> checkCoverageAvailability(@RequestBody Map<String, String> request) {
        try {
            String location = request.get("location");
            boolean hasCoverage = locationService.checkCoverageAvailability(location);
            
            Map<String, Object> response = new HashMap<>();
            response.put("hasCoverage", hasCoverage);
            response.put("location", location);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to check coverage availability", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to check coverage availability"));
        }
    }
} 