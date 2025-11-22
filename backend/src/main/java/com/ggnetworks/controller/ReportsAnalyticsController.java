package com.ggnetworks.controller;

import com.ggnetworks.entity.Report;
import com.ggnetworks.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admin/reports-analytics")
@CrossOrigin(origins = "*")
public class ReportsAnalyticsController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/reports")
    public ResponseEntity<Map<String, Object>> getReports(
            @RequestParam(required = false) Report.ReportType reportType
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Report> reports = (reportType != null)
                    ? reportService.getReportsByType(reportType)
                    : reportService.getAllReports();
            response.put("status", "success");
            response.put("message", "Reports retrieved successfully");
            response.put("data", reports);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to fetch reports: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/reports/{id}")
    public ResponseEntity<Map<String, Object>> getReportById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<Report> report = reportService.getReportById(id);
            if (report.isPresent()) {
                response.put("status", "success");
                response.put("message", "Report retrieved successfully");
                response.put("data", report.get());
                return ResponseEntity.ok(response);
            }
            response.put("status", "error");
            response.put("message", "Report not found");
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve report: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/reports")
    public ResponseEntity<Map<String, Object>> createReport(@RequestBody Report report) {
        Map<String, Object> response = new HashMap<>();
        try {
            Report created = reportService.createReport(report);
            response.put("status", "success");
            response.put("message", "Report created successfully");
            response.put("data", created);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to create report: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/reports/{id}")
    public ResponseEntity<Map<String, Object>> updateReport(
            @PathVariable Long id,
            @RequestBody Report report
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            Report updated = reportService.updateReport(id, report);
            response.put("status", "success");
            response.put("message", "Report updated successfully");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update report: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/reports/{id}")
    public ResponseEntity<Map<String, Object>> deleteReport(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            reportService.deleteReport(id);
            response.put("status", "success");
            response.put("message", "Report deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to delete report: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/reports/statistics")
    public ResponseEntity<Map<String, Object>> getReportStatistics() {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> stats = reportService.getReportStatistics();
            response.put("status", "success");
            response.put("message", "Report statistics retrieved");
            response.put("data", stats);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to load report statistics: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/reports/generate/financial")
    public ResponseEntity<Map<String, Object>> generateFinancialReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        return buildReportResponse(() -> reportService.generateFinancialReport(startDate, endDate),
                "Financial report generated successfully");
    }

    @GetMapping("/reports/generate/customer")
    public ResponseEntity<Map<String, Object>> generateCustomerReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        return buildReportResponse(() -> reportService.generateCustomerReport(startDate, endDate),
                "Customer report generated successfully");
    }

    @GetMapping("/reports/generate/network")
    public ResponseEntity<Map<String, Object>> generateNetworkReport() {
        return buildReportResponse(reportService::generateNetworkReport,
                "Network report generated successfully");
    }

    @GetMapping("/reports/generate/sales")
    public ResponseEntity<Map<String, Object>> generateSalesReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate
    ) {
        return buildReportResponse(() -> reportService.generateSalesReport(startDate, endDate),
                "Sales report generated successfully");
    }

    private ResponseEntity<Map<String, Object>> buildReportResponse(ReportSupplier supplier, String successMessage) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> data = supplier.get();
            response.put("status", "success");
            response.put("message", successMessage);
            response.put("data", data);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to generate report: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @FunctionalInterface
    private interface ReportSupplier {
        Map<String, Object> get();
    }
}

