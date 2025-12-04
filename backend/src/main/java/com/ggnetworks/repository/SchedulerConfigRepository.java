package com.ggnetworks.repository;

import com.ggnetworks.entity.SchedulerConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SchedulerConfigRepository extends JpaRepository<SchedulerConfig, Long> {

    Optional<SchedulerConfig> findByScheduleId(String scheduleId);

    List<SchedulerConfig> findByStatus(String status);
}

