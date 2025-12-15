package com.nagar_sewak.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "login_attempts", indexes = {
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_ip_address", columnList = "ip_address"),
    @Index(name = "idx_attempt_time", columnList = "attempt_time"),
    @Index(name = "idx_email_successful", columnList = "email,successful")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(name = "ip_address", nullable = false, length = 45) // IPv6 support
    private String ipAddress;

    @Column(name = "attempt_time", nullable = false)
    private LocalDateTime attemptTime;

    @Builder.Default
    @Column(nullable = false)
    private Boolean successful = false;

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;

    @Column(length = 255)
    private String location;

    @PrePersist
    protected void onCreate() {
        if (attemptTime == null) {
            attemptTime = LocalDateTime.now();
        }
        if (successful == null) {
            successful = false;
        }
    }
}