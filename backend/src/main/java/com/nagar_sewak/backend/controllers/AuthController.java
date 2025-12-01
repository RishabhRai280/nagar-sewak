package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.dto.AuthResponse;
import com.nagar_sewak.backend.dto.LoginRequest;
import com.nagar_sewak.backend.dto.RegisterRequest;
import com.nagar_sewak.backend.dto.ForgotPasswordRequest;
import com.nagar_sewak.backend.dto.ResetPasswordRequest;
import com.nagar_sewak.backend.dto.ComplaintSummaryDTO;
import com.nagar_sewak.backend.dto.UserProfileDTO;
import com.nagar_sewak.backend.entities.*;
import com.nagar_sewak.backend.repositories.UserRepository;
import com.nagar_sewak.backend.repositories.ComplaintRepository;
import com.nagar_sewak.backend.security.JwtUtil;

import lombok.RequiredArgsConstructor;

import java.util.Set;
import java.util.UUID;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final ComplaintRepository complaintRepo;
    private final PasswordEncoder encoder;
    private final AuthenticationManager manager;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        // Validate input
        if (req.getUsername() == null || req.getUsername().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is required");
        }
        if (req.getPassword() == null || req.getPassword().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters");
        }
        if (req.getEmail() == null || req.getEmail().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        if (req.getFullName() == null || req.getFullName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Full name is required");
        }

        // Check if username already exists
        if (userRepo.existsByUsername(req.getUsername())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already exists");
        }

        // Check if email already exists
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        User u = new User();
        u.setUsername(req.getUsername());
        u.setPassword(encoder.encode(req.getPassword()));
        u.setEmail(req.getEmail());
        u.setFullName(req.getFullName());
        u.setRoles(Set.of(Role.CITIZEN)); // default role

        User savedUser = userRepo.save(u);
        
        // Generate token for immediate login
        String token = jwtUtil.generateToken(savedUser.getUsername());

        AuthResponse response = AuthResponse.builder()
                .token(token)
                .message("Registration successful")
                .username(savedUser.getUsername())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .userId(savedUser.getId())
                .roles(savedUser.getRoles())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        try {
            // Validate input
            if (req.getEmail() == null || req.getEmail().trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
            }
            if (req.getPassword() == null || req.getPassword().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
            }

            // Find user by email
            User user = userRepo.findByEmail(req.getEmail())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with this email"));

            // Authenticate user using username (Spring Security uses username internally)
            manager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), req.getPassword())
            );

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getUsername());

            AuthResponse response = AuthResponse.builder()
                    .token(token)
                    .message("Login successful")
                    .username(user.getUsername())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .userId(user.getId())
                    .roles(user.getRoles())
                    .build();

            return ResponseEntity.ok(response);
        } catch (BadCredentialsException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Login failed: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    public UserProfileDTO currentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user found");
        }

        User user = userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        var complaints = complaintRepo.findByUserUsername(user.getUsername()).stream()
                .map(complaint -> {
                    String photo = complaint.getPhotoUrl();
                    String publicPhotoUrl = photo == null ? null :
                            photo.startsWith("http") ? photo : "/uploads/complaints/" + photo;

                    // Parse multiple photo URLs
                    java.util.List<String> photoUrlsList = new java.util.ArrayList<>();
                    if (complaint.getPhotoUrls() != null && !complaint.getPhotoUrls().trim().isEmpty()) {
                        String[] photos = complaint.getPhotoUrls().split(",");
                        for (String p : photos) {
                            if (!p.trim().isEmpty()) {
                                photoUrlsList.add("/uploads/complaints/" + p.trim());
                            }
                        }
                    }

                    return ComplaintSummaryDTO.builder()
                            .id(complaint.getId())
                            .title(complaint.getTitle())
                            .description(complaint.getDescription())
                            .severity(complaint.getSeverity())
                            .status(complaint.getStatus())
                            .lat(complaint.getLat())
                            .lng(complaint.getLng())
                            .projectId(complaint.getProject() != null ? complaint.getProject().getId() : null)
                            .photoUrl(publicPhotoUrl)
                            .photoUrls(photoUrlsList)
                            .createdAt(complaint.getCreatedAt())
                            .resolvedAt(complaint.getResolvedAt())
                            .build();
                })
                .collect(Collectors.toList());

        return UserProfileDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .roles(user.getRoles())
                .complaints(complaints)
                .build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody ForgotPasswordRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
                .orElse(null); // Don't reveal if email exists for security

        if (user != null) {
            // Generate reset token
            String resetToken = UUID.randomUUID().toString();
            user.setResetToken(resetToken);
            user.setResetTokenExpiry(LocalDateTime.now().plusHours(1)); // Token valid for 1 hour
            userRepo.save(user);

            // TODO: Send email with reset link
            // For now, return token (in production, send via email)
        }

        // Always return success to prevent email enumeration
        Map<String, String> response = new HashMap<>();
        response.put("message", "If an account with that email exists, a password reset link has been sent.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody ResetPasswordRequest req) {
        if (req.getToken() == null || req.getToken().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reset token is required");
        }
        if (req.getNewPassword() == null || req.getNewPassword().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters");
        }

        User user = userRepo.findAll().stream()
                .filter(u -> req.getToken().equals(u.getResetToken()) && 
                           u.getResetTokenExpiry() != null && 
                           u.getResetTokenExpiry().isAfter(LocalDateTime.now()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired reset token"));

        user.setPassword(encoder.encode(req.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepo.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password has been reset successfully");
        return ResponseEntity.ok(response);
    }
}
