package com.ggnetworks.repository;

import com.ggnetworks.entity.RadiusNas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RadiusNasRepository extends JpaRepository<RadiusNas, Long> {
    
    Optional<RadiusNas> findByNasName(String nasName);
    
    List<RadiusNas> findByShortName(String shortName);
    
    List<RadiusNas> findByType(String type);
    
    List<RadiusNas> findByIsActiveTrue();
    
    List<RadiusNas> findByLocation(String location);
    
    Optional<RadiusNas> findByRouterId(Long routerId);
}
