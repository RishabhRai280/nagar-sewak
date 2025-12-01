package com.nagar_sewak.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDetailDTO {
    private Long id;
    private String title;
    private String description;
    private BigDecimal budget;
    private String status;
    private Double lat;
    private Double lng;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer progressPercentage;
    private String progressNotes;
    private String progressPhotos;
    private ContractorInfo contractor;
    private List<ComplaintInfo> relatedComplaints;
    private List<MilestoneInfo> milestones;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContractorInfo {
        private Long id;
        private String companyName;
        private String licenseNo;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ComplaintInfo {
        private Long id;
        private String title;
        private String description;
        private Integer severity;
        private String status;
        private String reportedBy;
        private LocalDateTime reportedAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MilestoneInfo {
        private Long id;
        private Integer percentage;
        private String notes;
        private List<String> photoUrls;
        private String status;
        private LocalDateTime completedAt;
        private String updatedBy;
    }
}
