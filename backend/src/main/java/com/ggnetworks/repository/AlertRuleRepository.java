package com.ggnetworks.repository;

import com.ggnetworks.entity.AlertRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlertRuleRepository extends JpaRepository<AlertRule, Long> {
    
    List<AlertRule> findByAlertType(AlertRule.AlertType alertType);
    
    List<AlertRule> findByIsActive(Boolean isActive);
    
    List<AlertRule> findByMetricName(String metricName);
    
    Optional<AlertRule> findByName(String name);
    
    List<AlertRule> findByAlertTypeAndIsActive(AlertRule.AlertType alertType, Boolean isActive);
}


