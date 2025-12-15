package com.nagar_sewak.backend.dto;

import com.nagar_sewak.backend.entities.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String message;
    private String username;
    private String fullName;
    private String email;
    private Long userId;
    private Set<Role> roles;
    
    // Security-related fields
    private Boolean newDevice;
    private Integer attemptCount;
    private Integer remainingAttempts;
    private String errorType;
    private Object error; // For detailed error information
}

