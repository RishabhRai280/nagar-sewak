package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.entities.Notification;

import com.nagar_sewak.backend.entities.User;
import com.nagar_sewak.backend.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin("*")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<Page<Notification>> getNotifications(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Long userId = ((User) userDetails).getId();
        Page<Notification> notifications = notificationService.getUserNotifications(userId, page, size);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((User) userDetails).getId();
        long count = notificationService.getUnreadCount(userId);

        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = ((User) userDetails).getId();
        Notification notification = notificationService.markAsRead(id, userId);
        return ResponseEntity.ok(notification);
    }

    @PutMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllAsRead(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((User) userDetails).getId();
        notificationService.markAllAsRead(userId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "All notifications marked as read");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = ((User) userDetails).getId();
        notificationService.deleteNotification(id, userId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Notification deleted");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/test")
    public ResponseEntity<Notification> createTestNotification(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((User) userDetails).getId();

        NotificationService.NotificationDTO dto = NotificationService.NotificationDTO.builder()
                .userId(userId)
                .type(com.nagar_sewak.backend.entities.NotificationType.SYSTEM_ANNOUNCEMENT)
                .priority(com.nagar_sewak.backend.entities.NotificationPriority.MEDIUM)
                .title("Welcome to Notifications!")
                .message("This is a test notification. Your notification system is working correctly!")
                .actionUrl("/dashboard")
                .build();

        Notification notification = notificationService.createNotification(dto);
        return ResponseEntity.ok(notification);
    }
}
