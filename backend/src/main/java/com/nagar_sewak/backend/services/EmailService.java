package com.nagar_sewak.backend.services;

import com.nagar_sewak.backend.entities.*;
import com.nagar_sewak.backend.repositories.EmailHistoryRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailHistoryRepository emailHistoryRepository;
    private final EmailTemplateService emailTemplateService;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.email.enabled:true}")
    private boolean emailEnabled;

    @Value("${app.email.retry.maxAttempts:3}")
    private int maxRetryAttempts;

    /**
     * Send security alert email asynchronously
     */
    @Async
    public CompletableFuture<Boolean> sendSecurityAlert(String userEmail, String ipAddress, String location, 
                                                       LocalDateTime timestamp, String alertType) {
        EmailTemplateService.EmailContent content = emailTemplateService.createSecurityAlert(
            userEmail, ipAddress, location, timestamp, alertType);
        
        return sendEmailWithHistory(userEmail, content.getSubject(), content.getContent(), 
                                  EmailTemplateType.SECURITY_ALERT);
    }

    /**
     * Send account locked notification email asynchronously
     */
    @Async
    public CompletableFuture<Boolean> sendAccountLockedAlert(String userEmail, String ipAddress, String location,
                                                           LocalDateTime lockTime, long lockDurationMinutes) {
        EmailTemplateService.EmailContent content = emailTemplateService.createAccountLockedAlert(
            userEmail, ipAddress, location, lockTime, lockDurationMinutes);
        
        return sendEmailWithHistory(userEmail, content.getSubject(), content.getContent(), 
                                  EmailTemplateType.ACCOUNT_LOCKED);
    }

    /**
     * Send new device login alert email asynchronously
     */
    @Async
    public CompletableFuture<Boolean> sendNewDeviceAlert(String userEmail, String deviceInfo, String browserType,
                                                        String operatingSystem, String ipAddress, String location,
                                                        LocalDateTime loginTime, String confirmationToken) {
        EmailTemplateService.EmailContent content = emailTemplateService.createNewDeviceAlert(
            userEmail, deviceInfo, browserType, operatingSystem, ipAddress, location, loginTime, confirmationToken);
        
        return sendEmailWithHistory(userEmail, content.getSubject(), content.getContent(), 
                                  EmailTemplateType.NEW_DEVICE_LOGIN);
    }

    /**
     * Send HTML email with history tracking and retry mechanism
     */
    @Async
    @Retryable(value = {MessagingException.class}, maxAttempts = 3, backoff = @Backoff(delay = 1000, multiplier = 2))
    public CompletableFuture<Boolean> sendEmailWithHistory(String to, String subject, String htmlBody, 
                                                          EmailTemplateType templateType) {
        // Create email history record
        EmailHistory emailHistory = EmailHistory.builder()
                .recipientEmail(to)
                .subject(subject)
                .templateType(templateType)
                .status(EmailStatus.PENDING)
                .build();
        
        emailHistory = emailHistoryRepository.save(emailHistory);

        if (!emailEnabled) {
            log.info("Email sending is disabled. Would have sent email to: {}", to);
            emailHistory.setStatus(EmailStatus.SENT);
            emailHistoryRepository.save(emailHistory);
            return CompletableFuture.completedFuture(true);
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            
            mailSender.send(message);
            
            // Update history as sent
            emailHistory.setStatus(EmailStatus.SENT);
            emailHistoryRepository.save(emailHistory);
            
            log.info("Email sent successfully to: {} with template type: {}", to, templateType);
            return CompletableFuture.completedFuture(true);
            
        } catch (MessagingException e) {
            // Update history as failed
            emailHistory.setStatus(EmailStatus.FAILED);
            emailHistory.setErrorMessage(e.getMessage());
            emailHistory.setRetryCount(emailHistory.getRetryCount() + 1);
            emailHistory.setLastRetryAt(LocalDateTime.now());
            emailHistoryRepository.save(emailHistory);
            
            log.error("Failed to send email to: {} with template type: {}", to, templateType, e);
            return CompletableFuture.completedFuture(false);
        }
    }

    @Async
    public void sendSimpleEmail(String to, String subject, String body) {
        sendEmailWithHistory(to, subject, body, null);
    }

    @Async
    public void sendHtmlEmail(String to, String subject, String htmlBody) {
        sendEmailWithHistory(to, subject, htmlBody, null);
    }

    @Async
    public void sendEmailWithAttachment(String to, String subject, String htmlBody, 
                                       byte[] attachment, String attachmentName) {
        if (!emailEnabled) {
            log.info("Email sending is disabled. Would have sent email with attachment to: {}", to);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            
            if (attachment != null && attachment.length > 0) {
                helper.addAttachment(attachmentName, new ByteArrayResource(attachment));
            }
            
            mailSender.send(message);
            log.info("Email with attachment sent successfully to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email with attachment to: {}", to, e);
        }
    }

    /**
     * Retry failed emails
     */
    @Async
    public void retryFailedEmails() {
        List<EmailHistory> failedEmails = emailHistoryRepository.findFailedEmailsForRetry(maxRetryAttempts);
        
        for (EmailHistory emailHistory : failedEmails) {
            if (emailHistory.getRetryCount() < maxRetryAttempts) {
                log.info("Retrying email to: {} (attempt {})", emailHistory.getRecipientEmail(), 
                        emailHistory.getRetryCount() + 1);
                
                // For retry, we'll use a simple HTML email since we don't have the original template variables
                sendEmailWithHistory(emailHistory.getRecipientEmail(), emailHistory.getSubject(), 
                                   "This is a retry of a previously failed email.", emailHistory.getTemplateType());
            }
        }
    }

    /**
     * Get email delivery statistics
     */
    public EmailDeliveryStats getDeliveryStats() {
        long totalSent = emailHistoryRepository.countByStatus(EmailStatus.SENT);
        long totalFailed = emailHistoryRepository.countByStatus(EmailStatus.FAILED);
        long totalPending = emailHistoryRepository.countByStatus(EmailStatus.PENDING);
        
        return new EmailDeliveryStats(totalSent, totalFailed, totalPending);
    }

    /**
     * Get recent email history
     */
    public List<EmailHistory> getRecentEmailHistory() {
        return emailHistoryRepository.findTop100ByOrderBySentAtDesc();
    }

    @Async
    public void sendBulkEmail(String[] recipients, String subject, String htmlBody) {
        if (!emailEnabled) {
            log.info("Email sending is disabled. Would have sent bulk email to {} recipients", recipients.length);
            return;
        }

        for (String recipient : recipients) {
            sendHtmlEmail(recipient, subject, htmlBody);
        }
    }

    /**
     * Inner class for email delivery statistics
     */
    public static class EmailDeliveryStats {
        private final long totalSent;
        private final long totalFailed;
        private final long totalPending;

        public EmailDeliveryStats(long totalSent, long totalFailed, long totalPending) {
            this.totalSent = totalSent;
            this.totalFailed = totalFailed;
            this.totalPending = totalPending;
        }

        public long getTotalSent() { return totalSent; }
        public long getTotalFailed() { return totalFailed; }
        public long getTotalPending() { return totalPending; }
        public long getTotal() { return totalSent + totalFailed + totalPending; }
        public double getSuccessRate() { 
            long total = getTotal();
            return total > 0 ? (double) totalSent / total * 100 : 0; 
        }
    }
}
