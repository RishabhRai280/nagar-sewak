package com.nagar_sewak.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "email_history", indexes = {
    @Index(name = "idx_recipient_email", columnList = "recipient_email"),
    @Index(name = "idx_template_type", columnList = "template_type"),
    @Index(name = "idx_sent_at", columnList = "sent_at"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_recipient_status", columnList = "recipient_email,status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recipient_email", nullable = false, length = 255)
    private String recipientEmail;

    @Enumerated(EnumType.STRING)
    @Column(name = "template_type", length = 50)
    private EmailTemplateType templateType;

    @Column(nullable = false, length = 500)
    private String subject;

    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EmailStatus status = EmailStatus.PENDING;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "retry_count")
    @Builder.Default
    private Integer retryCount = 0;

    @Column(name = "last_retry_at")
    private LocalDateTime lastRetryAt;

    @PrePersist
    protected void onCreate() {
        if (sentAt == null) {
            sentAt = LocalDateTime.now();
        }
        if (status == null) {
            status = EmailStatus.PENDING;
        }
        if (retryCount == null) {
            retryCount = 0;
        }
    }
}