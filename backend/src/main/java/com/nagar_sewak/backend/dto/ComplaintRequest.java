package com.nagar_sewak.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class ComplaintRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    // Assuming severity is a numerical scale (e.g., 1 to 5)
    @NotNull
    private Integer severity;

    @NotNull
    private Double lat;

    @NotNull
    private Double lng;

    // Optional: for linking a complaint to a specific project
    private Long projectId;
}