package com.ggnetworks.service;

import com.ggnetworks.entity.Location;
import com.ggnetworks.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class LocationService {

    private final LocationRepository locationRepository;

    public List<Location> getActiveLocations() {
        return locationRepository.findByStatus(Location.LocationStatus.ACTIVE);
    }

    public List<Location> getLocationsByCity(String city) {
        return locationRepository.findByCity(city);
    }

    public Location getLocationById(Long id) {
        Optional<Location> location = locationRepository.findById(id);
        return location.orElse(null);
    }

    public boolean checkCoverageAvailability(String location) {
        // Simple check - you can implement more sophisticated logic
        List<Location> activeLocations = getActiveLocations();
        return activeLocations.stream()
                .anyMatch(loc -> loc.getName().toLowerCase().contains(location.toLowerCase()) ||
                               loc.getCity().toLowerCase().contains(location.toLowerCase()));
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    @Transactional
    public Location createLocation(Location location) {
        try {
            location.setStatus(Location.LocationStatus.ACTIVE);
            return locationRepository.save(location);
        } catch (Exception e) {
            log.error("Failed to create location", e);
            throw new RuntimeException("Failed to create location", e);
        }
    }

    @Transactional
    public Location updateLocation(Long id, Location locationRequest) {
        try {
            Optional<Location> locationOpt = locationRepository.findById(id);
            if (locationOpt.isEmpty()) {
                throw new IllegalArgumentException("Location not found");
            }

            Location existingLocation = locationOpt.get();
            existingLocation.setName(locationRequest.getName());
            existingLocation.setDescription(locationRequest.getDescription());
            existingLocation.setAddress(locationRequest.getAddress());
            existingLocation.setCity(locationRequest.getCity());
            existingLocation.setRegion(locationRequest.getRegion());
            existingLocation.setStatus(locationRequest.getStatus());
            existingLocation.setType(locationRequest.getType());
            existingLocation.setCoverageRadiusKm(locationRequest.getCoverageRadiusKm());
            existingLocation.setPopulationDensity(locationRequest.getPopulationDensity());
            existingLocation.setInfrastructureQuality(locationRequest.getInfrastructureQuality());
            existingLocation.setIsHotspotAvailable(locationRequest.getIsHotspotAvailable());
            existingLocation.setIsPppoeAvailable(locationRequest.getIsPppoeAvailable());
            existingLocation.setNotes(locationRequest.getNotes());

            return locationRepository.save(existingLocation);
        } catch (Exception e) {
            log.error("Failed to update location", e);
            throw new RuntimeException("Failed to update location", e);
        }
    }

    @Transactional
    public void deleteLocation(Long id) {
        try {
            Optional<Location> locationOpt = locationRepository.findById(id);
            if (locationOpt.isPresent()) {
                Location location = locationOpt.get();
                location.setStatus(Location.LocationStatus.INACTIVE);
                locationRepository.save(location);
            }
        } catch (Exception e) {
            log.error("Failed to delete location", e);
            throw new RuntimeException("Failed to delete location", e);
        }
    }
} 