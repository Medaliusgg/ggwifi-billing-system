package com.ggnetworks.repository;

import com.ggnetworks.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    
    List<Report> findByReportType(Report.ReportType reportType);
    
    List<Report> findByIsActive(Boolean isActive);
    
    List<Report> findByScheduleType(Report.ScheduleType scheduleType);
    
    List<Report> findByCreatedBy(String createdBy);
    
    Optional<Report> findByName(String name);
    
    List<Report> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Report> findByReportTypeAndIsActive(Report.ReportType reportType, Boolean isActive);
    
    long countByIsActive(Boolean isActive);
}

