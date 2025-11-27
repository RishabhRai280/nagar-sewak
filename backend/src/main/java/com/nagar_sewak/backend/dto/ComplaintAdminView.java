package com.nagar_sewak.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ComplaintAdminView {
    private Long id;
    private String title;
    private String status;
    private Integer severity;
    private Double lat;
    private Double lng;
    private Instant createdAt;
    private String wardLabel;
    private String photoUrl;
}


