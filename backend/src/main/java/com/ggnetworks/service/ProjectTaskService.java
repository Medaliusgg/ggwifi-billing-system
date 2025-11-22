package com.ggnetworks.service;

import com.ggnetworks.entity.ProjectTask;
import com.ggnetworks.repository.ProjectTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ProjectTaskService {
    
    @Autowired
    private ProjectTaskRepository projectTaskRepository;
    
    public ProjectTask createTask(ProjectTask task) {
        if (task.getCreatedAt() == null) {
            task.setCreatedAt(LocalDateTime.now());
        }
        return projectTaskRepository.save(task);
    }
    
    public Optional<ProjectTask> getTaskById(Long id) {
        return projectTaskRepository.findById(id);
    }
    
    public List<ProjectTask> getTasksByProject(Long projectId) {
        return projectTaskRepository.findByProjectId(projectId);
    }
    
    public List<ProjectTask> getTasksByProjectAndStatus(Long projectId, ProjectTask.TaskStatus status) {
        return projectTaskRepository.findByProjectIdAndStatus(projectId, status);
    }
    
    public List<ProjectTask> getTasksByAssignee(String assignedTo) {
        return projectTaskRepository.findByAssignedTo(assignedTo);
    }
    
    public ProjectTask updateTask(Long id, ProjectTask updatedTask) {
        ProjectTask existing = projectTaskRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        
        existing.setTitle(updatedTask.getTitle());
        existing.setDescription(updatedTask.getDescription());
        existing.setStatus(updatedTask.getStatus());
        existing.setPriority(updatedTask.getPriority());
        existing.setAssignedTo(updatedTask.getAssignedTo());
        existing.setDueDate(updatedTask.getDueDate());
        existing.setEstimatedHours(updatedTask.getEstimatedHours());
        existing.setActualHours(updatedTask.getActualHours());
        existing.setNotes(updatedTask.getNotes());
        
        // Auto-set completedAt when status changes to COMPLETED
        if (updatedTask.getStatus() == ProjectTask.TaskStatus.COMPLETED && existing.getCompletedAt() == null) {
            existing.setCompletedAt(LocalDateTime.now());
        } else if (updatedTask.getStatus() != ProjectTask.TaskStatus.COMPLETED) {
            existing.setCompletedAt(null);
        }
        
        return projectTaskRepository.save(existing);
    }
    
    public void deleteTask(Long id) {
        projectTaskRepository.deleteById(id);
    }
    
    public Map<String, Object> getTaskStatistics(Long projectId) {
        Map<String, Object> stats = new HashMap<>();
        
        long totalTasks = projectTaskRepository.countByProjectId(projectId);
        long pendingTasks = projectTaskRepository.countByProjectIdAndStatus(projectId, ProjectTask.TaskStatus.PENDING);
        long inProgressTasks = projectTaskRepository.countByProjectIdAndStatus(projectId, ProjectTask.TaskStatus.IN_PROGRESS);
        long completedTasks = projectTaskRepository.countByProjectIdAndStatus(projectId, ProjectTask.TaskStatus.COMPLETED);
        
        stats.put("totalTasks", totalTasks);
        stats.put("pendingTasks", pendingTasks);
        stats.put("inProgressTasks", inProgressTasks);
        stats.put("completedTasks", completedTasks);
        stats.put("completionRate", totalTasks > 0 ? 
            Math.round((double) completedTasks / totalTasks * 10000.0) / 100.0 : 0.0);
        
        return stats;
    }
}

