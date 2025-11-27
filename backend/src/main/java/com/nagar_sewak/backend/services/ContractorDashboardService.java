package com.nagar_sewak.backend.services;

import com.nagar_sewak.backend.dto.ContractorDashboardDTO;
import com.nagar_sewak.backend.entities.Complaint;
import com.nagar_sewak.backend.entities.Contractor;
import com.nagar_sewak.backend.entities.Project;
import com.nagar_sewak.backend.entities.Rating;
import com.nagar_sewak.backend.repositories.ComplaintRepository;
import com.nagar_sewak.backend.repositories.ContractorRepository;
import com.nagar_sewak.backend.repositories.ProjectRepository;
import com.nagar_sewak.backend.repositories.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContractorDashboardService {

    private final ContractorRepository contractorRepository;
    private final ProjectRepository projectRepository;
    private final ComplaintRepository complaintRepository;
    private final RatingRepository ratingRepository;

    public ContractorDashboardDTO getDashboard(String username) {
        Contractor contractor = contractorRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contractor profile not found"));

        List<Project> assignedProjects = projectRepository.findByContractorId(contractor.getId());
        List<Complaint> linkedComplaints = complaintRepository.findByProjectContractorId(contractor.getId());
        List<Rating> latestRatings = ratingRepository.findTop5ByContractorIdOrderByCreatedAtDesc(contractor.getId());

        BigDecimal totalBudget = assignedProjects.stream()
                .map(Project::getBudget)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Long> projectStatusCounts = assignedProjects.stream()
                .collect(Collectors.groupingBy(
                        p -> normalizeStatus(p.getStatus()),
                        Collectors.counting()
                ));

        Map<String, Long> complaintStatusCounts = linkedComplaints.stream()
                .collect(Collectors.groupingBy(
                        c -> normalizeStatus(c.getStatus()),
                        Collectors.counting()
                ));

        ContractorDashboardDTO.PerformanceMetrics metrics = ContractorDashboardDTO.PerformanceMetrics.builder()
                .activeProjects(projectStatusCounts.getOrDefault("In Progress", 0L))
                .completedProjects(projectStatusCounts.getOrDefault("Completed", 0L))
                .pendingComplaints(complaintStatusCounts.getOrDefault("Pending", 0L) +
                        complaintStatusCounts.getOrDefault("In Progress", 0L))
                .resolvedComplaints(complaintStatusCounts.getOrDefault("Resolved", 0L))
                .totalBudget(totalBudget.setScale(2, RoundingMode.HALF_UP))
                .build();

        List<ContractorDashboardDTO.ProjectSummary> projectSummaries = assignedProjects.stream()
                .map(project -> ContractorDashboardDTO.ProjectSummary.builder()
                        .id(project.getId())
                        .title(project.getTitle())
                        .status(project.getStatus())
                        .budget(project.getBudget())
                        .lat(project.getLat())
                        .lng(project.getLng())
                        .updatedAt(Instant.now())
                        .build())
                .toList();

        List<ContractorDashboardDTO.ComplaintSnapshot> complaintSnapshots = linkedComplaints.stream()
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null || b.getCreatedAt() == null) return 0;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .limit(6)
                .map(complaint -> {
                    String photo = complaint.getPhotoUrl();
                    String photoUrl = photo == null ? null : (photo.startsWith("http") ? photo : "/uploads/complaints/" + photo);
                    return ContractorDashboardDTO.ComplaintSnapshot.builder()
                            .id(complaint.getId())
                            .title(complaint.getTitle())
                            .status(complaint.getStatus())
                            .severity(complaint.getSeverity())
                            .createdAt(complaint.getCreatedAt())
                            .photoUrl(photoUrl)
                            .projectId(complaint.getProject() != null ? complaint.getProject().getId() : null)
                            .build();
                })
                .toList();

        List<ContractorDashboardDTO.RatingSnapshot> ratingSnapshots = latestRatings.stream()
                .map(rating -> ContractorDashboardDTO.RatingSnapshot.builder()
                        .id(rating.getId())
                        .score(rating.getScore())
                        .comment(rating.getComment())
                        .createdAt(rating.getCreatedAt() != null ? rating.getCreatedAt().toInstant() : null)
                        .citizenName(rating.getUser() != null ? rating.getUser().getFullName() : "Citizen")
                        .build())
                .toList();

        return ContractorDashboardDTO.builder()
                .profile(ContractorDashboardDTO.ContractorProfile.builder()
                        .contractorId(contractor.getId())
                        .companyName(contractor.getCompanyName())
                        .licenseNo(contractor.getLicenseNo())
                        .avgRating(contractor.getAvgRating())
                        .totalRatings(contractor.getTotalRatings())
                        .flagged(contractor.getIsFlagged())
                        .flaggedAt(contractor.getFlaggedAt())
                        .build())
                .metrics(metrics)
                .assignedProjects(projectSummaries)
                .linkedComplaints(complaintSnapshots)
                .recentRatings(ratingSnapshots)
                .build();
    }

    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) return "Unknown";
        String normalized = status.trim();
        if (normalized.equalsIgnoreCase("in progress")) return "In Progress";
        if (normalized.equalsIgnoreCase("completed")) return "Completed";
        if (normalized.equalsIgnoreCase("pending")) return "Pending";
        if (normalized.equalsIgnoreCase("resolved")) return "Resolved";
        return normalized;
    }
}


