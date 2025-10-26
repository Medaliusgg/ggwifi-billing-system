package com.ggnetworks.repository;

import com.ggnetworks.entity.InternetPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternetPackageRepository extends JpaRepository<InternetPackage, Long> {
    
    /**
     * Find all active packages
     */
    List<InternetPackage> findByIsActiveTrue();
    
    /**
     * Find packages by type and active status
     */
    List<InternetPackage> findByPackageTypeAndIsActiveTrue(InternetPackage.PackageType packageType);
    
    /**
     * Find popular packages
     */
    List<InternetPackage> findByIsPopularTrueAndIsActiveTrue();
    
    /**
     * Find packages by status
     */
    List<InternetPackage> findByStatus(InternetPackage.PackageStatus status);
    
    /**
     * Find packages by price range
     */
    @Query("SELECT p FROM InternetPackage p WHERE p.price BETWEEN :minPrice AND :maxPrice AND p.isActive = true")
    List<InternetPackage> findByPriceRange(@Param("minPrice") java.math.BigDecimal minPrice, 
                                          @Param("maxPrice") java.math.BigDecimal maxPrice);
    
    /**
     * Find packages by duration
     */
    List<InternetPackage> findByDurationDaysAndIsActiveTrue(Integer durationDays);
    
    /**
     * Find packages by name containing
     */
    List<InternetPackage> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);
    
    /**
     * Count active packages
     */
    long countByIsActiveTrue();
    
    /**
     * Count packages by type
     */
    long countByPackageTypeAndIsActiveTrue(InternetPackage.PackageType packageType);
}