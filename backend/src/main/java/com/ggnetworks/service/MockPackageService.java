package com.ggnetworks.service;

import com.ggnetworks.entity.Package;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Mock Package Service for when backend is disabled
 * Provides sample package data for customer portal
 */
@Slf4j
@Service
public class MockPackageService extends PackageService {

    public MockPackageService() {
        super(null);
    }

    @Override
    public List<Package> getHotspotPackages() {
        log.info("Mock: Fetching hotspot packages");
        return generateMockHotspotPackages();
    }

    @Override
    public Page<Package> getHotspotPackages(Pageable pageable) {
        log.info("Mock: Fetching hotspot packages with pagination");
        List<Package> packages = generateMockHotspotPackages();
        return new org.springframework.data.domain.PageImpl<>(packages, pageable, packages.size());
    }

    @Override
    public List<Package> getPopularHotspotPackages() {
        log.info("Mock: Fetching popular hotspot packages");
        return generateMockPopularPackages();
    }

    @Override
    public Package getPackageById(Long packageId) {
        log.info("Mock: Fetching package details for ID: {}", packageId);
        return generateMockHotspotPackages().stream()
                .filter(pkg -> pkg.getId().equals(packageId))
                .findFirst()
                .orElse(null);
    }

    @Override
    public Map<String, Object> getPackageAnalytics() {
        log.info("Mock: Fetching package analytics");
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalHotspotPackages", 5);
        analytics.put("popularPackages", 2);
        analytics.put("packages", generateMockHotspotPackages());
        return analytics;
    }

    // ==================== MOCK DATA GENERATION ====================

    private List<Package> generateMockHotspotPackages() {
        List<Package> packages = new ArrayList<>();
        
        // Package 1: Basic Plan
        Package basicPlan = new Package();
        basicPlan.setId(1L);
        basicPlan.setName("Basic Plan");
        basicPlan.setType(Package.PackageType.HOTSPOT);
        basicPlan.setPrice(new BigDecimal("5000"));
        basicPlan.setDurationDays(1);
        basicPlan.setBandwidthLimitMb(1024L); // 1GB
        basicPlan.setDescription("Basic internet plan for light usage");
        basicPlan.setIsPopular(false);
        basicPlan.setIsActive(true);
        packages.add(basicPlan);

        // Package 2: Standard Plan
        Package standardPlan = new Package();
        standardPlan.setId(2L);
        standardPlan.setName("Standard Plan");
        standardPlan.setType(Package.PackageType.HOTSPOT);
        standardPlan.setPrice(new BigDecimal("10000"));
        standardPlan.setDurationDays(3);
        standardPlan.setBandwidthLimitMb(5120L); // 5GB
        standardPlan.setDescription("Standard internet plan for regular usage");
        standardPlan.setIsPopular(true);
        standardPlan.setIsActive(true);
        packages.add(standardPlan);

        // Package 3: Premium Plan
        Package premiumPlan = new Package();
        premiumPlan.setId(3L);
        premiumPlan.setName("Premium Plan");
        premiumPlan.setType(Package.PackageType.HOTSPOT);
        premiumPlan.setPrice(new BigDecimal("20000"));
        premiumPlan.setDurationDays(7);
        premiumPlan.setBandwidthLimitMb(15360L); // 15GB
        premiumPlan.setDescription("Premium internet plan for heavy usage");
        premiumPlan.setIsPopular(true);
        premiumPlan.setIsActive(true);
        packages.add(premiumPlan);

        // Package 4: Unlimited Plan
        Package unlimitedPlan = new Package();
        unlimitedPlan.setId(4L);
        unlimitedPlan.setName("Unlimited Plan");
        unlimitedPlan.setType(Package.PackageType.HOTSPOT);
        unlimitedPlan.setPrice(new BigDecimal("30000"));
        unlimitedPlan.setDurationDays(30);
        unlimitedPlan.setBandwidthLimitMb(0L); // Unlimited
        unlimitedPlan.setDescription("Unlimited internet plan for unlimited usage");
        unlimitedPlan.setIsPopular(false);
        unlimitedPlan.setIsActive(true);
        packages.add(unlimitedPlan);

        // Package 5: Student Plan
        Package studentPlan = new Package();
        studentPlan.setId(5L);
        studentPlan.setName("Student Plan");
        studentPlan.setType(Package.PackageType.HOTSPOT);
        studentPlan.setPrice(new BigDecimal("7500"));
        studentPlan.setDurationDays(5);
        studentPlan.setBandwidthLimitMb(3072L); // 3GB
        studentPlan.setDescription("Affordable internet plan for students");
        studentPlan.setIsPopular(false);
        studentPlan.setIsActive(true);
        packages.add(studentPlan);

        return packages;
    }

    private List<Package> generateMockPopularPackages() {
        return generateMockHotspotPackages().stream()
                .filter(Package::getIsPopular)
                .toList();
    }

    @Override
    public boolean isPackageValid(Long packageId) {
        return generateMockHotspotPackages().stream()
                .anyMatch(pkg -> pkg.getId().equals(packageId) && pkg.getIsActive());
    }

    @Override
    public Double getPackagePrice(Long packageId) {
        return generateMockHotspotPackages().stream()
                .filter(pkg -> pkg.getId().equals(packageId))
                .findFirst()
                .map(pkg -> pkg.getPrice().doubleValue())
                .orElse(null);
    }
} 