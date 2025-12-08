package com.ggnetworks.controller;

import com.ggnetworks.entity.Report;
import com.ggnetworks.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/admin/reports-analytics")
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

    /**
     * Get usage per plan (hotspot vs PPPoE)
     * GET /api/v1/admin/reports-analytics/usage-per-plan
     */
    @GetMapping("/usage-per-plan")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getUsagePerPlan(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("status", "success");
            response.put("data", reportService.getUsagePerPlan(startDate, endDate));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Get top customers by data usage
     * GET /api/v1/admin/reports-analytics/top-customers-usage
     */
    @GetMapping("/top-customers-usage")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getTopCustomersByUsage(
            @RequestParam(defaultValue = "10") int limit) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("status", "success");
            response.put("data", reportService.getTopCustomersByUsage(limit));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Get router uptime reports
     * GET /api/v1/admin/reports-analytics/router-uptime
     */
    @GetMapping("/router-uptime")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'TECHNICIAN')")
    public ResponseEntity<Map<String, Object>> getRouterUptimeReports() {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("status", "success");
            response.put("data", reportService.getRouterUptimeReports());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Get session duration distribution
     * GET /api/v1/admin/reports-analytics/session-duration-distribution
     */
    @GetMapping("/session-duration-distribution")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getSessionDurationDistribution() {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("status", "success");
            response.put("data", reportService.getSessionDurationDistribution());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Get peak usage times
     * GET /api/v1/admin/reports-analytics/peak-usage-times
     */
    @GetMapping("/peak-usage-times")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getPeakUsageTimes() {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("status", "success");
            response.put("data", reportService.getPeakUsageTimes());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Get failed login trends
     * GET /api/v1/admin/reports-analytics/failed-login-trends
     */
    @GetMapping("/failed-login-trends")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getFailedLoginTrends() {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("status", "success");
            response.put("data", reportService.getFailedLoginTrends());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Get device type distribution
     * GET /api/v1/admin/reports-analytics/device-type-distribution
     */
    @GetMapping("/device-type-distribution")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getDeviceTypeDistribution() {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("status", "success");
            response.put("data", reportService.getDeviceTypeDistribution());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}

