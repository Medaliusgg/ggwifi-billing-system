package com.ggnetworks.service;

import com.ggnetworks.entity.Project;
import com.ggnetworks.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public Project createProject(Project project) {
        if (projectRepository.existsByNameIgnoreCase(project.getName())) {
            throw new IllegalArgumentException("Project with this name already exists");
        }
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, Project updatedProject) {
        Project existing = projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        existing.setName(updatedProject.getName());
        existing.setDescription(updatedProject.getDescription());
        existing.setLocationName(updatedProject.getLocationName());
        existing.setLocationCoordinates(updatedProject.getLocationCoordinates());
        existing.setStatus(updatedProject.getStatus());
        existing.setPriority(updatedProject.getPriority());
        existing.setLeadSource(updatedProject.getLeadSource());
        existing.setContactPerson(updatedProject.getContactPerson());
        existing.setContactPhone(updatedProject.getContactPhone());
        existing.setTargetLaunchDate(updatedProject.getTargetLaunchDate());
        existing.setEstimatedBudget(updatedProject.getEstimatedBudget());
        existing.setExpectedRevenue(updatedProject.getExpectedRevenue());
        existing.setHighlighted(updatedProject.getHighlighted());
        existing.setNotes(updatedProject.getNotes());

        return projectRepository.save(existing);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    public Map<String, Object> getProjectStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProjects", projectRepository.count());
        for (Project.ProjectStatus status : Project.ProjectStatus.values()) {
            stats.put(status.name().toLowerCase(), projectRepository.countByStatus(status));
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime next30Days = now.plusDays(30);

        List<Project> upcoming = projectRepository.findByTargetLaunchDateBetween(now, next30Days);
        stats.put("upcomingLaunches", upcoming.size());

        stats.put("highlightedProjects", projectRepository.findByHighlightedTrue().size());
        return stats;
    }

    public List<Project> getProjectsByStatus(Project.ProjectStatus status) {
        return projectRepository.findByStatus(status);
    }

    public List<Project> getHighlightedProjects() {
        return projectRepository.findByHighlightedTrue();
    }

    public List<Project> getProjectsLaunchingSoon() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime next30Days = now.plusDays(30);
        return projectRepository.findByTargetLaunchDateBetween(now, next30Days);
    }
    
    /**
     * Get project analytics for hotspot deployments
     */
    public Map<String, Object> getProjectAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        List<Project> projects = projectRepository.findAll();
        
        // Status breakdown
        Map<String, Long> statusCounts = projects.stream()
            .collect(java.util.stream.Collectors.groupingBy(
                p -> p.getStatus() != null ? p.getStatus().name() : "UNKNOWN",
                java.util.stream.Collectors.counting()
            ));
        
        // Priority breakdown
        Map<String, Long> priorityCounts = projects.stream()
            .filter(p -> p.getPriority() != null)
            .collect(java.util.stream.Collectors.groupingBy(
                p -> p.getPriority().name(),
                java.util.stream.Collectors.counting()
            ));
        
        // Upcoming launches
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime next30Days = now.plusDays(30);
        long upcomingLaunches = projectRepository.findByTargetLaunchDateBetween(now, next30Days).size();
        
        // Highlighted projects
        long highlightedProjects = projectRepository.findByHighlightedTrue().size();
        
        // Total budget and revenue
        java.math.BigDecimal totalBudget = projects.stream()
            .map(Project::getEstimatedBudget)
            .filter(b -> b != null)
            .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
        
        java.math.BigDecimal totalRevenue = projects.stream()
            .map(Project::getExpectedRevenue)
            .filter(r -> r != null)
            .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
        
        analytics.put("totalProjects", projects.size());
        analytics.put("byStatus", statusCounts);
        analytics.put("byPriority", priorityCounts);
        analytics.put("upcomingLaunches", upcomingLaunches);
        analytics.put("highlightedProjects", highlightedProjects);
        analytics.put("totalBudget", totalBudget);
        analytics.put("totalExpectedRevenue", totalRevenue);
        analytics.put("generatedAt", LocalDateTime.now().toString());
        
        return analytics;
    }
}

