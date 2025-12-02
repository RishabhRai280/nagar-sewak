package com.nagar_sewak.backend.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nagar_sewak.backend.entities.*;
import com.nagar_sewak.backend.repositories.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationPreferenceRepository preferenceRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final EmailService emailService;
    private final PdfGeneratorService pdfGeneratorService;
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    // ==================== DTOs ====================
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NotificationDTO {
        private Long userId;
        private NotificationType type;
        private NotificationPriority priority;
        private String title;
        private String message;
        private String actionUrl;
        private Map<String, Object> metadata;
        private LocalDateTime expiresAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NotificationPreferenceDTO {
        private NotificationType notificationType;
        private Boolean inAppEnabled;
        private Boolean emailEnabled;
        private Boolean pushEnabled;
    }

    // ==================== Notification Methods ====================

    @Transactional
    public Notification createNotification(NotificationDTO dto) {
        log.info("Creating notification for user {} of type {}", dto.getUserId(), dto.getType());
        
        if (dto.getUserId() == null || dto.getType() == null || 
            dto.getTitle() == null || dto.getMessage() == null) {
            throw new IllegalArgumentException("Missing required fields for notification");
        }

        User user = userRepository.findById(dto.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found: " + dto.getUserId()));

        String metadataJson = null;
        if (dto.getMetadata() != null && !dto.getMetadata().isEmpty()) {
            try {
                metadataJson = objectMapper.writeValueAsString(dto.getMetadata());
            } catch (Exception e) {
                log.error("Failed to serialize metadata", e);
            }
        }

        Notification notification = Notification.builder()
            .user(user)
            .type(dto.getType())
            .priority(dto.getPriority() != null ? dto.getPriority() : NotificationPriority.MEDIUM)
            .title(dto.getTitle())
            .message(dto.getMessage())
            .actionUrl(dto.getActionUrl())
            .metadata(metadataJson)
            .expiresAt(dto.getExpiresAt())
            .isRead(false)
            .createdAt(LocalDateTime.now())
            .build();

        Notification saved = notificationRepository.save(notification);
        log.info("Notification created with ID: {}", saved.getId());
        
        // Send email notification if enabled and important
        sendEmailIfEnabled(saved, user);
        
        return saved;
    }

    private void sendEmailIfEnabled(Notification notification, User user) {
        try {
            // Check if user has email notifications enabled for this type
            NotificationPreference preference = preferenceRepository
                .findByUserAndNotificationType(user, notification.getType())
                .orElse(null);

            if (preference != null && preference.getEmailEnabled() && 
                user.getEmail() != null && isValidEmail(user.getEmail())) {
                
                // Only send email for important notifications
                if (shouldSendEmail(notification)) {
                    String emailBody = buildEmailBody(notification);
                    emailService.sendHtmlEmail(user.getEmail(), notification.getTitle(), emailBody);
                    log.info("Email notification sent to {}", user.getEmail());
                }
            }
        } catch (Exception e) {
            log.error("Failed to send email notification", e);
        }
    }

    private boolean shouldSendEmail(Notification notification) {
        // Send email for HIGH priority or specific types
        return notification.getPriority() == NotificationPriority.HIGH ||
               notification.getType() == NotificationType.TENDER_NEW_OPPORTUNITY ||
               notification.getType() == NotificationType.TENDER_BID_ACCEPTED ||
               notification.getType() == NotificationType.COMPLAINT_STATUS_CHANGED;
    }

    private String buildEmailBody(Notification notification) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
                    .content { background-color: #f9f9f9; padding: 20px; margin: 20px 0; }
                    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
                    .button { background-color: #4CAF50; color: white; padding: 10px 20px; 
                             text-decoration: none; display: inline-block; margin: 10px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Nagar Sewak</h1>
                    </div>
                    <div class="content">
                        <h2>%s</h2>
                        <p>%s</p>
                        %s
                    </div>
                    <div class="footer">
                        <p>This is an automated notification from Nagar Sewak System.</p>
                        <p>Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>
            """,
            notification.getTitle(),
            notification.getMessage(),
            notification.getActionUrl() != null ? 
                String.format("<a href='%s' class='button'>View Details</a>", notification.getActionUrl()) : ""
        );
    }

    @Transactional(readOnly = true)
    public Page<Notification> getUserNotifications(Long userId, int page, int size) {
        log.debug("Fetching notifications for user {} - page: {}, size: {}", userId, page, size);
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Pageable pageable = PageRequest.of(page, size);
        return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        log.debug("Getting unread count for user {}", userId);
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        return notificationRepository.countByUserAndIsRead(user, false);
    }

    @Transactional
    public Notification markAsRead(Long notificationId, Long userId) {
        log.info("Marking notification {} as read for user {}", notificationId, userId);
        
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));

        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to notification");
        }

        if (!notification.getIsRead()) {
            notification.setIsRead(true);
            notification.setReadAt(LocalDateTime.now());
            notification = notificationRepository.save(notification);
            log.info("Notification {} marked as read", notificationId);
        }

        return notification;
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        log.info("Marking all notifications as read for user {}", userId);
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        int updated = notificationRepository.markAllAsReadForUser(user, LocalDateTime.now());
        log.info("Marked {} notifications as read for user {}", updated, userId);
    }

    @Transactional
    public void deleteNotification(Long notificationId, Long userId) {
        log.info("Deleting notification {} for user {}", notificationId, userId);
        
        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));

        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to notification");
        }

        notificationRepository.delete(notification);
        log.info("Notification {} deleted", notificationId);
    }

    // ==================== Preference Methods ====================

    @Transactional(readOnly = true)
    public List<NotificationPreference> getUserPreferences(Long userId) {
        log.debug("Fetching preferences for user {}", userId);
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        List<NotificationPreference> preferences = preferenceRepository.findByUser(user);
        
        if (preferences.isEmpty()) {
            log.info("No preferences found for user {}, initializing defaults", userId);
            initializeDefaultPreferences(userId);
            preferences = preferenceRepository.findByUser(user);
        }

        return preferences;
    }

    @Transactional
    public List<NotificationPreference> updatePreferences(Long userId, List<NotificationPreferenceDTO> preferenceDTOs) {
        log.info("Updating preferences for user {}", userId);
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        for (NotificationPreferenceDTO dto : preferenceDTOs) {
            if (dto.getEmailEnabled() != null && dto.getEmailEnabled()) {
                if (user.getEmail() == null || !isValidEmail(user.getEmail())) {
                    throw new IllegalArgumentException("Valid email address required to enable email notifications");
                }
            }
        }

        List<NotificationPreference> updatedPreferences = new ArrayList<>();

        for (NotificationPreferenceDTO dto : preferenceDTOs) {
            NotificationPreference preference = preferenceRepository
                .findByUserAndNotificationType(user, dto.getNotificationType())
                .orElseGet(() -> NotificationPreference.builder()
                    .user(user)
                    .notificationType(dto.getNotificationType())
                    .build());

            if (dto.getInAppEnabled() != null) {
                preference.setInAppEnabled(dto.getInAppEnabled());
            }
            if (dto.getEmailEnabled() != null) {
                preference.setEmailEnabled(dto.getEmailEnabled());
            }
            if (dto.getPushEnabled() != null) {
                preference.setPushEnabled(dto.getPushEnabled());
            }

            updatedPreferences.add(preferenceRepository.save(preference));
        }

        log.info("Updated {} preferences for user {}", updatedPreferences.size(), userId);
        return updatedPreferences;
    }

    @Transactional
    public void initializeDefaultPreferences(Long userId) {
        log.info("Initializing default preferences for user {}", userId);
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        for (NotificationType type : NotificationType.values()) {
            NotificationPreference preference = NotificationPreference.builder()
                .user(user)
                .notificationType(type)
                .inAppEnabled(true)
                .emailEnabled(true)
                .pushEnabled(false)
                .build();

            preferenceRepository.save(preference);
        }

        log.info("Initialized {} default preferences for user {}", NotificationType.values().length, userId);
    }

    private boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }
}
