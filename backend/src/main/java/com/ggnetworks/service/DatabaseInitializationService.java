package com.ggnetworks.service;

import com.ggnetworks.entity.User;
import com.ggnetworks.entity.InternetPackage;
import com.ggnetworks.repository.UserRepository;
import com.ggnetworks.repository.InternetPackageRepository;
import com.ggnetworks.service.FreeRadiusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class DatabaseInitializationService implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InternetPackageRepository packageRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FreeRadiusService freeRadiusService;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🚀 Initializing GGNetworks Database...");
        
        // Check RADIUS tables
        if (freeRadiusService.checkRadiusTables()) {
            System.out.println("✅ FreeRADIUS tables found and accessible");
        } else {
            System.out.println("⚠️ FreeRADIUS tables not found - please ensure RADIUS database is set up");
        }

        // Create admin user if not exists
        createAdminUser();
        
        // Create default packages
        createDefaultPackages();
        
        System.out.println("✅ Database initialization completed!");
    }

    private void createAdminUser() {
        try {
            // Check if admin user already exists
            if (userRepository.findByUsername("admin").isPresent()) {
                System.out.println("✅ Admin user already exists");
                return;
            }

            // Create admin user
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setEmail("admin@ggwifi.co.tz");
            admin.setRole(User.UserRole.ADMIN);
            admin.setIsActive(true);
            admin.setIsEmailVerified(true);
            admin.setIsPhoneVerified(true);
            admin.setStatus(User.UserStatus.ACTIVE);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());

            userRepository.save(admin);
            System.out.println("✅ Admin user created successfully");
            
        } catch (Exception e) {
            System.err.println("❌ Error creating admin user: " + e.getMessage());
        }
    }

    private void createDefaultPackages() {
        try {
            // Check if packages already exist
            if (packageRepository.count() > 0) {
                System.out.println("✅ Default packages already exist");
                return;
            }

            // Create Universal Daily Package
            InternetPackage universalDaily = new InternetPackage();
            universalDaily.setName("Universal Daily");
            universalDaily.setDescription("Our standard daily package - available anytime!");
            universalDaily.setPackageType(InternetPackage.PackageType.HOTSPOT);
            universalDaily.setPrice(new BigDecimal("2000.00"));
            universalDaily.setDurationDays(1);
            universalDaily.setDataLimitMb(1024L);
            universalDaily.setIsUnlimitedData(false);
            universalDaily.setUploadSpeedMbps(3);
            universalDaily.setDownloadSpeedMbps(5);
            universalDaily.setIsActive(true);
            universalDaily.setIsPopular(false);
            universalDaily.setIsFeatured(false);
            universalDaily.setCategory(InternetPackage.PackageCategory.BASIC);
            universalDaily.setStatus(InternetPackage.PackageStatus.ACTIVE);
            universalDaily.setTargetAudience(InternetPackage.TargetAudience.ALL);
            universalDaily.setBillingCycle(InternetPackage.BillingCycle.DAILY);
            universalDaily.setSpeedTier(InternetPackage.SpeedTier.STANDARD);
            packageRepository.save(universalDaily);

            // Create Premium Monthly Package
            InternetPackage premiumMonthly = new InternetPackage();
            premiumMonthly.setName("Premium Monthly");
            premiumMonthly.setDescription("High-speed monthly package for heavy users");
            premiumMonthly.setPackageType(InternetPackage.PackageType.PREMIUM);
            premiumMonthly.setPrice(new BigDecimal("25000.00"));
            premiumMonthly.setDurationDays(30);
            premiumMonthly.setDataLimitMb(10240L);
            premiumMonthly.setIsUnlimitedData(false);
            premiumMonthly.setUploadSpeedMbps(10);
            premiumMonthly.setDownloadSpeedMbps(20);
            premiumMonthly.setIsActive(true);
            premiumMonthly.setIsPopular(true);
            premiumMonthly.setIsFeatured(true);
            premiumMonthly.setCategory(InternetPackage.PackageCategory.PREMIUM);
            premiumMonthly.setStatus(InternetPackage.PackageStatus.ACTIVE);
            premiumMonthly.setTargetAudience(InternetPackage.TargetAudience.INDIVIDUAL);
            premiumMonthly.setBillingCycle(InternetPackage.BillingCycle.MONTHLY);
            premiumMonthly.setSpeedTier(InternetPackage.SpeedTier.HIGH);
            packageRepository.save(premiumMonthly);

            // Create Student Package
            InternetPackage studentPackage = new InternetPackage();
            studentPackage.setName("Student Special");
            studentPackage.setDescription("Affordable package designed for students");
            studentPackage.setPackageType(InternetPackage.PackageType.STUDENT);
            studentPackage.setPrice(new BigDecimal("15000.00"));
            studentPackage.setDurationDays(30);
            studentPackage.setDataLimitMb(5120L);
            studentPackage.setIsUnlimitedData(false);
            studentPackage.setUploadSpeedMbps(5);
            studentPackage.setDownloadSpeedMbps(10);
            studentPackage.setIsActive(true);
            studentPackage.setIsPopular(true);
            studentPackage.setIsFeatured(false);
            studentPackage.setCategory(InternetPackage.PackageCategory.STUDENT);
            studentPackage.setStatus(InternetPackage.PackageStatus.ACTIVE);
            studentPackage.setTargetAudience(InternetPackage.TargetAudience.STUDENT);
            studentPackage.setBillingCycle(InternetPackage.BillingCycle.MONTHLY);
            studentPackage.setSpeedTier(InternetPackage.SpeedTier.STANDARD);
            packageRepository.save(studentPackage);

            System.out.println("✅ Created 3 default packages:");
            System.out.println("   - Universal Daily (TZS 2,000)");
            System.out.println("   - Premium Monthly (TZS 25,000)");
            System.out.println("   - Student Special (TZS 15,000)");
            
        } catch (Exception e) {
            System.err.println("❌ Error creating default packages: " + e.getMessage());
        }
    }
}