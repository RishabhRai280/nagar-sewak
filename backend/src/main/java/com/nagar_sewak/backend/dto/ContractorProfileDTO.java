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
public class ContractorProfileDTO {
    private Long id;
    private String companyName;
    private String licenseNo;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private String specialization;
    private Double avgRating;
    private Integer totalRatings;
    private Integer totalProjects;
    private Integer completedProjects;
    private List<ProjectInfo> projects;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectInfo {
        private Long id;
        private String title;
        private String description;
        private BigDecimal budget;
        private String status;
        private LocalDateTime completedAt;
    }
}
