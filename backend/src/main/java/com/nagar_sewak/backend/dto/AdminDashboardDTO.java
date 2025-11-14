package com.nagar_sewak.backend.dto;

import com.nagar_sewak.backend.entities.Contractor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class AdminDashboardDTO {
    // KPI 1: Active Projects
    private Long activeProjectsCount; 
    
    // KPI 2: Total pending complaints
    private Long pendingComplaintsCount;
    
    // KPI 3: Average Resolution Time (in hours)
    private BigDecimal averageResolutionTime;
    
    // KPI 4: Total Sanctioned Budget
    private BigDecimal totalSanctionedBudget;
    
    // KPI 5: Contractors requiring review
    private List<Contractor> flaggedContractors;
}