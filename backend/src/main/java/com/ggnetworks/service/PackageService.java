package com.ggnetworks.service;

import com.ggnetworks.entity.InternetPackage;
import com.ggnetworks.repository.InternetPackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.Comparator;

@Service
public class PackageService {

    @Autowired
    private InternetPackageRepository packageRepository;

    /**
     * Get all packages for admin management
     */
    public List<InternetPackage> getAllPackages() {
        return packageRepository.findAll();
    }

    /**
     * Get packages with pagination and filtering
     */
    public Map<String, Object> getPackagesWithPagination(int page, int size, String search, String type, String status) {
        List<InternetPackage> allPackages = packageRepository.findAll();
        
        // Apply filters
        List<InternetPackage> filteredPackages = allPackages.stream()
            .filter(pkg -> search == null || pkg.getName().toLowerCase().contains(search.toLowerCase()) ||
                          pkg.getDescription() != null && pkg.getDescription().toLowerCase().contains(search.toLowerCase()))
            .filter(pkg -> type == null || pkg.getPackageType().toString().equals(type))
            .filter(pkg -> status == null || pkg.getStatus().toString().equals(status))
            .collect(Collectors.toList());

        // Apply pagination
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, filteredPackages.size());
        List<InternetPackage> paginatedPackages = filteredPackages.subList(startIndex, endIndex);

        Map<String, Object> result = new HashMap<>();
        result.put("packages", paginatedPackages);
        result.put("totalElements", filteredPackages.size());
        result.put("totalPages", (int) Math.ceil((double) filteredPackages.size() / size));
        result.put("currentPage", page);
        result.put("size", size);

