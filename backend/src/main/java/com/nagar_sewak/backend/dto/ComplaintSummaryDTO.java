package com.nagar_sewak.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ComplaintSummaryDTO {
    private Long id;
    private String title;
    private String description;
    private Integer severity;
    private String status;
    private Double lat;
    private Double lng;
    private Long projectId;
}

