package com.ggnetworks.service;

import com.ggnetworks.entity.Location;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Mock Location Service for when backend is disabled
 * Provides sample coverage data for customer portal
 */
@Slf4j
@Service
public class MockLocationService extends LocationService {

    public MockLocationService() {
        super(null);
    }

    @Override
    public List<Location> getActiveLocations() {
        log.info("Mock: Fetching active coverage areas");
        return generateMockLocations();
    }

    @Override
    public List<Location> getLocationsByCity(String city) {
        log.info("Mock: Fetching coverage areas for city: {}", city);
        return generateMockLocations().stream()
                .filter(location -> location.getCity().toLowerCase().contains(city.toLowerCase()))
                .toList();
    }

    @Override
    public Location getLocationById(Long id) {
        log.info("Mock: Fetching coverage area by ID: {}", id);
        return generateMockLocations().stream()
                .filter(location -> location.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    @Override
    public boolean checkCoverageAvailability(String location) {
        log.info("Mock: Checking coverage availability for location: {}", location);
        // Mock logic - return true for common areas
        String lowerLocation = location.toLowerCase();
        return lowerLocation.contains("dar") || 
               lowerLocation.contains("arusha") || 
               lowerLocation.contains("mwanza") ||
               lowerLocation.contains("dodoma") ||
               lowerLocation.contains("morogoro");
    }

    // ==================== MOCK DATA GENERATION ====================

    private List<Location> generateMockLocations() {
        List<Location> locations = new ArrayList<>();
        
        // Location 1: Dar es Salaam - City Centre
        Location darCityCentre = new Location();
        darCityCentre.setId(1L);
        darCityCentre.setName("Dar es Salaam - City Centre");
        darCityCentre.setDescription("Coverage in Dar es Salaam city centre area");
        darCityCentre.setAddress("City Centre, Dar es Salaam");
        darCityCentre.setCity("Dar es Salaam");
        darCityCentre.setRegion("Dar es Salaam");
        darCityCentre.setStatus(Location.LocationStatus.ACTIVE);
        darCityCentre.setType(Location.LocationType.URBAN);
        darCityCentre.setCoverageRadiusKm(5.0);
        darCityCentre.setPopulationDensity("HIGH");
        darCityCentre.setInfrastructureQuality("EXCELLENT");
        darCityCentre.setIsHotspotAvailable(true);
        darCityCentre.setIsPppoeAvailable(true);
        darCityCentre.setNotes("High-speed internet coverage in city centre");
        locations.add(darCityCentre);

        // Location 2: Dar es Salaam - Oyster Bay
        Location darOysterBay = new Location();
        darOysterBay.setId(2L);
        darOysterBay.setName("Dar es Salaam - Oyster Bay");
        darOysterBay.setDescription("Coverage in Oyster Bay residential area");
        darOysterBay.setAddress("Oyster Bay, Dar es Salaam");
        darOysterBay.setCity("Dar es Salaam");
        darOysterBay.setRegion("Dar es Salaam");
        darOysterBay.setStatus(Location.LocationStatus.ACTIVE);
        darOysterBay.setType(Location.LocationType.URBAN);
        darOysterBay.setCoverageRadiusKm(3.0);
        darOysterBay.setPopulationDensity("MEDIUM");
        darOysterBay.setInfrastructureQuality("GOOD");
        darOysterBay.setIsHotspotAvailable(true);
        darOysterBay.setIsPppoeAvailable(true);
        darOysterBay.setNotes("Residential area coverage");
        locations.add(darOysterBay);

        // Location 3: Arusha - City Centre
        Location arushaCityCentre = new Location();
        arushaCityCentre.setId(3L);
        arushaCityCentre.setName("Arusha - City Centre");
        arushaCityCentre.setDescription("Coverage in Arusha city centre area");
        arushaCityCentre.setAddress("City Centre, Arusha");
        arushaCityCentre.setCity("Arusha");
        arushaCityCentre.setRegion("Arusha");
        arushaCityCentre.setStatus(Location.LocationStatus.ACTIVE);
        arushaCityCentre.setType(Location.LocationType.URBAN);
        arushaCityCentre.setCoverageRadiusKm(4.0);
        arushaCityCentre.setPopulationDensity("HIGH");
        arushaCityCentre.setInfrastructureQuality("GOOD");
        arushaCityCentre.setIsHotspotAvailable(true);
        arushaCityCentre.setIsPppoeAvailable(true);
        arushaCityCentre.setNotes("Tourist area with high demand");
        locations.add(arushaCityCentre);

        // Location 4: Mwanza - City Centre
        Location mwanzaCityCentre = new Location();
        mwanzaCityCentre.setId(4L);
        mwanzaCityCentre.setName("Mwanza - City Centre");
        mwanzaCityCentre.setDescription("Coverage in Mwanza city centre area");
        mwanzaCityCentre.setAddress("City Centre, Mwanza");
        mwanzaCityCentre.setCity("Mwanza");
        mwanzaCityCentre.setRegion("Mwanza");
        mwanzaCityCentre.setStatus(Location.LocationStatus.ACTIVE);
        mwanzaCityCentre.setType(Location.LocationType.URBAN);
        mwanzaCityCentre.setCoverageRadiusKm(3.5);
        mwanzaCityCentre.setPopulationDensity("MEDIUM");
        mwanzaCityCentre.setInfrastructureQuality("GOOD");
        mwanzaCityCentre.setIsHotspotAvailable(true);
        mwanzaCityCentre.setIsPppoeAvailable(false);
        mwanzaCityCentre.setNotes("Hotspot only coverage");
        locations.add(mwanzaCityCentre);

        // Location 5: Dodoma - Government Area
        Location dodomaGovernment = new Location();
        dodomaGovernment.setId(5L);
        dodomaGovernment.setName("Dodoma - Government Area");
        dodomaGovernment.setDescription("Coverage in Dodoma government area");
        dodomaGovernment.setAddress("Government Area, Dodoma");
        dodomaGovernment.setCity("Dodoma");
        dodomaGovernment.setRegion("Dodoma");
        dodomaGovernment.setStatus(Location.LocationStatus.ACTIVE);
        dodomaGovernment.setType(Location.LocationType.URBAN);
        dodomaGovernment.setCoverageRadiusKm(2.5);
        dodomaGovernment.setPopulationDensity("LOW");
        dodomaGovernment.setInfrastructureQuality("EXCELLENT");
        dodomaGovernment.setIsHotspotAvailable(true);
        dodomaGovernment.setIsPppoeAvailable(true);
        dodomaGovernment.setNotes("Government offices and diplomatic area");
        locations.add(dodomaGovernment);

        return locations;
    }
} 