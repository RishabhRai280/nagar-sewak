package com.nagar_sewak.backend.listeners;

import com.nagar_sewak.backend.entities.*;
import com.nagar_sewak.backend.events.ComplaintStatusChangedEvent;
import com.nagar_sewak.backend.events.TenderStatusChangedEvent;
import com.nagar_sewak.backend.repositories.UserRepository;
import com.nagar_sewak.backend.services.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventListener {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @EventListener
    @Async
    public void handleComplaintStatusChanged(ComplaintStatusChangedEvent event) {
        log.info("Handling complaint status change event: {} -> {}", 
            event.getOldStatus(), event.getNewStatus());

        Complaint complaint = event.getComplaint();
        
        if (complaint.getUser() == null) {
            log.warn("Complaint {} has no user, skipping notification", complaint.getId());
            return;
        }

        NotificationPriority priority = "Resolved".equalsIgnoreCase(event.getNewStatus()) 
            ? NotificationPriority.HIGH 
            : NotificationPriority.MEDIUM;

        Map<String, Object> metadata = new HashMap<>();
        metadata.put("complaintId", complaint.getId());
        metadata.put("oldStatus", event.getOldStatus());
        metadata.put("newStatus", event.getNewStatus());

        NotificationService.NotificationDTO dto = NotificationService.NotificationDTO.builder()
            .userId(complaint.getUser().getId())
            .type(NotificationType.COMPLAINT_STATUS_CHANGED)
            .priority(priority)
            .title("Complaint Status Updated")
            .message(String.format("Your complaint '%s' status changed from %s to %s", 
                complaint.getTitle(), event.getOldStatus(), event.getNewStatus()))
            .actionUrl("/dashboard/citizen/complaints/" + complaint.getId())
            .metadata(metadata)
            .build();

        notificationService.createNotification(dto);
    }

    @EventListener
    @Async
    public void handleTenderStatusChanged(TenderStatusChangedEvent event) {
        log.info("Handling tender status change event: {} -> {}", 
            event.getOldStatus(), event.getNewStatus());

        Tender tender = event.getTender();
        
        if (tender.getContractor() == null || tender.getContractor().getUser() == null) {
            log.warn("Tender {} has no contractor user, skipping notification", tender.getId());
            return;
        }

        NotificationType type;
        NotificationPriority priority;
        String title;
        String message;

        if ("ACCEPTED".equalsIgnoreCase(event.getNewStatus())) {
            type = NotificationType.TENDER_BID_ACCEPTED;
            priority = NotificationPriority.HIGH;
            title = "Tender Bid Accepted!";
            message = String.format("Congratulations! Your bid of ₹%s has been accepted.", 
                tender.getQuoteAmount());
        } else if ("REJECTED".equalsIgnoreCase(event.getNewStatus())) {
            type = NotificationType.TENDER_BID_REJECTED;
            priority = NotificationPriority.MEDIUM;
            title = "Tender Bid Not Selected";
            message = event.getRejectionReason() != null 
                ? "Your bid was not selected. Reason: " + event.getRejectionReason()
                : "Your bid was not selected for this project.";
        } else {
            return; // Only handle ACCEPTED and REJECTED
        }

        Map<String, Object> metadata = new HashMap<>();
        metadata.put("tenderId", tender.getId());
        metadata.put("complaintId", tender.getComplaint().getId());
        if (event.getRejectionReason() != null) {
            metadata.put("rejectionReason", event.getRejectionReason());
        }

        NotificationService.NotificationDTO dto = NotificationService.NotificationDTO.builder()
            .userId(tender.getContractor().getUser().getId())
            .type(type)
            .priority(priority)
            .title(title)
            .message(message)
            .actionUrl("/complaints/" + tender.getComplaint().getId() + "/tenders")
            .metadata(metadata)
            .build();

        notificationService.createNotification(dto);
    }

    // Helper method to notify all admins
    private void notifyAllAdmins(NotificationService.NotificationDTO baseDto) {
        List<User> admins = userRepository.findAll().stream()
            .filter(user -> user.getRoles() != null && user.getRoles().contains(Role.ADMIN))
            .toList();

        for (User admin : admins) {
            NotificationService.NotificationDTO adminDto = NotificationService.NotificationDTO.builder()
                .userId(admin.getId())
                .type(baseDto.getType())
                .priority(baseDto.getPriority())
                .title(baseDto.getTitle())
                .message(baseDto.getMessage())
                .actionUrl(baseDto.getActionUrl())
                .metadata(baseDto.getMetadata())
                .build();

            notificationService.createNotification(adminDto);
        }
    }
}
