package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.entities.Role;
import com.nagar_sewak.backend.entities.User;
import com.nagar_sewak.backend.repositories.UserRepository;
import com.nagar_sewak.backend.services.EmailService;
import com.nagar_sewak.backend.services.EmailTemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/test/email")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin("*")
public class EmailTestController {

    private final EmailService emailService;
    private final EmailTemplateService emailTemplateService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/simple")
    public ResponseEntity<Map<String, String>> sendSimpleEmail(@RequestParam String to, @RequestParam String subject, @RequestParam String body) {
        try {
            log.info("Sending simple email to: {}", to);
            emailService.sendSimpleEmail(to, subject, body);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Email sent successfully");
            response.put("to", to);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to send simple email", e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to send email: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/password-reset")
    public ResponseEntity<Map<String, String>> sendPasswordResetEmail(@RequestParam String email, @RequestParam String userName) {
        try {
            log.info("Sending password reset email to: {}", email);
            String resetToken = "test-token-123";
            CompletableFuture<Boolean> result = emailService.sendPasswordResetEmail(email, resetToken, userName);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password reset email sent successfully");
            response.put("email", email);
            response.put("resetToken", resetToken);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to send password reset email", e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to send email: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/template-test")
    public ResponseEntity<Map<String, Object>> testTemplate() {
        try {
            log.info("Testing email template generation");
            EmailTemplateService.EmailContent content = emailTemplateService.createPasswordResetEmail(
                "test@example.com", "test-token-123", "Test User");
            
            Map<String, Object> response = new HashMap<>();
            response.put("subject", content.getSubject());
            response.put("content", content.getContent());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to generate email template", e);
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to generate template: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/delivery-stats")
    public ResponseEntity<EmailService.EmailDeliveryStats> getDeliveryStats() {
        try {
            EmailService.EmailDeliveryStats stats = emailService.getDeliveryStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Failed to get delivery stats", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/create-test-user")
    public ResponseEntity<Map<String, String>> createTestUser(@RequestParam String email, @RequestParam String name) {
        try {
            // Check if user already exists
            if (userRepository.existsByEmail(email)) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "User already exists with email: " + email);
                return ResponseEntity.ok(response);
            }

            // Create new user
            User user = new User();
            user.setEmail(email);
            user.setUsername(email.substring(0, email.indexOf('@')));
            user.setFullName(name);
            user.setPassword(passwordEncoder.encode("password123")); // Default password
            user.setRoles(Set.of(Role.CITIZEN));
            
            userRepository.save(user);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Test user created successfully");
            response.put("email", email);
            response.put("password", "password123");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to create test user", e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to create user: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/update-user-email")
    public ResponseEntity<Map<String, String>> updateUserEmail(@RequestParam String oldEmail, @RequestParam String newEmail) {
        try {
            User user = userRepository.findByEmail(oldEmail).orElse(null);
            if (user == null) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "User not found with email: " + oldEmail);
                return ResponseEntity.badRequest().body(response);
            }

            user.setEmail(newEmail);
            userRepository.save(user);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "User email updated successfully");
            response.put("oldEmail", oldEmail);
            response.put("newEmail", newEmail);
            response.put("username", user.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to update user email", e);
            Map<String, String> response = new HashMap<>();
            response.put("error", "Failed to update email: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/list-users")
    public ResponseEntity<Map<String, Object>> listUsers() {
        try {
            var users = userRepository.findAll().stream()
                .map(user -> Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "fullName", user.getFullName(),
                    "roles", user.getRoles()
                ))
                .toList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("users", users);
            response.put("count", users.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to list users", e);
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to list users: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}