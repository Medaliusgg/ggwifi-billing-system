package com.ggnetworks.service;

import com.ggnetworks.entity.Package;
import com.ggnetworks.repository.PackageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PackageService {

    private final PackageRepository packageRepository;

    // ==================== CUSTOMER PORTAL METHODS ====================

    /**
     * Get hotspot packages for customer portal
     * Customer portal retrieves packages created by admin
     */
    public List<Package> getHotspotPackages() {
        try {
            log.info("Fetching hotspot packages for customer portal");
            return packageRepository.findByTypeAndActive(Package.PackageType.HOTSPOT);
        } catch (Exception e) {
            log.error("Failed to get hotspot packages", e);
            return List.of();
        }
    }

    /**
     * Get hotspot packages with pagination for customer portal
     */
    public Page<Package> getHotspotPackages(Pageable pageable) {
        try {
            log.info("Fetching hotspot packages with pagination for customer portal");
            return packageRepository.findByType(Package.PackageType.HOTSPOT, pageable);
        } catch (Exception e) {
            log.error("Failed to get hotspot packages with pagination", e);
            return Page.empty(pageable);
        }
    }

    /**
     * Get popular hotspot packages for customer portal
     */
    public List<Package> getPopularHotspotPackages() {
        try {
            log.info("Fetching popular hotspot packages for customer portal");
            return packageRepository.findPopularPackagesByType(Package.PackageType.HOTSPOT);
        } catch (Exception e) {
            log.error("Failed to get popular hotspot packages", e);
            return List.of();
        }
    }

    /**
     * Get package by ID for customer portal
     */
    public Package getPackageById(Long packageId) {
        try {
            log.info("Fetching package details for ID: {}", packageId);
            Optional<Package> packageOpt = packageRepository.findById(packageId);
            return packageOpt.orElse(null);
        } catch (Exception e) {
            log.error("Failed to get package by ID: {}", packageId, e);
            return null;
        }
    }

    // ==================== ADMIN PORTAL METHODS ====================

    /**
     * Get PPPoE packages for admin portal
     */
    public List<Package> getPppoePackages() {
        try {
            log.info("Fetching PPPoE packages for admin portal");
            return packageRepository.findByTypeAndActive(Package.PackageType.PPPOE);
        } catch (Exception e) {
            log.error("Failed to get PPPoE packages", e);
            return List.of();
        }
    }

    /**
     * Get packages by type for admin portal
     */
    public List<Package> getPackagesByType(Package.PackageType type) {
        try {
            log.info("Fetching packages by type: {} for admin portal", type);
            return packageRepository.findByTypeAndActive(type);
        } catch (Exception e) {
            log.error("Failed to get packages by type: {}", type, e);
            return List.of();
        }
    }

    /**
     * Get all active packages for admin portal
     */
    public List<Package> getActivePackages() {
        try {
            log.info("Fetching all active packages for admin portal");
            return packageRepository.findAllActive();
        } catch (Exception e) {
            log.error("Failed to get active packages", e);
            return List.of();
        }
    }

    /**
     * Get PPPoE packages with pagination for admin portal
     */
    public Page<Package> getPppoePackages(Pageable pageable) {
        try {
            log.info("Fetching PPPoE packages with pagination for admin portal");
            return packageRepository.findByType(Package.PackageType.PPPOE, pageable);
        } catch (Exception e) {
            log.error("Failed to get PPPoE packages with pagination", e);
            return Page.empty(pageable);
        }
    }

    /**
     * Get popular PPPoE packages for admin portal
     */
    public List<Package> getPopularPppoePackages() {
        try {
            log.info("Fetching popular PPPoE packages for admin portal");
            return packageRepository.findPopularPackagesByType(Package.PackageType.PPPOE);
        } catch (Exception e) {
            log.error("Failed to get popular PPPoE packages", e);
            return List.of();
        }
    }

    // ==================== PACKAGE MANAGEMENT ====================

    /**
     * Create new package (Admin only)
     */
    @Transactional
    public Package createPackage(Package packageRequest) {
        try {
            log.info("Creating new package: {}", packageRequest.getName());
            
            Package newPackage = new Package();
            newPackage.setName(packageRequest.getName());
            newPackage.setType(packageRequest.getType());
            newPackage.setPrice(packageRequest.getPrice());
            newPackage.setDurationDays(packageRequest.getDurationDays());
            newPackage.setBandwidthLimitMb(packageRequest.getBandwidthLimitMb());
            newPackage.setDescription(packageRequest.getDescription());
            newPackage.setIsPopular(packageRequest.getIsPopular());
            newPackage.setIsActive(true);

            Package savedPackage = packageRepository.save(newPackage);
            log.info("Successfully created package: {} with ID: {}", savedPackage.getName(), savedPackage.getId());
            
            return savedPackage;
        } catch (Exception e) {
            log.error("Failed to create package: {}", packageRequest.getName(), e);
            throw new RuntimeException("Failed to create package", e);
        }
    }

    /**
     * Update existing package (Admin only)
     */
    @Transactional
    public Package updatePackage(Long packageId, Package packageRequest) {
        try {
            log.info("Updating package with ID: {}", packageId);
            
            Optional<Package> packageOpt = packageRepository.findById(packageId);
            if (packageOpt.isEmpty()) {
                throw new IllegalArgumentException("Package not found with ID: " + packageId);
            }

            Package existingPackage = packageOpt.get();
            existingPackage.setName(packageRequest.getName());
            existingPackage.setType(packageRequest.getType());
            existingPackage.setPrice(packageRequest.getPrice());
            existingPackage.setDurationDays(packageRequest.getDurationDays());
            existingPackage.setBandwidthLimitMb(packageRequest.getBandwidthLimitMb());
            existingPackage.setDescription(packageRequest.getDescription());
            existingPackage.setIsPopular(packageRequest.getIsPopular());
            existingPackage.setIsActive(packageRequest.getIsActive());

            Package updatedPackage = packageRepository.save(existingPackage);
            log.info("Successfully updated package: {} with ID: {}", updatedPackage.getName(), updatedPackage.getId());
            
            return updatedPackage;
        } catch (Exception e) {
            log.error("Failed to update package with ID: {}", packageId, e);
            throw new RuntimeException("Failed to update package", e);
        }
    }

    /**
     * Delete package (Admin only) - Soft delete by setting active to false
     */
    @Transactional
    public void deletePackage(Long packageId) {
        try {
            log.info("Deleting package with ID: {}", packageId);
            
            Optional<Package> packageOpt = packageRepository.findById(packageId);
            if (packageOpt.isEmpty()) {
                throw new IllegalArgumentException("Package not found with ID: " + packageId);
            }

            Package packageToDelete = packageOpt.get();
            packageToDelete.setIsActive(false);
            packageRepository.save(packageToDelete);
            
            log.info("Successfully deleted package: {} with ID: {}", packageToDelete.getName(), packageToDelete.getId());
        } catch (Exception e) {
            log.error("Failed to delete package with ID: {}", packageId, e);
            throw new RuntimeException("Failed to delete package", e);
        }
    }

    // ==================== STATISTICS AND ANALYTICS ====================

    /**
     * Get count of active packages
     */
    public long getActivePackagesCount() {
        try {
            long hotspotCount = packageRepository.countActiveByType(Package.PackageType.HOTSPOT);
            long pppoeCount = packageRepository.countActiveByType(Package.PackageType.PPPOE);
            return hotspotCount + pppoeCount;
        } catch (Exception e) {
            log.error("Failed to get active packages count", e);
            return 0;
        }
    }

    /**
     * Get package statistics for admin dashboard
     */
    public Map<String, Object> getPackageStatistics() {
        try {
            log.info("Fetching package statistics for admin dashboard");
            
            long totalPackages = packageRepository.count();
            long activePackages = packageRepository.countByIsActiveTrue();
            long hotspotPackages = packageRepository.countByType(Package.PackageType.HOTSPOT);
            long pppoePackages = packageRepository.countByType(Package.PackageType.PPPOE);
            long popularPackages = 0; // Placeholder - will be implemented when repository method is available
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalPackages", totalPackages);
            stats.put("activePackages", activePackages);
            stats.put("hotspotPackages", hotspotPackages);
            stats.put("pppoePackages", pppoePackages);
            stats.put("popularPackages", popularPackages);
            
            log.info("Package statistics: {}", stats);
            return stats;
        } catch (Exception e) {
            log.error("Failed to get package statistics", e);
            return new HashMap<>();
        }
    }

    /**
     * Get package analytics for customer portal
     */
    public Map<String, Object> getPackageAnalytics() {
        try {
            log.info("Fetching package analytics for customer portal");
            
            List<Package> hotspotPackages = getHotspotPackages();
            List<Package> popularPackages = getPopularHotspotPackages();
            
            Map<String, Object> analytics = new HashMap<>();
            analytics.put("totalHotspotPackages", hotspotPackages.size());
            analytics.put("popularPackages", popularPackages.size());
            analytics.put("packages", hotspotPackages);
            
            return analytics;
        } catch (Exception e) {
            log.error("Failed to get package analytics", e);
            return new HashMap<>();
        }
    }

    // ==================== VALIDATION METHODS ====================

    /**
     * Validate package exists and is active
     */
    public boolean isPackageValid(Long packageId) {
        try {
            Optional<Package> packageOpt = packageRepository.findById(packageId);
            return packageOpt.isPresent() && packageOpt.get().getIsActive();
        } catch (Exception e) {
            log.error("Failed to validate package with ID: {}", packageId, e);
            return false;
        }
    }

    /**
     * Get package price for payment processing
     */
    public Double getPackagePrice(Long packageId) {
        try {
            Optional<Package> packageOpt = packageRepository.findById(packageId);
            return packageOpt.map(pkg -> pkg.getPrice().doubleValue()).orElse(null);
        } catch (Exception e) {
            log.error("Failed to get package price for ID: {}", packageId, e);
            return null;
        }
    }
} 