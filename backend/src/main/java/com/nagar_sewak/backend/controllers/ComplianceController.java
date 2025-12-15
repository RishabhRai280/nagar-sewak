package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.entities.User;
import com.nagar_sewak.backend.repositories.UserRepository;
import com.nagar_sewak.backend.services.ComplianceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/compliance")
@CrossOrigin("*")
public class ComplianceController {

    private final ComplianceService complianceService;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    /**
     * Export user data (GDPR Data Portability)
     */
    @GetMapping("/export/my-data")
    public ResponseEntity<byte[]> exportMyData(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user found");
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        try {
            Map<String, Object> userData = complianceService.exportUserData(user.getId());
            String jsonData = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(userData);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setContentDispositionFormData("attachment", "user_data_export_" + user.getId() + ".json");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(jsonData.getBytes());
                    
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                    "Failed to export user data: " + e.getMessage());
        }
    }

    /**
     * Request account deletion (GDPR Right to be Forgotten)
     */
    @DeleteMapping("/delete/my-account")
    public ResponseEntity<Map<String, String>> deleteMyAccount(
            @RequestParam(defaultValue = "true") boolean preserveAnonymizedRecords,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user found");
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        try {
            complianceService.deleteUserAccount(user.getId(), preserveAnonymizedRecords);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Account deletion request processed successfully");
            response.put("anonymized", String.valueOf(preserveAnonymizedRecords));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                    "Failed to delete account: " + e.getMessage());
        }
    }

    /**
     * Export user data by admin (Admin only)
     */
    @GetMapping("/export/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<byte[]> exportUserData(@PathVariable Long userId) {
        try {
            Map<String, Object> userData = complianceService.exportUserData(userId);
            String jsonData = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(userData);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setContentDispositionFormData("attachment", "user_data_export_" + userId + ".json");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(jsonData.getBytes());
                    
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                    "Failed to export user data: " + e.getMessage());
        }
    }

    /**
     * Delete user account by admin (Admin only)
     */
    @DeleteMapping("/delete/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, String>> deleteUserAccount(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "true") boolean preserveAnonymizedRecords) {
        
        try {
            complianceService.deleteUserAccount(userId, preserveAnonymizedRecords);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "User account deletion completed successfully");
            response.put("userId", userId.toString());
            response.put("anonymized", String.valueOf(preserveAnonymizedRecords));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                    "Failed to delete user account: " + e.getMessage());
        }
    }

    /**
     * Generate compliance report (Admin only)
     */
    @GetMapping("/report")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> getComplianceReport() {
        try {
            Map<String, Object> report = complianceService.generateComplianceReport();
            return ResponseEntity.ok(report);
            
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                    "Failed to generate compliance report: " + e.getMessage());
        }
    }

    /**
     * Validate password encryption compliance
     */
    @PostMapping("/validate/password")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> validatePasswordEncryption(
            @RequestBody PasswordValidationRequest request) {
        
        try {
            boolean isValid = complianceService.validatePasswordEncryption(
                    request.getRawPassword(), request.getEncodedPassword());
            
            Map<String, Object> response = new HashMap<>();
            response.put("valid", isValid);
            response.put("algorithm", isValid ? "BCrypt/Argon2 compliant" : "Non-compliant");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                    "Failed to validate password encryption: " + e.getMessage());
        }
    }

    /**
     * Get data retention policies
     */
    @GetMapping("/policies/retention")
    public ResponseEntity<Map<String, Object>> getDataRetentionPolicies() {
        Map<String, Object> policies = new HashMap<>();
        policies.put("auditLogs", Map.of(
            "retentionPeriod", "365 days",
            "purpose", "Security monitoring and compliance"
        ));
        policies.put("emailHistory", Map.of(
            "retentionPeriod", "90 days",
            "purpose", "Communication audit trail"
        ));
        policies.put("loginAttempts", Map.of(
            "retentionPeriod", "30 days",
            "purpose", "Security analysis"
        ));
        policies.put("deviceFingerprints", Map.of(
            "retentionPeriod", "Until user deletion",
            "purpose", "Device recognition and security"
        ));
        
        return ResponseEntity.ok(policies);
    }

    /**
     * Request DTO for password validation
     */
    public static class PasswordValidationRequest {
        private String rawPassword;
        private String encodedPassword;

        public PasswordValidationRequest() {}

        public String getRawPassword() { return rawPassword; }
        public void setRawPassword(String rawPassword) { this.rawPassword = rawPassword; }
        public String getEncodedPassword() { return encodedPassword; }
        public void setEncodedPassword(String encodedPassword) { this.encodedPassword = encodedPassword; }
    }
}