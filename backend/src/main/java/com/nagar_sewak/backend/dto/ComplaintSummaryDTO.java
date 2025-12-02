package com.nagar_sewak.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.Instant;

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
    private String photoUrl;
    private java.util.List<String> photoUrls;
    private Instant createdAt;
    private Instant resolvedAt;
}

