package com.ggnetworks.repository;

import com.ggnetworks.entity.ProjectTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProjectTaskRepository extends JpaRepository<ProjectTask, Long> {
    
    List<ProjectTask> findByProjectId(Long projectId);
    
    List<ProjectTask> findByProjectIdAndStatus(Long projectId, ProjectTask.TaskStatus status);
    
    List<ProjectTask> findByAssignedTo(String assignedTo);
    
    List<ProjectTask> findByStatus(ProjectTask.TaskStatus status);
    
    List<ProjectTask> findByPriority(ProjectTask.TaskPriority priority);
    
    List<ProjectTask> findByDueDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<ProjectTask> findByProjectIdAndStatusOrderByPriorityDesc(Long projectId, ProjectTask.TaskStatus status);
    
    long countByProjectId(Long projectId);
    
    long countByProjectIdAndStatus(Long projectId, ProjectTask.TaskStatus status);
}

