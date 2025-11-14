package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.dto.LoginRequest;
import com.nagar_sewak.backend.dto.RegisterRequest;
import com.nagar_sewak.backend.dto.ComplaintSummaryDTO;
import com.nagar_sewak.backend.dto.UserProfileDTO;
import com.nagar_sewak.backend.entities.*;
import com.nagar_sewak.backend.repositories.UserRepository;
import com.nagar_sewak.backend.repositories.ComplaintRepository;
import com.nagar_sewak.backend.security.JwtUtil;

import lombok.RequiredArgsConstructor;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

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
    public String register(@RequestBody RegisterRequest req) {
        User u = new User();
        u.setUsername(req.getUsername());
        u.setPassword(encoder.encode(req.getPassword()));
        u.setEmail(req.getEmail());
        u.setFullName(req.getFullName());
        u.setRoles(Set.of(Role.CITIZEN)); // default role

        userRepo.save(u);
        return "Registered";
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest req) {

        manager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
        );

        return jwtUtil.generateToken(req.getUsername());
    }

    @GetMapping("/me")
    public UserProfileDTO currentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user found");
        }

        User user = userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        var complaints = complaintRepo.findByUserUsername(user.getUsername()).stream()
                .map(complaint -> ComplaintSummaryDTO.builder()
                        .id(complaint.getId())
                        .title(complaint.getTitle())
                        .description(complaint.getDescription())
                        .severity(complaint.getSeverity())
                        .status(complaint.getStatus())
                        .lat(complaint.getLat())
                        .lng(complaint.getLng())
                        .projectId(complaint.getProject() != null ? complaint.getProject().getId() : null)
                        .build()
                ).collect(Collectors.toList());

        return UserProfileDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .roles(user.getRoles())
                .complaints(complaints)
                .build();
    }
}
