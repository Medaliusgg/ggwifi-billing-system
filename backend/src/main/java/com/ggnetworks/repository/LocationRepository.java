package com.ggnetworks.repository;

import com.ggnetworks.entity.Location;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

    @Query("SELECT l FROM Location l WHERE l.status = :status AND l.deletedAt IS NULL")
    List<Location> findByStatus(@Param("status") Location.LocationStatus status);

    @Query("SELECT l FROM Location l WHERE l.type = :type AND l.deletedAt IS NULL")
    List<Location> findByType(@Param("type") Location.LocationType type);

    @Query("SELECT l FROM Location l WHERE l.city = :city AND l.deletedAt IS NULL")
    List<Location> findByCity(@Param("city") String city);

    @Query("SELECT l FROM Location l WHERE l.region = :region AND l.deletedAt IS NULL")
    List<Location> findByRegion(@Param("region") String region);

    @Query("SELECT l FROM Location l WHERE l.status = :status AND l.type = :type AND l.deletedAt IS NULL")
    List<Location> findByStatusAndType(@Param("status") Location.LocationStatus status, 
                                     @Param("type") Location.LocationType type);

    @Query("SELECT l FROM Location l WHERE l.isHotspotAvailable = true AND l.deletedAt IS NULL")
    List<Location> findHotspotAvailableLocations();

    @Query("SELECT l FROM Location l WHERE l.isPppoeAvailable = true AND l.deletedAt IS NULL")
    List<Location> findPppoeAvailableLocations();

    @Query("SELECT l FROM Location l WHERE l.isHotspotAvailable = true AND l.isPppoeAvailable = true AND l.deletedAt IS NULL")
    List<Location> findFullServiceLocations();

    @Query("SELECT l FROM Location l WHERE l.latitude BETWEEN :minLat AND :maxLat AND l.longitude BETWEEN :minLng AND :maxLng AND l.deletedAt IS NULL")
    List<Location> findLocationsInBounds(@Param("minLat") BigDecimal minLat, 
                                       @Param("maxLat") BigDecimal maxLat,
                                       @Param("minLng") BigDecimal minLng, 
                                       @Param("maxLng") BigDecimal maxLng);

    @Query("SELECT COUNT(l) FROM Location l WHERE l.status = :status AND l.deletedAt IS NULL")
    long countByStatus(@Param("status") Location.LocationStatus status);

    @Query("SELECT COUNT(l) FROM Location l WHERE l.type = :type AND l.deletedAt IS NULL")
    long countByType(@Param("type") Location.LocationType type);

    @Query("SELECT COUNT(l) FROM Location l WHERE l.city = :city AND l.deletedAt IS NULL")
    long countByCity(@Param("city") String city);

    @Query("SELECT COUNT(l) FROM Location l WHERE l.isHotspotAvailable = true AND l.deletedAt IS NULL")
    long countHotspotAvailableLocations();

    @Query("SELECT COUNT(l) FROM Location l WHERE l.isPppoeAvailable = true AND l.deletedAt IS NULL")
    long countPppoeAvailableLocations();

    @Query("SELECT l FROM Location l WHERE l.deletedAt IS NULL")
    Page<Location> findAllActive(Pageable pageable);

    @Query("SELECT l FROM Location l WHERE l.name LIKE %:name% AND l.deletedAt IS NULL")
    Page<Location> findByNameContaining(@Param("name") String name, Pageable pageable);

    @Query("SELECT l FROM Location l WHERE l.city LIKE %:city% AND l.deletedAt IS NULL")
    Page<Location> findByCityContaining(@Param("city") String city, Pageable pageable);

    @Query("SELECT l FROM Location l WHERE l.region LIKE %:region% AND l.deletedAt IS NULL")
    Page<Location> findByRegionContaining(@Param("region") String region, Pageable pageable);

    @Query("SELECT l FROM Location l WHERE l.address LIKE %:address% AND l.deletedAt IS NULL")
    Page<Location> findByAddressContaining(@Param("address") String address, Pageable pageable);

    @Query("SELECT DISTINCT l.city FROM Location l WHERE l.deletedAt IS NULL ORDER BY l.city")
    List<String> findAllCities();

    @Query("SELECT DISTINCT l.region FROM Location l WHERE l.deletedAt IS NULL ORDER BY l.region")
    List<String> findAllRegions();
} 