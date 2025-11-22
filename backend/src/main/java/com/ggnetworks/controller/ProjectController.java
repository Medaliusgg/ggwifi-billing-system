package com.ggnetworks.controller;

import com.ggnetworks.entity.Project;
import com.ggnetworks.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admin/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getProjects(
            @RequestParam(required = false) Project.ProjectStatus status,
            @RequestParam(required = false) Boolean highlighted,
            @RequestParam(required = false) Boolean upcomingOnly
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Project> projects;

            if (Boolean.TRUE.equals(upcomingOnly)) {
                projects = projectService.getProjectsLaunchingSoon();
            } else if (Boolean.TRUE.equals(highlighted)) {
                projects = projectService.getHighlightedProjects();
            } else if (status != null) {
                projects = projectService.getProjectsByStatus(status);
            } else {
                projects = projectService.getAllProjects();
            }

            response.put("status", "success");
            response.put("message", "Projects retrieved successfully");
            response.put("data", projects);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve projects: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getProjectById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<Project> project = projectService.getProjectById(id);
            if (project.isPresent()) {
                response.put("status", "success");
                response.put("message", "Project retrieved successfully");
                response.put("data", project.get());
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Project not found");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve project: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createProject(@RequestBody Project project) {
        Map<String, Object> response = new HashMap<>();
        try {
            Project created = projectService.createProject(project);
            response.put("status", "success");
            response.put("message", "Project created successfully");
            response.put("data", created);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to create project: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProject(@PathVariable Long id, @RequestBody Project project) {
        Map<String, Object> response = new HashMap<>();
        try {
            Project updated = projectService.updateProject(id, project);
            response.put("status", "success");
            response.put("message", "Project updated successfully");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update project: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProject(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            projectService.deleteProject(id);
            response.put("status", "success");
            response.put("message", "Project deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to delete project: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PatchMapping("/{id}/highlight")
    public ResponseEntity<Map<String, Object>> toggleHighlight(
            @PathVariable Long id,
            @RequestParam(defaultValue = "true") boolean highlighted
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            Project project = projectService.getProjectById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Project not found"));
            project.setHighlighted(highlighted);
            Project updated = projectService.updateProject(id, project);
            response.put("status", "success");
            response.put("message", "Project highlight updated");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update project highlight: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getProjectStatistics() {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> stats = projectService.getProjectStatistics();
            response.put("status", "success");
            response.put("message", "Project statistics retrieved successfully");
            response.put("data", stats);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve project statistics: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getProjectAnalytics() {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> analytics = projectService.getProjectAnalytics();
            response.put("status", "success");
            response.put("message", "Project analytics retrieved successfully");
            response.put("data", analytics);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve project analytics: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}

