package com.ggnetworks.repository;

import com.ggnetworks.entity.RentPlace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RentPlaceRepository extends JpaRepository<RentPlace, Long> {
    
    Optional<RentPlace> findByPlaceId(String placeId);
    
    List<RentPlace> findByPlaceName(String placeName);
    
    List<RentPlace> findByPlaceType(RentPlace.PlaceType placeType);
    
    List<RentPlace> findByPropertyType(RentPlace.PropertyType propertyType);
    
    List<RentPlace> findByStatus(RentPlace.PlaceStatus status);
    
    List<RentPlace> findByCity(String city);
    
    List<RentPlace> findByRegion(String region);
    
    List<RentPlace> findByDistrict(String district);
    
    List<RentPlace> findByWard(String ward);
    
    List<RentPlace> findByLandlordName(String landlordName);
    
    List<RentPlace> findByLandlordContactPrimary(String landlordContactPrimary);
    
    List<RentPlace> findByLandlordEmail(String landlordEmail);
    
    List<RentPlace> findByIsActive(Boolean isActive);
    
    List<RentPlace> findByIsOccupied(Boolean isOccupied);
    
    List<RentPlace> findByMonthlyRentBetween(BigDecimal minRent, BigDecimal maxRent);
    
    List<RentPlace> findByTotalMonthlyCostBetween(BigDecimal minCost, BigDecimal maxCost);
    
    List<RentPlace> findByFloorAreaSqftBetween(Double minArea, Double maxArea);
    
    List<RentPlace> findByRoomsCount(Integer roomsCount);
    
    List<RentPlace> findByParkingSpaces(Integer parkingSpaces);
    
    List<RentPlace> findByParkingType(RentPlace.ParkingType parkingType);
    
    List<RentPlace> findByHasElectricity(Boolean hasElectricity);
    
    List<RentPlace> findByHasWater(Boolean hasWater);
    
    List<RentPlace> findByHasInternet(Boolean hasInternet);
    
    List<RentPlace> findByHasSecurity(Boolean hasSecurity);
    
    List<RentPlace> findByHasAirConditioning(Boolean hasAirConditioning);
    
    List<RentPlace> findByHasGenerator(Boolean hasGenerator);
    
    List<RentPlace> findByHasElevator(Boolean hasElevator);
    
    List<RentPlace> findByUtilitiesIncluded(Boolean utilitiesIncluded);
    
    List<RentPlace> findByLeaseStartDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<RentPlace> findByLeaseEndDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<RentPlace> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<RentPlace> findByLastInspectionDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<RentPlace> findByNextInspectionDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<RentPlace> findByInsuranceExpiryDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<RentPlace> findByPlaceNameContainingIgnoreCase(String placeName);
    
    List<RentPlace> findByAddressContainingIgnoreCase(String address);
    
    List<RentPlace> findByDescriptionContainingIgnoreCase(String description);
    
    boolean existsByPlaceId(String placeId);
    
    boolean existsByPlaceName(String placeName);
    
    long countByPlaceType(RentPlace.PlaceType placeType);
    
    long countByPropertyType(RentPlace.PropertyType propertyType);
    
    long countByStatus(RentPlace.PlaceStatus status);
    
    long countByCity(String city);
    
    long countByRegion(String region);
    
    long countByIsActive(Boolean isActive);
    
    long countByIsOccupied(Boolean isOccupied);
    
    long countByUtilitiesIncluded(Boolean utilitiesIncluded);
    
    long countByHasSecurity(Boolean hasSecurity);
    
    long countByHasInternet(Boolean hasInternet);
}
