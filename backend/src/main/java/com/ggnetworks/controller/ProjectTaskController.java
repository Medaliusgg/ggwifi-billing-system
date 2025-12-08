package com.ggnetworks.controller;

import com.ggnetworks.entity.ProjectTask;
import com.ggnetworks.service.ProjectTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admin/projects/{projectId}/tasks")
public class ProjectTaskController {

    @Autowired
    private ProjectTaskService projectTaskService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createTask(
            @PathVariable Long projectId,
            @RequestBody ProjectTask task
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            task.setProjectId(projectId);
            ProjectTask created = projectTaskService.createTask(task);
            response.put("status", "success");
            response.put("message", "Task created successfully");
            response.put("data", created);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to create task: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getTasksByProject(
            @PathVariable Long projectId,
            @RequestParam(required = false) ProjectTask.TaskStatus status
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<ProjectTask> tasks = (status != null)
                    ? projectTaskService.getTasksByProjectAndStatus(projectId, status)
                    : projectTaskService.getTasksByProject(projectId);
            response.put("status", "success");
            response.put("message", "Tasks retrieved successfully");
            response.put("data", tasks);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve tasks: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<Map<String, Object>> getTaskById(
            @PathVariable Long projectId,
            @PathVariable Long taskId
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<ProjectTask> task = projectTaskService.getTaskById(taskId);
            if (task.isPresent() && task.get().getProjectId().equals(projectId)) {
                response.put("status", "success");
                response.put("message", "Task retrieved successfully");
                response.put("data", task.get());
                return ResponseEntity.ok(response);
            }
            response.put("status", "error");
            response.put("message", "Task not found");
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve task: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<Map<String, Object>> updateTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId,
            @RequestBody ProjectTask task
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            task.setProjectId(projectId);
            ProjectTask updated = projectTaskService.updateTask(taskId, task);
            response.put("status", "success");
            response.put("message", "Task updated successfully");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update task: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Map<String, Object>> deleteTask(
            @PathVariable Long projectId,
            @PathVariable Long taskId
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            projectTaskService.deleteTask(taskId);
            response.put("status", "success");
            response.put("message", "Task deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to delete task: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getTaskStatistics(@PathVariable Long projectId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> stats = projectTaskService.getTaskStatistics(projectId);
            response.put("status", "success");
            response.put("message", "Task statistics retrieved successfully");
            response.put("data", stats);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve task statistics: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}

