package com.nagar_sewak.backend.dto;

import com.nagar_sewak.backend.entities.Contractor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class AdminDashboardDTO {
    private Long totalProjects;
    private Long activeProjectsCount; 
    private Long pendingComplaintsCount;
    private Long resolvedComplaintsCount;
    private BigDecimal averageResolutionTimeHours;
    private BigDecimal totalSanctionedBudget;

    private List<ProjectStatusAggregate> projectStatusBreakdown;
    private List<WardHeatmapStat> wardComplaintHeatmap;
    private List<ComplaintAdminView> recentComplaints;
    private List<Contractor> flaggedContractors;
}