        return result;
    }

    /**
     * Get packages available for customers (with time-based filtering)
     */
    public List<InternetPackage> getAvailablePackagesForCustomers() {
        List<InternetPackage> activePackages = packageRepository.findByIsActiveTrue();
        
        // Time-based filtering ENABLED
        return activePackages.stream()
            .filter(this::isPackageCurrentlyAvailable)
            .collect(Collectors.toList());
    }

    /**
     * Check if a package is currently available based on time-based offer rules
     */
    public boolean isPackageCurrentlyAvailable(InternetPackage pkg) {
        // If not a time-based offer, always available
        if (!Boolean.TRUE.equals(pkg.getIsTimeBasedOffer()) || pkg.getOfferType() == null) {
            return true;
        }

        LocalDateTime now = LocalDateTime.now();
        DayOfWeek currentDay = now.getDayOfWeek();
        LocalTime currentTime = now.toLocalTime();

        switch (pkg.getOfferType()) {
            case UNIVERSAL:
                return true;
                
            case DAILY_SPECIFIC:
                return isAvailableOnCurrentDay(pkg, currentDay, currentTime);
                
            case WEEKEND_ONLY:
                return (currentDay == DayOfWeek.SATURDAY || currentDay == DayOfWeek.SUNDAY) &&
                       isWithinTimeRange(pkg, currentTime);
                       
            case WEEKDAY_ONLY:
                return (currentDay != DayOfWeek.SATURDAY && currentDay != DayOfWeek.SUNDAY) &&
                       isWithinTimeRange(pkg, currentTime);
                       
            case TIME_RESTRICTED:
                return isWithinTimeRange(pkg, currentTime);
                
            case LIMITED_TIME:
                // For limited time offers, you could add start/end date fields
                return true; // Implement based on your needs
                
            default:
                return true;
        }
    }

    /**
     * Check if package is available on current day
     */
    private boolean isAvailableOnCurrentDay(InternetPackage pkg, DayOfWeek currentDay, LocalTime currentTime) {
        if (pkg.getAvailableDays() == null || pkg.getAvailableDays().isEmpty()) {
            return false;
        }

        try {
            // Parse available days JSON array
            String availableDays = pkg.getAvailableDays();
            List<String> days = Arrays.asList(availableDays.replaceAll("[\\[\\]\"]", "").split(","));
            
            String currentDayName = currentDay.toString();
            boolean isDayAvailable = days.contains(currentDayName);
            
            return isDayAvailable && isWithinTimeRange(pkg, currentTime);
        } catch (Exception e) {
            System.err.println("Error parsing available days for package " + pkg.getId() + ": " + e.getMessage());
            return false;
        }
    }

    /**
     * Check if current time is within offer time range
     */
    private boolean isWithinTimeRange(InternetPackage pkg, LocalTime currentTime) {
        if (pkg.getOfferStartTime() == null || pkg.getOfferEndTime() == null) {
            return true; // No time restrictions
        }

        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
            LocalTime startTime = LocalTime.parse(pkg.getOfferStartTime(), formatter);
            LocalTime endTime = LocalTime.parse(pkg.getOfferEndTime(), formatter);
            
            return !currentTime.isBefore(startTime) && !currentTime.isAfter(endTime);
        } catch (Exception e) {
            System.err.println("Error parsing time range for package " + pkg.getId() + ": " + e.getMessage());
            return true; // Default to available if parsing fails
        }
    }

    /**
     * Create a new package
     */
    public InternetPackage createPackage(InternetPackage packageData) {
        // Set default values
        if (packageData.getIsActive() == null) {
            packageData.setIsActive(true);
        }
        if (packageData.getIsTimeBasedOffer() == null) {
            packageData.setIsTimeBasedOffer(false);
        }
        if (packageData.getStatus() == null) {
            packageData.setStatus(InternetPackage.PackageStatus.ACTIVE);
        }

        return packageRepository.save(packageData);
    }

    /**
     * Update an existing package
     */
    public InternetPackage updatePackage(Long id, InternetPackage packageData) {
        InternetPackage existingPackage = packageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Package not found with id: " + id));

        // Update fields
        existingPackage.setName(packageData.getName());
        existingPackage.setDescription(packageData.getDescription());
        existingPackage.setPackageType(packageData.getPackageType());
        existingPackage.setPrice(packageData.getPrice());
        existingPackage.setDurationDays(packageData.getDurationDays());
        existingPackage.setDataLimitMb(packageData.getDataLimitMb());
        existingPackage.setIsUnlimitedData(packageData.getIsUnlimitedData());
        existingPackage.setUploadSpeedMbps(packageData.getUploadSpeedMbps());
        existingPackage.setDownloadSpeedMbps(packageData.getDownloadSpeedMbps());
        existingPackage.setIsActive(packageData.getIsActive());
        existingPackage.setIsPopular(packageData.getIsPopular());
        existingPackage.setIsFeatured(packageData.getIsFeatured());
        existingPackage.setCategory(packageData.getCategory());
        existingPackage.setStatus(packageData.getStatus());
        existingPackage.setTargetAudience(packageData.getTargetAudience());
        existingPackage.setBillingCycle(packageData.getBillingCycle());
        existingPackage.setSpeedTier(packageData.getSpeedTier());

        // Update time-based offer fields
        existingPackage.setIsTimeBasedOffer(packageData.getIsTimeBasedOffer());
        existingPackage.setOfferType(packageData.getOfferType());
        existingPackage.setAvailableDays(packageData.getAvailableDays());
        existingPackage.setOfferStartTime(packageData.getOfferStartTime());
        existingPackage.setOfferEndTime(packageData.getOfferEndTime());
        existingPackage.setOfferDescription(packageData.getOfferDescription());
        existingPackage.setOriginalPrice(packageData.getOriginalPrice());
        existingPackage.setDiscountPercentage(packageData.getDiscountPercentage());

        return packageRepository.save(existingPackage);
    }

    /**
     * Delete a package
     */
    public void deletePackage(Long id) {
        if (!packageRepository.existsById(id)) {
            throw new RuntimeException("Package not found with id: " + id);
        }
        packageRepository.deleteById(id);
    }

    /**
     * Get package by ID
     */
    public InternetPackage getPackageById(Long id) {
        return packageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Package not found with id: " + id));
    }

    /**
     * Get packages by type
     */
    public List<InternetPackage> getPackagesByType(InternetPackage.PackageType type) {
        return packageRepository.findByPackageTypeAndIsActiveTrue(type);
    }

    /**
     * Get popular packages
     */
    public List<InternetPackage> getPopularPackages() {
        return packageRepository.findByIsPopularTrueAndIsActiveTrue();
    }

    /**
     * Get time-based offer packages
     */
    public List<InternetPackage> getTimeBasedOfferPackages() {
        return packageRepository.findAll().stream()
            .filter(pkg -> Boolean.TRUE.equals(pkg.getIsTimeBasedOffer()))
            .collect(Collectors.toList());
    }

    /**
     * Get packages available today
     */
    public List<InternetPackage> getPackagesAvailableToday() {
        return packageRepository.findByIsActiveTrue().stream()
            .filter(this::isPackageCurrentlyAvailable)
            .collect(Collectors.toList());
    }
    
    /**
     * Get packages with pagination (for admin)
     */
    public Map<String, Object> getPackagesWithPagination(int page, int size, String sortBy, String sortDir) {
        List<InternetPackage> allPackages = packageRepository.findAll();
        
        // Apply sorting
        Comparator<InternetPackage> comparator = getComparator(sortBy, sortDir);
        allPackages.sort(comparator);
        
        // Apply pagination
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, allPackages.size());
        List<InternetPackage> paginatedPackages = allPackages.subList(startIndex, endIndex);
        
        Map<String, Object> result = new HashMap<>();
        result.put("packages", paginatedPackages);
        result.put("totalElements", allPackages.size());
        result.put("totalPages", (int) Math.ceil((double) allPackages.size() / size));
        result.put("currentPage", page);
        result.put("size", size);
        
        return result;
    }
    
    /**
     * Search packages by name or description
     */
    public List<InternetPackage> searchPackages(String query) {
        return packageRepository.findAll().stream()
            .filter(pkg -> pkg.getName().toLowerCase().contains(query.toLowerCase()) ||
                          (pkg.getDescription() != null && pkg.getDescription().toLowerCase().contains(query.toLowerCase())))
            .collect(Collectors.toList());
    }
    
    /**
     * Get comparator for sorting
     */
    private Comparator<InternetPackage> getComparator(String sortBy, String sortDir) {
        Comparator<InternetPackage> comparator;
        
        switch (sortBy.toLowerCase()) {
            case "name":
                comparator = Comparator.comparing(InternetPackage::getName);
                break;
            case "price":
                comparator = Comparator.comparing(InternetPackage::getPrice);
                break;
            case "duration":
                comparator = Comparator.comparing(InternetPackage::getDurationDays);
                break;
            default:
                comparator = Comparator.comparing(InternetPackage::getId);
        }
        
        return "desc".equalsIgnoreCase(sortDir) ? comparator.reversed() : comparator;
    }
}