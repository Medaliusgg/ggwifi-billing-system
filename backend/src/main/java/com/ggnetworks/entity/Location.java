package com.ggnetworks.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "locations")
public class Location extends BaseEntity {

    @NotBlank(message = "Location name is required")
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "region")
    private String region;

    @Column(name = "country", nullable = false)
    private String country = "Tanzania";

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "latitude", precision = 10, scale = 8)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 11, scale = 8)
    private BigDecimal longitude;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LocationStatus status = LocationStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private LocationType type;

    @Column(name = "coverage_radius_km")
    private Double coverageRadiusKm;

    @Column(name = "population_density")
    private String populationDensity;

    @Column(name = "infrastructure_quality")
    private String infrastructureQuality;

    @Column(name = "installation_cost_multiplier", precision = 5, scale = 2)
    private BigDecimal installationCostMultiplier = BigDecimal.ONE;

    @Column(name = "is_hotspot_available")
    private Boolean isHotspotAvailable = true;

    @Column(name = "is_pppoe_available")
    private Boolean isPppoeAvailable = true;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public enum LocationStatus {
        ACTIVE, INACTIVE, PLANNED, UNDER_DEVELOPMENT, MAINTENANCE
    }

    public enum LocationType {
        RESIDENTIAL, COMMERCIAL, INDUSTRIAL, RURAL, URBAN, SUBURBAN
    }

    public boolean isServiceAvailable() {
        return status == LocationStatus.ACTIVE;
    }

    public boolean supportsHotspot() {
        return isServiceAvailable() && Boolean.TRUE.equals(isHotspotAvailable);
    }

    public boolean supportsPppoe() {
        return isServiceAvailable() && Boolean.TRUE.equals(isPppoeAvailable);
    }
} 