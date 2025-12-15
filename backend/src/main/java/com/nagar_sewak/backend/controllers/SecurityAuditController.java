package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.entities.SecurityAuditLog;
import com.nagar_sewak.backend.entities.SecurityEventType;
import com.nagar_sewak.backend.entities.User;
import com.nagar_sewak.backend.repositories.UserRepository;
import com.nagar_sewak.backend.services.SecurityAuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/security/audit")
@CrossOrigin("*")
public class SecurityAuditController {

    private final SecurityAuditService securityAuditService;
    private final UserRepository userRepository;

    /**
     * Get security logs for the authenticated user
     */
    @GetMapping("/my-logs")
    public ResponseEntity<Page<SecurityAuditLog>> getMySecurityLogs(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user found");
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Sort sort = Sort.by(sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<SecurityAuditLog> logs = securityAuditService.getSecurityLogs(user.getId().toString(), pageable);
        return ResponseEntity.ok(logs);
    }

    /**
     * Get security logs within a date range for the authenticated user
     */
    @GetMapping("/my-logs/range")
    public ResponseEntity<Page<SecurityAuditLog>> getMySecurityLogsInRange(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user found");
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        Page<SecurityAuditLog> logs = securityAuditService.getUserSecurityLogsInRange(
                user.getId().toString(), start, end, pageable);
        
        return ResponseEntity.ok(logs);
    }

    /**
     * Get all security logs (Admin only)
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Page<SecurityAuditLog>> getAllSecurityLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) SecurityEventType eventType,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) String ipAddress) {

        Sort sort = Sort.by(sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<SecurityAuditLog> logs;
        
        if (eventType != null) {
            logs = securityAuditService.getSecurityLogsByType(eventType, pageable);
        } else if (userId != null) {
            logs = securityAuditService.getSecurityLogs(userId, pageable);
        } else if (ipAddress != null) {
            logs = securityAuditService.getSecurityLogsByIp(ipAddress, pageable);
        } else {
            logs = securityAuditService.getSecurityLogsInRange(
                    LocalDateTime.now().minusDays(30), LocalDateTime.now(), pageable);
        }

        return ResponseEntity.ok(logs);
    }

    /**
     * Get security logs within a date range (Admin only)
     */
    @GetMapping("/range")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Page<SecurityAuditLog>> getSecurityLogsInRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        Page<SecurityAuditLog> logs = securityAuditService.getSecurityLogsInRange(start, end, pageable);
        
        return ResponseEntity.ok(logs);
    }

    /**
     * Get recent suspicious activities (Admin only)
     */
    @GetMapping("/suspicious")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<SecurityAuditLog>> getRecentSuspiciousActivity() {
        List<SecurityAuditLog> suspiciousLogs = securityAuditService.getRecentSuspiciousActivity();
        return ResponseEntity.ok(suspiciousLogs);
    }

    /**
     * Get security event statistics (Admin only)
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, Object>> getSecurityStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        if (start == null) {
            start = LocalDateTime.now().minusDays(30);
        }
        if (end == null) {
            end = LocalDateTime.now();
        }

        List<Object[]> eventCounts = securityAuditService.getEventCountsByType(start, end);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("period", Map.of("start", start, "end", end));
        stats.put("eventCounts", eventCounts);
        
        // Calculate totals
        long totalEvents = eventCounts.stream()
                .mapToLong(row -> (Long) row[1])
                .sum();
        stats.put("totalEvents", totalEvents);

        return ResponseEntity.ok(stats);
    }

    /**
     * Search security logs by IP address (Admin only)
     */
    @GetMapping("/search/ip/{ipAddress}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Page<SecurityAuditLog>> searchByIpAddress(
            @PathVariable String ipAddress,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        Page<SecurityAuditLog> logs = securityAuditService.getSecurityLogsByIp(ipAddress, pageable);
        
        return ResponseEntity.ok(logs);
    }

    /**
     * Search security logs by user ID (Admin only)
     */
    @GetMapping("/search/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Page<SecurityAuditLog>> searchByUserId(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        Page<SecurityAuditLog> logs = securityAuditService.getSecurityLogs(userId, pageable);
        
        return ResponseEntity.ok(logs);
    }

    /**
     * Get security logs by event type (Admin only)
     */
    @GetMapping("/search/event/{eventType}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Page<SecurityAuditLog>> searchByEventType(
            @PathVariable SecurityEventType eventType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));
        Page<SecurityAuditLog> logs = securityAuditService.getSecurityLogsByType(eventType, pageable);
        
        return ResponseEntity.ok(logs);
    }
}