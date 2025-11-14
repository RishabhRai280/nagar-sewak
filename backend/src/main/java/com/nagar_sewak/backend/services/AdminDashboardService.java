package com.nagar_sewak.backend.services;

import com.nagar_sewak.backend.dto.AdminDashboardDTO;
import com.nagar_sewak.backend.repositories.ComplaintRepository;
import com.nagar_sewak.backend.repositories.ContractorRepository;
import com.nagar_sewak.backend.repositories.ProjectRepository;
import com.nagar_sewak.backend.entities.Project;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;


@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final ProjectRepository projectRepo;
    private final ComplaintRepository complaintRepo;
    private final ContractorRepository contractorRepo;

    public AdminDashboardDTO getDashboardData() {
        // Fetch raw data
        long activeProjectsCount = projectRepo.countByStatus("In Progress");
        long pendingComplaintsCount = complaintRepo.countByStatus("Pending");
        
        // Calculate Total Sanctioned Budget
        // FIX: Simplified stream logic as Project::getBudget now returns BigDecimal, resolving compilation error
        BigDecimal totalBudget = projectRepo.findAll().stream()
                .map(Project::getBudget)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Fetch Flagged Contractors
        var flaggedContractors = contractorRepo.findByIsFlaggedTrue();
        
        // Placeholder for complex calculation (Average Resolution Time)
        BigDecimal avgResolutionTime = new BigDecimal("48.5"); 

        return AdminDashboardDTO.builder()
                .activeProjectsCount(activeProjectsCount)
                .pendingComplaintsCount(pendingComplaintsCount)
                .averageResolutionTime(avgResolutionTime)
                .totalSanctionedBudget(totalBudget)
                .flaggedContractors(flaggedContractors)
                .build();
    }
}