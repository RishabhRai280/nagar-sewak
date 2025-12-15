package com.nagar_sewak.backend.services;

import com.nagar_sewak.backend.entities.LoginAttempt;
import com.nagar_sewak.backend.repositories.LoginAttemptRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import jakarta.servlet.http.HttpServletRequest;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class LoginAttemptServiceTest {

    @Mock
    private LoginAttemptRepository loginAttemptRepository;

    @Mock
    private RedisTemplate<String, Object> redisTemplate;

    @Mock
    private SecurityAuditService securityAuditService;

    @Mock
    private EmailService emailService;

    @Mock
    private ValueOperations<String, Object> valueOperations;

    @Mock
    private HttpServletRequest request;

    private LoginAttemptService loginAttemptService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        loginAttemptService = new LoginAttemptService(loginAttemptRepository, redisTemplate, securityAuditService, emailService);
    }

    @Test
    void testGetFailedAttempts_NoAttempts() {
        // Given
        String email = "test@example.com";
        when(valueOperations.get("login_attempts:" + email)).thenReturn(null);

        // When
        int attempts = loginAttemptService.getFailedAttempts(email);

        // Then
        assertThat(attempts).isEqualTo(0);
    }

    @Test
    void testGetFailedAttempts_WithAttempts() {
        // Given
        String email = "test@example.com";
        when(valueOperations.get("login_attempts:" + email)).thenReturn(3);

        // When
        int attempts = loginAttemptService.getFailedAttempts(email);

        // Then
        assertThat(attempts).isEqualTo(3);
    }

    @Test
    void testRecordFailedAttempt() {
        // Given
        String email = "test@example.com";
        String ipAddress = "192.168.1.1";
        when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0");
        when(request.getRemoteAddr()).thenReturn(ipAddress);
        when(valueOperations.get("login_attempts:" + email)).thenReturn(2);

        // When
        loginAttemptService.recordFailedAttempt(email, ipAddress, request);

        // Then
        verify(loginAttemptRepository).save(any(LoginAttempt.class));
        verify(valueOperations).set(eq("login_attempts:" + email), eq(3), eq(15L), eq(TimeUnit.MINUTES));
    }

    @Test
    void testRecordSuccessfulAttempt() {
        // Given
        String email = "test@example.com";
        String ipAddress = "192.168.1.1";
        when(request.getHeader("User-Agent")).thenReturn("Mozilla/5.0");
        when(request.getRemoteAddr()).thenReturn(ipAddress);

        // When
        loginAttemptService.recordSuccessfulAttempt(email, ipAddress, request);

        // Then
        verify(loginAttemptRepository).save(any(LoginAttempt.class));
        verify(redisTemplate).delete("login_attempts:" + email);
        verify(redisTemplate).delete("account_locked:" + email);
    }

    @Test
    void testIsAccountLocked() {
        // Given
        String email = "test@example.com";
        when(redisTemplate.hasKey("account_locked:" + email)).thenReturn(true);

        // When
        boolean isLocked = loginAttemptService.isAccountLocked(email);

        // Then
        assertThat(isLocked).isTrue();
    }

    @Test
    void testShouldShowWarning() {
        // Given
        String email = "test@example.com";
        when(valueOperations.get("login_attempts:" + email)).thenReturn(3);

        // When
        boolean shouldShow = loginAttemptService.shouldShowWarning(email);

        // Then
        assertThat(shouldShow).isTrue();
    }

    @Test
    void testGetWarningMessage() {
        // Given
        String email = "test@example.com";
        when(valueOperations.get("login_attempts:" + email)).thenReturn(3);

        // When
        String message = loginAttemptService.getWarningMessage(email);

        // Then
        assertThat(message).contains("3 failed login attempt(s)");
        assertThat(message).contains("2 more failed attempt(s)");
    }

    @Test
    void testGetClientIpAddress_XForwardedFor() {
        // Given
        when(request.getHeader("X-Forwarded-For")).thenReturn("203.0.113.1, 192.168.1.1");

        // When
        String ip = loginAttemptService.getClientIpAddress(request);

        // Then
        assertThat(ip).isEqualTo("203.0.113.1");
    }

    @Test
    void testGetClientIpAddress_RemoteAddr() {
        // Given
        when(request.getHeader("X-Forwarded-For")).thenReturn(null);
        when(request.getHeader("X-Real-IP")).thenReturn(null);
        when(request.getRemoteAddr()).thenReturn("192.168.1.1");

        // When
        String ip = loginAttemptService.getClientIpAddress(request);

        // Then
        assertThat(ip).isEqualTo("192.168.1.1");
    }
}