package com.nagar_sewak.backend.services;

import com.nagar_sewak.backend.entities.EmailTemplate;
import com.nagar_sewak.backend.entities.EmailTemplateType;
import com.nagar_sewak.backend.repositories.EmailTemplateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailTemplateService {

    private final EmailTemplateRepository emailTemplateRepository;
    private final TemplateEngine templateEngine;

    @Value("${app.name:Nagar Sewak}")
    private String appName;

    @Value("${app.url:http://localhost:3000}")
    private String appUrl;

    @Value("${app.support.email:support@nagarsewak.com}")
    private String supportEmail;

    /**
     * Render email template with variables
     */
    public String renderTemplate(EmailTemplateType type, Map<String, Object> variables) {
        return renderTemplate(type, variables, "en");
    }

    /**
     * Render email template with variables and language
     */
    public String renderTemplate(EmailTemplateType type, Map<String, Object> variables, String language) {
        EmailTemplate template = getTemplate(type, language);
        if (template == null) {
            log.error("No template found for type: {} and language: {}", type, language);
            return getDefaultTemplate(type, variables);
        }

        try {
            // Create Thymeleaf context
            Context context = new Context();
            
            // Add common variables
            context.setVariable("appName", appName);
            context.setVariable("appUrl", appUrl);
            context.setVariable("supportEmail", supportEmail);
            context.setVariable("currentYear", LocalDateTime.now().getYear());
            context.setVariable("timestamp", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            
            // Add custom variables
            if (variables != null) {
                variables.forEach(context::setVariable);
            }

            // Process template - use template name directly for file-based templates
            String templateName = template.getHtmlContent();
            if (!templateName.startsWith("email/")) {
                templateName = "email/" + templateName;
            }
            return templateEngine.process(templateName, context);
        } catch (Exception e) {
            log.error("Error rendering template for type: {} and language: {}", type, language, e);
            return getDefaultTemplate(type, variables);
        }
    }

    /**
     * Get template subject with variable substitution
     */
    public String renderSubject(EmailTemplateType type, Map<String, Object> variables) {
        return renderSubject(type, variables, "en");
    }

    /**
     * Get template subject with variable substitution and language
     */
    public String renderSubject(EmailTemplateType type, Map<String, Object> variables, String language) {
        EmailTemplate template = getTemplate(type, language);
        if (template == null) {
            return getDefaultSubject(type);
        }

        String subject = template.getSubject();
        
        // Simple variable substitution for subject
        if (variables != null) {
            for (Map.Entry<String, Object> entry : variables.entrySet()) {
                String placeholder = "${" + entry.getKey() + "}";
                if (subject.contains(placeholder)) {
                    subject = subject.replace(placeholder, String.valueOf(entry.getValue()));
                }
            }
        }
        
        return subject;
    }

    /**
     * Create security alert email content
     */
    public EmailContent createSecurityAlert(String userEmail, String ipAddress, String location, 
                                          LocalDateTime timestamp, String alertType) {
        Map<String, Object> variables = Map.of(
            "userEmail", userEmail,
            "ipAddress", ipAddress,
            "location", location,
            "alertTimestamp", timestamp.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
            "alertType", alertType
        );

        String subject = renderSubject(EmailTemplateType.SECURITY_ALERT, variables);
        String content = renderTemplate(EmailTemplateType.SECURITY_ALERT, variables);

        return new EmailContent(subject, content);
    }

    /**
     * Create account locked email content
     */
    public EmailContent createAccountLockedAlert(String userEmail, String ipAddress, String location,
                                               LocalDateTime lockTime, long lockDurationMinutes) {
        Map<String, Object> variables = Map.of(
            "userEmail", userEmail,
            "ipAddress", ipAddress,
            "location", location,
            "lockTimestamp", lockTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
            "lockDurationMinutes", lockDurationMinutes,
            "unlockTime", lockTime.plusMinutes(lockDurationMinutes).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        );

        String subject = renderSubject(EmailTemplateType.ACCOUNT_LOCKED, variables);
        String content = renderTemplate(EmailTemplateType.ACCOUNT_LOCKED, variables);

        return new EmailContent(subject, content);
    }

    /**
     * Create new device login alert email content
     */
    public EmailContent createNewDeviceAlert(String userEmail, String deviceInfo, String browserType,
                                           String operatingSystem, String ipAddress, String location,
                                           LocalDateTime loginTime, String confirmationToken) {
        Map<String, Object> variables = Map.of(
            "userEmail", userEmail,
            "deviceInfo", deviceInfo,
            "browserType", browserType,
            "operatingSystem", operatingSystem,
            "ipAddress", ipAddress,
            "location", location,
            "loginTimestamp", loginTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")),
            "confirmationToken", confirmationToken,
            "confirmUrl", appUrl + "/auth/confirm-device?token=" + confirmationToken,
            "secureAccountUrl", appUrl + "/auth/secure-account?token=" + confirmationToken
        );

        String subject = renderSubject(EmailTemplateType.NEW_DEVICE_LOGIN, variables);
        String content = renderTemplate(EmailTemplateType.NEW_DEVICE_LOGIN, variables);

        return new EmailContent(subject, content);
    }

    /**
     * Create password reset email content
     */
    public EmailContent createPasswordResetEmail(String userEmail, String resetToken, String userName) {
        Map<String, Object> variables = Map.of(
            "userEmail", userEmail,
            "userName", userName,
            "resetToken", resetToken,
            "resetUrl", appUrl + "/auth/reset-password?token=" + resetToken,
            "expiryTime", "1 hour"
        );

        String subject = renderSubject(EmailTemplateType.PASSWORD_RESET, variables);
        String content = renderTemplate(EmailTemplateType.PASSWORD_RESET, variables);

        return new EmailContent(subject, content);
    }

    /**
     * Get template by type and language
     */
    private EmailTemplate getTemplate(EmailTemplateType type, String language) {
        // Try to find template for specific language
        Optional<EmailTemplate> template = emailTemplateRepository.findByTypeAndLanguageAndActiveTrue(type, language);
        
        if (template.isPresent()) {
            return template.get();
        }

        // Fallback to default language (English)
        if (!"en".equals(language)) {
            template = emailTemplateRepository.findByTypeAndLanguageAndActiveTrue(type, "en");
            if (template.isPresent()) {
                return template.get();
            }
        }

        // Fallback to any active template of this type
        template = emailTemplateRepository.findByTypeAndActiveTrueOrderByLanguageAsc(type);
        return template.orElse(null);
    }

    /**
     * Get default template content when no template is found
     */
    private String getDefaultTemplate(EmailTemplateType type, Map<String, Object> variables) {
        switch (type) {
            case SECURITY_ALERT:
                return createDefaultSecurityAlert(variables);
            case ACCOUNT_LOCKED:
                return createDefaultAccountLocked(variables);
            case NEW_DEVICE_LOGIN:
                return createDefaultNewDeviceAlert(variables);
            case PASSWORD_RESET:
                return createDefaultPasswordReset(variables);
            default:
                return createGenericTemplate(type, variables);
        }
    }

    /**
     * Get default subject when no template is found
     */
    private String getDefaultSubject(EmailTemplateType type) {
        switch (type) {
            case SECURITY_ALERT:
                return "Security Alert - " + appName;
            case ACCOUNT_LOCKED:
                return "Account Temporarily Locked - " + appName;
            case NEW_DEVICE_LOGIN:
                return "New Device Login Detected - " + appName;
            case PASSWORD_RESET:
                return "Password Reset Request - " + appName;
            default:
                return "Notification - " + appName;
        }
    }

    private String createDefaultSecurityAlert(Map<String, Object> variables) {
        return String.format("""
            <html>
            <body>
                <h2>Security Alert</h2>
                <p>We detected suspicious activity on your %s account.</p>
                <p><strong>Details:</strong></p>
                <ul>
                    <li>Time: %s</li>
                    <li>IP Address: %s</li>
                    <li>Location: %s</li>
                </ul>
                <p>If this was not you, please contact support immediately at %s</p>
                <p>Best regards,<br>%s Team</p>
            </body>
            </html>
            """, 
            appName,
            variables.get("alertTimestamp"),
            variables.get("ipAddress"),
            variables.get("location"),
            supportEmail,
            appName
        );
    }

    private String createDefaultAccountLocked(Map<String, Object> variables) {
        return String.format("""
            <html>
            <body>
                <h2>Account Temporarily Locked</h2>
                <p>Your %s account has been temporarily locked due to multiple failed login attempts.</p>
                <p><strong>Details:</strong></p>
                <ul>
                    <li>Lock Time: %s</li>
                    <li>Duration: %s minutes</li>
                    <li>Unlock Time: %s</li>
                </ul>
                <p>If you did not attempt to log in, please contact support at %s</p>
                <p>Best regards,<br>%s Team</p>
            </body>
            </html>
            """,
            appName,
            variables.get("lockTimestamp"),
            variables.get("lockDurationMinutes"),
            variables.get("unlockTime"),
            supportEmail,
            appName
        );
    }

    private String createDefaultNewDeviceAlert(Map<String, Object> variables) {
        return String.format("""
            <html>
            <body>
                <h2>New Device Login Detected</h2>
                <p>We detected a login to your %s account from a new device.</p>
                <p><strong>Device Details:</strong></p>
                <ul>
                    <li>Browser: %s</li>
                    <li>Operating System: %s</li>
                    <li>IP Address: %s</li>
                    <li>Location: %s</li>
                    <li>Time: %s</li>
                </ul>
                <p>Was this you?</p>
                <p>
                    <a href="%s" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Yes, it was me</a>
                    <a href="%s" style="background-color: #f44336; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-left: 10px;">No, secure my account</a>
                </p>
                <p>Best regards,<br>%s Team</p>
            </body>
            </html>
            """,
            appName,
            variables.get("browserType"),
            variables.get("operatingSystem"),
            variables.get("ipAddress"),
            variables.get("location"),
            variables.get("loginTimestamp"),
            variables.get("confirmUrl"),
            variables.get("secureAccountUrl"),
            appName
        );
    }

    private String createDefaultPasswordReset(Map<String, Object> variables) {
        return String.format("""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #1e3a8a; margin-bottom: 20px;">Password Reset Request</h2>
                    <p>Hello %s,</p>
                    <p>We received a request to reset your password for your %s account.</p>
                    <p>Click the button below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="%s" style="background-color: #1e3a8a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Reset Password</a>
                    </div>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">%s</p>
                    <p><strong>This link will expire in %s.</strong></p>
                    <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                    <p style="font-size: 12px; color: #666;">
                        For security reasons, this link will only work once and will expire after %s.<br>
                        If you need help, contact us at %s
                    </p>
                    <p>Best regards,<br><strong>%s Team</strong></p>
                </div>
            </body>
            </html>
            """,
            variables.get("userName"),
            appName,
            variables.get("resetUrl"),
            variables.get("resetUrl"),
            variables.get("expiryTime"),
            variables.get("expiryTime"),
            supportEmail,
            appName
        );
    }

    private String createGenericTemplate(EmailTemplateType type, Map<String, Object> variables) {
        return String.format("""
            <html>
            <body>
                <h2>%s Notification</h2>
                <p>This is a notification from %s.</p>
                <p>If you have any questions, please contact support at %s</p>
                <p>Best regards,<br>%s Team</p>
            </body>
            </html>
            """,
            type.name().replace("_", " "),
            appName,
            supportEmail,
            appName
        );
    }

    /**
     * Inner class to hold email content
     */
    public static class EmailContent {
        private final String subject;
        private final String content;

        public EmailContent(String subject, String content) {
            this.subject = subject;
            this.content = content;
        }

        public String getSubject() {
            return subject;
        }

        public String getContent() {
            return content;
        }
    }
}