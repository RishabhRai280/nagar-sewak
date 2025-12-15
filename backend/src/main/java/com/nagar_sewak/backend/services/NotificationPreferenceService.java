package com.nagar_sewak.backend.services;

import com.nagar_sewak.backend.entities.NotificationPreference;
import com.nagar_sewak.backend.entities.NotificationType;
import com.nagar_sewak.backend.entities.User;
import com.nagar_sewak.backend.repositories.NotificationPreferenceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationPreferenceService {

    private final NotificationPreferenceRepository notificationPreferenceRepository;

    /**
     * Get all notification preferences for a user
     */
    public List<NotificationPreference> getUserPreferences(User user) {
        return notificationPreferenceRepository.findByUser(user);
    }

    /**
     * Get specific notification preference for a user and type
     */
    public Optional<NotificationPreference> getUserPreference(User user, NotificationType type) {
        return notificationPreferenceRepository.findByUserAndNotificationType(user, type);
    }

    /**
     * Update or create notification preference
     */
    @Transactional
    public NotificationPreference updatePreference(User user, NotificationType type, 
                                                 boolean inAppEnabled, boolean emailEnabled, boolean pushEnabled) {
        
        // Check if this is a security notification that cannot be completely disabled
        if (isSecurityNotification(type) && !inAppEnabled && !emailEnabled && !pushEnabled) {
            log.warn("Attempt to disable all channels for security notification type: {} by user: {}", 
                    type, user.getId());
            // Force at least email to be enabled for security notifications
            emailEnabled = true;
        }

        Optional<NotificationPreference> existingPref = getUserPreference(user, type);
        
        NotificationPreference preference;
        if (existingPref.isPresent()) {
            preference = existingPref.get();
            preference.setInAppEnabled(inAppEnabled);
            preference.setEmailEnabled(emailEnabled);
            preference.setPushEnabled(pushEnabled);
        } else {
            preference = NotificationPreference.builder()
                    .user(user)
                    .notificationType(type)
                    .inAppEnabled(inAppEnabled)
                    .emailEnabled(emailEnabled)
                    .pushEnabled(pushEnabled)
                    .build();
        }

        NotificationPreference saved = notificationPreferenceRepository.save(preference);
        log.info("Updated notification preference for user: {} type: {} - inApp: {}, email: {}, push: {}", 
                user.getId(), type, inAppEnabled, emailEnabled, pushEnabled);
        
        return saved;
    }

    /**
     * Initialize default preferences for a new user
     */
    @Transactional
    public void initializeDefaultPreferences(User user) {
        for (NotificationType type : NotificationType.values()) {
            if (getUserPreference(user, type).isEmpty()) {
                boolean defaultEmail = isSecurityNotification(type) || isImportantNotification(type);
                boolean defaultInApp = true;
                boolean defaultPush = isSecurityNotification(type);

                NotificationPreference preference = NotificationPreference.builder()
                        .user(user)
                        .notificationType(type)
                        .inAppEnabled(defaultInApp)
                        .emailEnabled(defaultEmail)
                        .pushEnabled(defaultPush)
                        .build();

                notificationPreferenceRepository.save(preference);
            }
        }
        log.info("Initialized default notification preferences for user: {}", user.getId());
    }

    /**
     * Check if user has email notifications enabled for a specific type
     */
    public boolean isEmailEnabled(User user, NotificationType type) {
        Optional<NotificationPreference> preference = getUserPreference(user, type);
        if (preference.isPresent()) {
            return preference.get().getEmailEnabled();
        }
        // Default behavior for security notifications
        return isSecurityNotification(type);
    }

    /**
     * Check if user has in-app notifications enabled for a specific type
     */
    public boolean isInAppEnabled(User user, NotificationType type) {
        Optional<NotificationPreference> preference = getUserPreference(user, type);
        if (preference.isPresent()) {
            return preference.get().getInAppEnabled();
        }
        // Default to enabled
        return true;
    }

    /**
     * Check if user has push notifications enabled for a specific type
     */
    public boolean isPushEnabled(User user, NotificationType type) {
        Optional<NotificationPreference> preference = getUserPreference(user, type);
        if (preference.isPresent()) {
            return preference.get().getPushEnabled();
        }
        // Default behavior for security notifications
        return isSecurityNotification(type);
    }

    /**
     * Bulk update preferences
     */
    @Transactional
    public void updatePreferences(User user, List<NotificationPreferenceUpdate> updates) {
        for (NotificationPreferenceUpdate update : updates) {
            updatePreference(user, update.getType(), update.isInAppEnabled(), 
                           update.isEmailEnabled(), update.isPushEnabled());
        }
    }

    /**
     * Reset preferences to default for a user
     */
    @Transactional
    public void resetToDefaults(User user) {
        notificationPreferenceRepository.deleteByUser(user);
        initializeDefaultPreferences(user);
        log.info("Reset notification preferences to defaults for user: {}", user.getId());
    }

    /**
     * Check if a notification type is security-related and cannot be completely disabled
     */
    private boolean isSecurityNotification(NotificationType type) {
        return type == NotificationType.SYSTEM_ALERT || 
               type == NotificationType.COMPLAINT_STATUS_CHANGED ||
               type == NotificationType.PROJECT_UPDATE_REQUIRED;
    }

    /**
     * Check if a notification type is important and should default to email enabled
     */
    private boolean isImportantNotification(NotificationType type) {
        return type == NotificationType.COMPLAINT_ASSIGNED ||
               type == NotificationType.PROJECT_COMPLETED ||
               type == NotificationType.TENDER_BID_ACCEPTED ||
               type == NotificationType.TENDER_BID_REJECTED;
    }

    /**
     * Inner class for bulk preference updates
     */
    public static class NotificationPreferenceUpdate {
        private NotificationType type;
        private boolean inAppEnabled;
        private boolean emailEnabled;
        private boolean pushEnabled;

        public NotificationPreferenceUpdate() {}

        public NotificationPreferenceUpdate(NotificationType type, boolean inAppEnabled, 
                                          boolean emailEnabled, boolean pushEnabled) {
            this.type = type;
            this.inAppEnabled = inAppEnabled;
            this.emailEnabled = emailEnabled;
            this.pushEnabled = pushEnabled;
        }

        // Getters and setters
        public NotificationType getType() { return type; }
        public void setType(NotificationType type) { this.type = type; }
        public boolean isInAppEnabled() { return inAppEnabled; }
        public void setInAppEnabled(boolean inAppEnabled) { this.inAppEnabled = inAppEnabled; }
        public boolean isEmailEnabled() { return emailEnabled; }
        public void setEmailEnabled(boolean emailEnabled) { this.emailEnabled = emailEnabled; }
        public boolean isPushEnabled() { return pushEnabled; }
        public void setPushEnabled(boolean pushEnabled) { this.pushEnabled = pushEnabled; }
    }
}