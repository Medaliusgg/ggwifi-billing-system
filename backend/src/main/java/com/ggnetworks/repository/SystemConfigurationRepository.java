package com.ggnetworks.repository;

import com.ggnetworks.entity.SystemConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SystemConfigurationRepository extends JpaRepository<SystemConfiguration, Long> {
    
    Optional<SystemConfiguration> findByConfigKey(String configKey);
    
    List<SystemConfiguration> findByCategory(SystemConfiguration.ConfigCategory category);
    
    List<SystemConfiguration> findByIsActive(Boolean isActive);
    
    List<SystemConfiguration> findByCategoryAndIsActive(SystemConfiguration.ConfigCategory category, Boolean isActive);
    
    boolean existsByConfigKey(String configKey);
    
    long countByCategory(SystemConfiguration.ConfigCategory category);
    
    long countByIsActive(Boolean isActive);
}
