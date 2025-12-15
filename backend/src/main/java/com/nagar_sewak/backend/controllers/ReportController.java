package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.services.ReportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin("*")
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/generate-pdf")
    public ResponseEntity<?> generatePDFReport(@RequestBody Map<String, Object> reportData) {
        try {
            log.info("Generating PDF report for: {} with ID: {}", reportData.get("type"), reportData.get("id"));
            
            // Validate input data
            if (reportData.get("type") == null || reportData.get("id") == null) {
                Map<String, String> errorResponse = Map.of(
                    "error", "Missing required fields: type and id are required",
                    "type", String.valueOf(reportData.get("type")),
                    "id", String.valueOf(reportData.get("id"))
                );
                return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(errorResponse);
            }
            
            byte[] pdfBytes = reportService.generatePDFReport(reportData);
            
            if (pdfBytes == null || pdfBytes.length == 0) {
                throw new RuntimeException("Generated PDF is empty");
            }
            
            String filename = String.format("%s-%s-report.pdf", 
                reportData.get("type"), 
                reportData.get("id"));
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(pdfBytes.length);
            headers.setCacheControl("no-cache, no-store, must-revalidate");
            headers.setPragma("no-cache");
            headers.setExpires(0);
            
            log.info("Successfully generated PDF report with {} bytes", pdfBytes.length);
            
            return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
                
        } catch (Exception e) {
            log.error("Failed to generate PDF report for type: {} with ID: {}", 
                reportData.get("type"), reportData.get("id"), e);
            
            // Provide more detailed error information
            String detailedError = e.getMessage();
            if (e.getCause() != null) {
                detailedError += " (Cause: " + e.getCause().getMessage() + ")";
            }
            
            Map<String, String> errorResponse = Map.of(
                "error", "Failed to generate PDF report: " + detailedError,
                "type", String.valueOf(reportData.get("type")),
                "id", String.valueOf(reportData.get("id")),
                "timestamp", java.time.LocalDateTime.now().toString()
            );
            
            return ResponseEntity.internalServerError()
                .contentType(MediaType.APPLICATION_JSON)
                .body(errorResponse);
        }
    }

    @GetMapping("/export/{type}/{id}")
    public ResponseEntity<Map<String, Object>> exportItemData(
            @PathVariable String type,
            @PathVariable Long id) {
        try {
            Map<String, Object> exportData = reportService.exportItemData(type, id);
            return ResponseEntity.ok(exportData);
        } catch (Exception e) {
            log.error("Failed to export item data", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> health = Map.of(
            "status", "UP",
            "service", "ReportService",
            "timestamp", java.time.LocalDateTime.now().toString()
        );
        return ResponseEntity.ok(health);
    }
}