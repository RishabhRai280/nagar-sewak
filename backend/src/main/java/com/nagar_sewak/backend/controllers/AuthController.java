package com.nagar_sewak.backend.controllers;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.nagar_sewak.backend.dto.AuthResponse;
import com.nagar_sewak.backend.dto.ComplaintSummaryDTO;
import com.nagar_sewak.backend.dto.FirebaseLoginRequest;
import com.nagar_sewak.backend.dto.ForgotPasswordRequest;
import com.nagar_sewak.backend.dto.LoginRequest;
import com.nagar_sewak.backend.dto.RegisterRequest;
import com.nagar_sewak.backend.dto.ResetPasswordRequest;
import com.nagar_sewak.backend.dto.UserProfileDTO;
import com.nagar_sewak.backend.entities.*;
import com.nagar_sewak.backend.exceptions.AccountLockedException;
import com.nagar_sewak.backend.repositories.ComplaintRepository;
import com.nagar_sewak.backend.repositories.UserRepository;
import com.nagar_sewak.backend.security.JwtUtil;
import com.nagar_sewak.backend.services.LoginAttemptService;
import com.nagar_sewak.backend.services.DeviceFingerprintService;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final ComplaintRepository complaintRepo;
    private final PasswordEncoder encoder;
    private final AuthenticationManager manager;
    private final JwtUtil jwtUtil;
    private final LoginAttemptService loginAttemptService;
    private final DeviceFingerprintService deviceFingerprintService;

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
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req, HttpServletRequest request) {
        try {
            // Validate input
            if (req.getEmail() == null || req.getEmail().trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
            }
            if (req.getPassword() == null || req.getPassword().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required");
            }

            String email = req.getEmail().toLowerCase();
            String clientIp = loginAttemptService.getClientIpAddress(request);

            // Check if account is locked
            if (loginAttemptService.isAccountLocked(email)) {
                long remainingMinutes = loginAttemptService.getRemainingLockTimeMinutes(email);
                throw new AccountLockedException(
                    String.format("Account is temporarily locked due to multiple failed login attempts. Please try again in %d minutes.", remainingMinutes),
                    remainingMinutes
                );
            }

            // Find user by email
            User user = userRepo.findByEmail(email)
                    .orElseThrow(() -> {
                        // Record failed attempt even for non-existent users to prevent enumeration attacks
                        loginAttemptService.recordFailedAttempt(email, clientIp, request);
                        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
                    });

            try {
                // Authenticate user using username (Spring Security uses username internally)
                manager.authenticate(
                        new UsernamePasswordAuthenticationToken(user.getUsername(), req.getPassword())
                );

                // Record successful login
                loginAttemptService.recordSuccessfulAttempt(email, clientIp, request);

                // Check if this is a new device
                boolean isNewDevice = deviceFingerprintService.isNewDeviceLogin(user.getId().toString(), request);
                
                // Process device fingerprint (register if new, update if existing)
                deviceFingerprintService.processDeviceForLogin(user.getId().toString(), request);

                // Generate JWT token
                String token = jwtUtil.generateToken(user.getUsername());

                String message = "Login successful";
                if (isNewDevice) {
                    message = "Login successful from new device. A security notification has been sent to your email.";
                }

                AuthResponse response = AuthResponse.builder()
                        .token(token)
                        .message(message)
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .userId(user.getId())
                        .roles(user.getRoles())
                        .build();

                return ResponseEntity.ok(response);

            } catch (BadCredentialsException e) {
                // Record failed attempt
                loginAttemptService.recordFailedAttempt(email, clientIp, request);
                
                // Check if we should show warning
                String warningMessage = "Invalid email or password";
                if (loginAttemptService.shouldShowWarning(email)) {
                    warningMessage = loginAttemptService.getWarningMessage(email);
                }
                
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, warningMessage);
            }

        } catch (AccountLockedException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "ACCOUNT_LOCKED");
            errorResponse.put("message", e.getMessage());
            errorResponse.put("remainingLockTimeMinutes", e.getRemainingLockTimeMinutes());
            
            return ResponseEntity.status(HttpStatus.LOCKED).body(
                AuthResponse.builder()
                    .message(e.getMessage())
                    .build()
            );
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/firebase")
    public ResponseEntity<AuthResponse> firebaseLogin(@RequestBody FirebaseLoginRequest req, HttpServletRequest request) {
        if (req.getIdToken() == null || req.getIdToken().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Firebase idToken is required");
        }

        try {
            // Check if Firebase is initialized
            if (FirebaseApp.getApps().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, 
                    "Google Sign-In is not configured on the server. Please contact the administrator.");
            }

            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(req.getIdToken());

            String emailTemp = decodedToken.getEmail();
            if (emailTemp == null || emailTemp.isBlank()) {
                emailTemp = req.getEmail();
            }
            if (emailTemp == null || emailTemp.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required from Google sign-in");
            }
            final String email = emailTemp;

            String nameTemp = decodedToken.getName();
            if (nameTemp == null || nameTemp.isBlank()) {
                nameTemp = req.getDisplayName();
            }
            final String name = nameTemp;

            final String usernameBase = decodedToken.getUid() != null && !decodedToken.getUid().isBlank()
                    ? decodedToken.getUid()
                    : email.substring(0, email.indexOf('@'));

            User user = userRepo.findByEmail(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setFullName(name != null && !name.isBlank() ? name : email);
                newUser.setUsername(buildUniqueUsername(usernameBase));
                newUser.setPassword(encoder.encode(UUID.randomUUID().toString())); // random, not used for login
                newUser.setRoles(Set.of(Role.CITIZEN));
                return userRepo.save(newUser);
            });

            // Backfill missing display name if user existed without it
            if ((user.getFullName() == null || user.getFullName().isBlank()) && name != null && !name.isBlank()) {
                user.setFullName(name);
                userRepo.save(user);
            }

            // Check if this is a new device
            boolean isNewDevice = deviceFingerprintService.isNewDeviceLogin(user.getId().toString(), request);
            
            // Process device fingerprint (register if new, update if existing)
            deviceFingerprintService.processDeviceForLogin(user.getId().toString(), request);

            String token = jwtUtil.generateToken(user.getUsername());

            String message = "Google sign-in successful";
            if (isNewDevice) {
                message = "Google sign-in successful from new device. A security notification has been sent to your email.";
            }

            AuthResponse response = AuthResponse.builder()
                    .token(token)
                    .message(message)
                    .username(user.getUsername())
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .userId(user.getId())
                    .roles(user.getRoles())
                    .build();

            return ResponseEntity.ok(response);
        } catch (FirebaseAuthException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google sign-in token");
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Google login failed: " + e.getMessage());
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
                    final String photo = complaint.getPhotoUrl();
                    final String publicPhotoUrl = photo == null ? null :
                            photo.startsWith("http") ? photo : "/uploads/complaints/" + photo;

                    // Parse multiple photo URLs
                    final java.util.List<String> photoUrlsList = new java.util.ArrayList<>();
                    if (complaint.getPhotoUrls() != null && !complaint.getPhotoUrls().trim().isEmpty()) {
                        final String[] photos = complaint.getPhotoUrls().split(",");
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

    private String buildUniqueUsername(String base) {
        String sanitized = base.replaceAll("[^A-Za-z0-9._-]", "");
        if (sanitized.isBlank()) {
            sanitized = "user";
        }

        String candidate = sanitized;
        int counter = 1;
        while (userRepo.existsByUsername(candidate)) {
            candidate = sanitized + counter;
            counter++;
        }
        return candidate;
    }
}
