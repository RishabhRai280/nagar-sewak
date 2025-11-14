package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.dto.LoginRequest;
import com.nagar_sewak.backend.dto.RegisterRequest;
import com.nagar_sewak.backend.entities.*;
import com.nagar_sewak.backend.repositories.UserRepository;
import com.nagar_sewak.backend.security.JwtUtil;

import lombok.RequiredArgsConstructor;

import java.util.Set;

import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepo;
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
}
