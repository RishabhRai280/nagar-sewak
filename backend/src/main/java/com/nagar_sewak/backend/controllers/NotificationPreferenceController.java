package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.entities.NotificationPreference;
import com.nagar_sewak.backend.entities.NotificationType;
import com.nagar_sewak.backend.entities.User;
import com.nagar_sewak.backend.repositories.UserRepository;
import com.nagar_sewak.backend.services.NotificationPreferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications/preferences")
@CrossOrigin("*")
public class NotificationPreferenceController {

    private final NotificationPreferenceService notificationPreferenceService;
    private final UserRepository userRepository;

    /**
     * Get all notification preferences for the authenticated user
     */
    @GetMapping
    public ResponseEntity<List<NotificationPreference>> getUserPreferences(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user found");
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<NotificationPreference> preferences = notificationPreferenceService.getUserPreferences(user);
        
        // If no preferences exist, initialize defaults
        if (preferences.isEmpty()) {
            notificationPreferenceService.initializeDefaultPreferences(user);
            preferences = notificationPreferenceService.getUserPreferences(user);
        }

        return ResponseEntity.ok(preferences);
    }

    /**
     * Get specific notification preference
     */
    @GetMapping("/{notificationType}")
    public ResponseEntity<NotificationPreference> getPreference(
            @PathVariable NotificationType notificationType,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user found");
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        NotificationPreference preference = notificationPreferenceService
                .getUserPreference(user, notificationType)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                        "Preference not found for notification type: " + notificationType));

        return ResponseEntity.ok(preference);
    }

    /**
     * Update a specific notification preference
     */
    @PutMapping("/{notificationType}")
    public ResponseEntity<NotificationPreference> updatePreference(
            @PathVariable NotificationType notificationType,
            @RequestBody NotificationPreferenceRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user found");
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        NotificationPreference updatedPreference = notificationPreferenceService.updatePreference(
                user, notificationType, request.isInAppEnabled(), 
                request.isEmailEnabled(), request.isPushEnabled());

        return ResponseEntity.ok(updatedPreference);
    }

    /**
     * Bulk update notification preferences
     */
    @PutMapping("/bulk")
    public ResponseEntity<Map<String, String>> updatePreferences(
            @RequestBody List<NotificationPreferenceService.NotificationPreferenceUpdate> updates,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user found");
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        notificationPreferenceService.updatePreferences(user, updates);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Notification preferences updated successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * Reset preferences to defaults
     */
    @PostMapping("/reset")
    public ResponseEntity<Map<String, String>> resetPreferences(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user found");
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        notificationPreferenceService.resetToDefaults(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Notification preferences reset to defaults");
        return ResponseEntity.ok(response);
    }

    /**
     * Initialize default preferences (useful for new users)
     */
    @PostMapping("/initialize")
    public ResponseEntity<Map<String, String>> initializePreferences(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user found");
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        notificationPreferenceService.initializeDefaultPreferences(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Default notification preferences initialized");
        return ResponseEntity.ok(response);
    }

    /**
     * Get available notification types
     */
    @GetMapping("/types")
    public ResponseEntity<NotificationType[]> getNotificationTypes() {
        return ResponseEntity.ok(NotificationType.values());
    }

    /**
     * Check if specific notification type is enabled for email
     */
    @GetMapping("/{notificationType}/email/enabled")
    public ResponseEntity<Map<String, Boolean>> isEmailEnabled(
            @PathVariable NotificationType notificationType,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user found");
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        boolean enabled = notificationPreferenceService.isEmailEnabled(user, notificationType);
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("enabled", enabled);
        return ResponseEntity.ok(response);
    }

    /**
     * Request DTO for notification preference updates
     */
    public static class NotificationPreferenceRequest {
        private boolean inAppEnabled;
        private boolean emailEnabled;
        private boolean pushEnabled;

        public NotificationPreferenceRequest() {}

        public boolean isInAppEnabled() { return inAppEnabled; }
        public void setInAppEnabled(boolean inAppEnabled) { this.inAppEnabled = inAppEnabled; }
        public boolean isEmailEnabled() { return emailEnabled; }
        public void setEmailEnabled(boolean emailEnabled) { this.emailEnabled = emailEnabled; }
        public boolean isPushEnabled() { return pushEnabled; }
        public void setPushEnabled(boolean pushEnabled) { this.pushEnabled = pushEnabled; }
    }
}