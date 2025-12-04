package com.ggnetworks.repository;

import com.ggnetworks.entity.AutomationTrigger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AutomationTriggerRepository extends JpaRepository<AutomationTrigger, Long> {

    Optional<AutomationTrigger> findByTriggerId(String triggerId);

    List<AutomationTrigger> findByActiveTrue();
}

