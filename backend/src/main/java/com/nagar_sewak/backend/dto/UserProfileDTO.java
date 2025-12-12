package com.nagar_sewak.backend.dto;

import com.nagar_sewak.backend.entities.Role;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
@Builder
public class UserProfileDTO {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private Set<Role> roles;
    private List<ComplaintSummaryDTO> complaints;
}

