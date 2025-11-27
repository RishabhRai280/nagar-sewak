package com.nagar_sewak.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.List;

@Data
@Builder
public class ContractorDashboardDTO {

    private ContractorProfile profile;
    private PerformanceMetrics metrics;
    private List<ProjectSummary> assignedProjects;
    private List<ComplaintSnapshot> linkedComplaints;
    private List<RatingSnapshot> recentRatings;

    @Data
    @Builder
    public static class ContractorProfile {
        private Long contractorId;
        private String companyName;
        private String licenseNo;
        private BigDecimal avgRating;
        private Integer totalRatings;
        private Boolean flagged;
        private ZonedDateTime flaggedAt;
    }

    @Data
    @Builder
    public static class PerformanceMetrics {
        private Long activeProjects;
        private Long completedProjects;
        private Long pendingComplaints;
        private Long resolvedComplaints;
        private BigDecimal totalBudget;
    }

    @Data
    @Builder
    public static class ProjectSummary {
        private Long id;
        private String title;
        private String status;
        private BigDecimal budget;
        private Double lat;
        private Double lng;
        private Instant updatedAt;
    }

    @Data
    @Builder
    public static class ComplaintSnapshot {
        private Long id;
        private String title;
        private String status;
        private Integer severity;
        private Instant createdAt;
        private String photoUrl;
        private Long projectId;
    }

    @Data
    @Builder
    public static class RatingSnapshot {
        private Long id;
        private Integer score;
        private String comment;
        private Instant createdAt;
        private String citizenName;
    }
}


