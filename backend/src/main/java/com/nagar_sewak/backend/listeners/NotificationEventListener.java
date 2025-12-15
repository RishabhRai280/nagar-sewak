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
    private final com.nagar_sewak.backend.services.EmailService emailService;
    private final com.nagar_sewak.backend.services.PdfGeneratorService pdfGeneratorService;
    private final com.nagar_sewak.backend.repositories.NotificationPreferenceRepository preferenceRepository;

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
            .actionUrl("/complaints/" + complaint.getId())
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
        
        // Send email with PDF for accepted tenders
        if ("ACCEPTED".equalsIgnoreCase(event.getNewStatus())) {
            sendTenderEmailWithPdf(tender, title, message);
        }
    }

    private void sendTenderEmailWithPdf(Tender tender, String title, String message) {
        try {
            User user = tender.getContractor().getUser();
            
            // Check if email notifications are enabled
            NotificationPreference preference = preferenceRepository
                .findByUserAndNotificationType(user, NotificationType.TENDER_BID_ACCEPTED)
                .orElse(null);

            if (preference != null && preference.getEmailEnabled() && 
                user.getEmail() != null && !user.getEmail().isEmpty()) {
                
                // Generate PDF
                byte[] pdfBytes = pdfGeneratorService.generateTenderPdf(tender);
                
                // Build email body
                String emailBody = buildTenderEmailBody(tender, message);
                
                // Send email with PDF attachment
                emailService.sendEmailWithAttachment(
                    user.getEmail(),
                    title,
                    emailBody,
                    pdfBytes,
                    "Tender_" + tender.getId() + "_Details.pdf"
                );
                
                log.info("Tender acceptance email with PDF sent to {}", user.getEmail());
            }
        } catch (Exception e) {
            log.error("Failed to send tender email with PDF", e);
        }
    }

    private String buildTenderEmailBody(Tender tender, String message) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
                    .content { background-color: #f9f9f9; padding: 20px; margin: 20px 0; }
                    .details { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #4CAF50; }
                    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Tender Bid Accepted!</h1>
                    </div>
                    <div class="content">
                        <p>Dear %s,</p>
                        <p>%s</p>
                        <div class="details">
                            <h3>Tender Details:</h3>
                            <p><strong>Tender ID:</strong> #%d</p>
                            <p><strong>Title:</strong> %s</p>
                            <p><strong>Budget:</strong> ₹%s</p>
                            <p><strong>Your Quote:</strong> ₹%s</p>
                            <p><strong>Start Date:</strong> %s</p>
                            <p><strong>End Date:</strong> %s</p>
                        </div>
                        <p>Please find the detailed tender document attached as a PDF.</p>
                        <p>We look forward to working with you on this project.</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated notification from Nagar Sewak System.</p>
                        <p>Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>
            """,
            tender.getContractor().getCompanyName(),
            message,
            tender.getId(),
            tender.getTitle(),
            tender.getBudget(),
            tender.getQuoteAmount(),
            tender.getStartDate(),
            tender.getEndDate()
        );
    }

    @EventListener
    @Async
    public void handleTenderPublished(com.nagar_sewak.backend.events.TenderPublishedEvent event) {
        log.info("Handling tender published event for tender ID: {}", event.getTender().getId());

        Tender tender = event.getTender();
        
        // Notify all contractors about new tender
        List<User> contractors = userRepository.findAll().stream()
            .filter(user -> user.getRoles() != null && user.getRoles().contains(Role.CONTRACTOR))
            .toList();

        for (User contractor : contractors) {
            try {
                Map<String, Object> metadata = new HashMap<>();
                metadata.put("tenderId", tender.getId());
                metadata.put("complaintId", tender.getComplaint().getId());
                metadata.put("budget", tender.getBudget());

                NotificationService.NotificationDTO dto = NotificationService.NotificationDTO.builder()
                    .userId(contractor.getId())
                    .type(NotificationType.TENDER_NEW_OPPORTUNITY)
                    .priority(NotificationPriority.HIGH)
                    .title("New Tender Available")
                    .message(String.format("A new tender '%s' with budget ₹%s is now available for bidding.", 
                        tender.getTitle(), tender.getBudget()))
                    .actionUrl("/tenders/" + tender.getId())
                    .metadata(metadata)
                    .build();

                notificationService.createNotification(dto);
                
                // Send email with PDF to contractors
                sendTenderPublishedEmail(contractor, tender);
                
            } catch (Exception e) {
                log.error("Failed to notify contractor {} about tender {}", contractor.getId(), tender.getId(), e);
            }
        }
        
        log.info("Notified {} contractors about new tender", contractors.size());
    }

    private void sendTenderPublishedEmail(User contractor, Tender tender) {
        try {
            // Check if email notifications are enabled
            NotificationPreference preference = preferenceRepository
                .findByUserAndNotificationType(contractor, NotificationType.TENDER_NEW_OPPORTUNITY)
                .orElse(null);

            if (preference != null && preference.getEmailEnabled() && 
                contractor.getEmail() != null && !contractor.getEmail().isEmpty()) {
                
                // Generate PDF
                byte[] pdfBytes = pdfGeneratorService.generateTenderPdf(tender);
                
                // Build email body
                String emailBody = buildTenderPublishedEmailBody(contractor, tender);
                
                // Send email with PDF attachment
                emailService.sendEmailWithAttachment(
                    contractor.getEmail(),
                    "New Tender Available - " + tender.getTitle(),
                    emailBody,
                    pdfBytes,
                    "Tender_" + tender.getId() + "_Details.pdf"
                );
                
                log.info("Tender published email with PDF sent to {}", contractor.getEmail());
            }
        } catch (Exception e) {
            log.error("Failed to send tender published email", e);
        }
    }

    private String buildTenderPublishedEmailBody(User contractor, Tender tender) {
        String contractorName = "Contractor";
        if (contractor.getUsername() != null) {
            contractorName = contractor.getUsername();
        }
        
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
                    .content { background-color: #f9f9f9; padding: 20px; margin: 20px 0; }
                    .details { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #2196F3; }
                    .button { background-color: #2196F3; color: white; padding: 12px 24px; 
                             text-decoration: none; display: inline-block; margin: 15px 0; border-radius: 4px; }
                    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📢 New Tender Opportunity</h1>
                    </div>
                    <div class="content">
                        <p>Dear %s,</p>
                        <p>A new tender has been published that matches your profile. We invite you to review and submit your bid.</p>
                        <div class="details">
                            <h3>Tender Details:</h3>
                            <p><strong>Tender ID:</strong> #%d</p>
                            <p><strong>Title:</strong> %s</p>
                            <p><strong>Description:</strong> %s</p>
                            <p><strong>Budget:</strong> ₹%s</p>
                            <p><strong>Bid Start Date:</strong> %s</p>
                            <p><strong>Bid End Date:</strong> %s</p>
                            <p><strong>Status:</strong> %s</p>
                        </div>
                        <p>Please find the complete tender document attached as a PDF for your reference.</p>
                        <p style="text-align: center;">
                            <a href="http://localhost:3000/tenders/%d" class="button">View Tender & Submit Bid</a>
                        </p>
                        <p><strong>Important:</strong> Please submit your bid before the deadline.</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated notification from Nagar Sewak System.</p>
                        <p>Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>
            """,
            contractorName,
            tender.getId(),
            tender.getTitle(),
            tender.getDescription(),
            tender.getBudget(),
            tender.getStartDate(),
            tender.getEndDate(),
            tender.getStatus(),
            tender.getId()
        );
    }

    @EventListener
    @Async
    public void handleProjectMilestoneCompleted(com.nagar_sewak.backend.events.ProjectMilestoneCompletedEvent event) {
        log.info("Handling project milestone completed event for project ID: {}, milestone: {}%", 
            event.getProject().getId(), event.getMilestone().getPercentage());

        com.nagar_sewak.backend.entities.Project project = event.getProject();
        com.nagar_sewak.backend.entities.ProjectMilestone milestone = event.getMilestone();
        
        // Find all citizens who filed complaints related to this project
        List<com.nagar_sewak.backend.entities.Complaint> relatedComplaints = 
            userRepository.findAll().stream()
                .flatMap(user -> {
                    try {
                        return ((java.util.Collection<com.nagar_sewak.backend.entities.Complaint>) 
                            user.getClass().getMethod("getComplaints").invoke(user)).stream();
                    } catch (Exception e) {
                        return java.util.stream.Stream.empty();
                    }
                })
                .filter(c -> c.getProject() != null && c.getProject().getId().equals(project.getId()))
                .toList();

        // Notify each citizen
        for (com.nagar_sewak.backend.entities.Complaint complaint : relatedComplaints) {
            if (complaint.getUser() == null) continue;
            
            try {
                Map<String, Object> metadata = new HashMap<>();
                metadata.put("projectId", project.getId());
                metadata.put("milestonePercentage", milestone.getPercentage());
                metadata.put("complaintId", complaint.getId());

                String milestoneLabel = getMilestoneLabel(milestone.getPercentage());
                
                NotificationService.NotificationDTO dto = NotificationService.NotificationDTO.builder()
                    .userId(complaint.getUser().getId())
                    .type(NotificationType.PROJECT_UPDATE_REQUIRED)
                    .priority(milestone.getPercentage() == 100 ? NotificationPriority.HIGH : NotificationPriority.MEDIUM)
                    .title("Project Progress Update: " + milestoneLabel)
                    .message(String.format("The project '%s' has reached %d%% completion. %s", 
                        project.getTitle(), milestone.getPercentage(), milestone.getNotes()))
                    .actionUrl("/projects/" + project.getId())
                    .metadata(metadata)
                    .build();

                notificationService.createNotification(dto);
                
                // Send email for major milestones (50%, 100%)
                if (milestone.getPercentage() == 50 || milestone.getPercentage() == 100) {
                    sendMilestoneEmail(complaint.getUser(), project, milestone);
                }
                
            } catch (Exception e) {
                log.error("Failed to notify citizen {} about milestone", complaint.getUser().getId(), e);
            }
        }
        
        log.info("Notified {} citizens about milestone completion", relatedComplaints.size());
    }

    private String getMilestoneLabel(Integer percentage) {
        return switch (percentage) {
            case 0 -> "Project Started";
            case 25 -> "25% Complete - Foundation Work";
            case 50 -> "50% Complete - Halfway There!";
            case 75 -> "75% Complete - Almost Done";
            case 100 -> "100% Complete - Project Finished!";
            default -> percentage + "% Complete";
        };
    }

    private void sendMilestoneEmail(User citizen, com.nagar_sewak.backend.entities.Project project, 
                                   com.nagar_sewak.backend.entities.ProjectMilestone milestone) {
        try {
            NotificationPreference preference = preferenceRepository
                .findByUserAndNotificationType(citizen, NotificationType.PROJECT_UPDATE_REQUIRED)
                .orElse(null);

            if (preference != null && preference.getEmailEnabled() && 
                citizen.getEmail() != null && !citizen.getEmail().isEmpty()) {
                
                String emailBody = buildMilestoneEmailBody(citizen, project, milestone);
                
                emailService.sendHtmlEmail(
                    citizen.getEmail(),
                    "Project Progress Update: " + getMilestoneLabel(milestone.getPercentage()),
                    emailBody
                );
                
                log.info("Milestone email sent to {}", citizen.getEmail());
            }
        } catch (Exception e) {
            log.error("Failed to send milestone email", e);
        }
    }

    private String buildMilestoneEmailBody(User citizen, com.nagar_sewak.backend.entities.Project project, 
                                          com.nagar_sewak.backend.entities.ProjectMilestone milestone) {
        String citizenName = citizen.getUsername();
        String milestoneLabel = getMilestoneLabel(milestone.getPercentage());
        
        // Build photo gallery HTML
        StringBuilder photoGallery = new StringBuilder();
        if (milestone.getPhotoUrls() != null && !milestone.getPhotoUrls().isEmpty()) {
            String[] photos = milestone.getPhotoUrls().split(",");
            photoGallery.append("<div style='margin: 15px 0;'><h4>Progress Photos:</h4><div style='display: flex; gap: 10px; flex-wrap: wrap;'>");
            for (String photo : photos) {
                photoGallery.append(String.format(
                    "<img src='http://localhost:8080/uploads/projects/%s' style='width: 150px; height: 150px; object-fit: cover; border-radius: 8px;' />",
                    photo.trim()
                ));
            }
            photoGallery.append("</div></div>");
        }
        
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background-color: #f9f9f9; padding: 20px; margin: 0; }
                    .progress-bar { background-color: #e0e0e0; height: 30px; border-radius: 15px; overflow: hidden; margin: 20px 0; }
                    .progress-fill { background-color: #4CAF50; height: 100%%; width: %d%%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; }
                    .details { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #4CAF50; border-radius: 4px; }
                    .button { background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; display: inline-block; margin: 15px 0; border-radius: 4px; }
                    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; padding: 20px; background-color: #f5f5f5; border-radius: 0 0 8px 8px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Project Progress Update</h1>
                    </div>
                    <div class="content">
                        <p>Dear %s,</p>
                        <p>Great news! The project related to your complaint has made significant progress.</p>
                        
                        <div class="progress-bar">
                            <div class="progress-fill">%d%%</div>
                        </div>
                        
                        <div class="details">
                            <h3>%s</h3>
                            <p><strong>Project:</strong> %s</p>
                            <p><strong>Status:</strong> %s</p>
                            <p><strong>Progress:</strong> %d%% Complete</p>
                            <p><strong>Update:</strong> %s</p>
                            <p><strong>Updated:</strong> %s</p>
                        </div>
                        
                        %s
                        
                        <p style="text-align: center;">
                            <a href="http://localhost:3000/projects/%d" class="button">View Project Details</a>
                        </p>
                        
                        <p>Thank you for your patience and for being an active citizen!</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated notification from Nagar Sewak System.</p>
                        <p>You're receiving this because you filed a complaint related to this project.</p>
                    </div>
                </div>
            </body>
            </html>
            """,
            milestone.getPercentage(),
            citizenName,
            milestone.getPercentage(),
            milestoneLabel,
            project.getTitle(),
            project.getStatus(),
            milestone.getPercentage(),
            milestone.getNotes() != null ? milestone.getNotes() : "Work is progressing as planned.",
            milestone.getCompletedAt() != null ? milestone.getCompletedAt().format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")) : "Recently",
            photoGallery.toString(),
            project.getId()
        );
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
