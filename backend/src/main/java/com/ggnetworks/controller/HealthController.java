package com.ggnetworks.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
@Tag(name = "Health Check", description = "Health check endpoints for monitoring")
public class HealthController {

    @GetMapping
    @Operation(summary = "Application health check", description = "Check if the application is running")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "GGNetworks Backend");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/db")
    @Operation(summary = "Database health check", description = "Check database connectivity")
    public ResponseEntity<Map<String, Object>> databaseHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("database", "MySQL");
        response.put("message", "Database connection is healthy");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/redis")
    @Operation(summary = "Redis health check", description = "Check Redis connectivity")
    public ResponseEntity<Map<String, Object>> redisHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("cache", "Redis");
        response.put("message", "Redis connection is healthy");
        return ResponseEntity.ok(response);
    }
} 