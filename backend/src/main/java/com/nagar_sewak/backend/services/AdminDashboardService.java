package com.nagar_sewak.backend.services;

import com.nagar_sewak.backend.dto.*;
import com.nagar_sewak.backend.entities.Complaint;
import com.nagar_sewak.backend.entities.Project;
import com.nagar_sewak.backend.entities.Ward;
import com.nagar_sewak.backend.repositories.ComplaintRepository;
import com.nagar_sewak.backend.repositories.ContractorRepository;
import com.nagar_sewak.backend.repositories.ProjectRepository;
import com.nagar_sewak.backend.repositories.WardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final ProjectRepository projectRepo;
    private final ComplaintRepository complaintRepo;
    private final ContractorRepository contractorRepo;
    private final WardRepository wardRepository;

    public AdminDashboardDTO getDashboardData() {
        List<Project> allProjects = projectRepo.findAll();
        List<Complaint> allComplaints = complaintRepo.findAll();
        List<Ward> wards = wardRepository.findAll();

        long totalProjects = allProjects.size();
        long activeProjectsCount = allProjects.stream()
                .filter(p -> "in progress".equalsIgnoreCase(p.getStatus()))
                .count();

        Map<String, Long> complaintStatusMap = allComplaints.stream()
                .collect(Collectors.groupingBy(
                        c -> normalizeStatus(c.getStatus()),
                        Collectors.counting()
                ));

        long pendingComplaintsCount = complaintStatusMap.getOrDefault("Pending", 0L);
        long resolvedComplaintsCount = complaintStatusMap.getOrDefault("Resolved", 0L);

        BigDecimal totalBudget = allProjects.stream()
                .map(Project::getBudget)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal averageResolutionHours = calculateAverageResolution(allComplaints);

        List<ProjectStatusAggregate> statusBreakdown = buildStatusBreakdown(allProjects);
        List<WardHeatmapStat> wardStats = buildWardStats(allComplaints, allProjects, wards);
        List<ComplaintAdminView> recentComplaints = buildRecentComplaints(allComplaints, wards);

        return AdminDashboardDTO.builder()
                .totalProjects(totalProjects)
                .activeProjectsCount(activeProjectsCount)
                .pendingComplaintsCount(pendingComplaintsCount)
                .resolvedComplaintsCount(resolvedComplaintsCount)
                .averageResolutionTimeHours(averageResolutionHours)
                .totalSanctionedBudget(totalBudget)
                .projectStatusBreakdown(statusBreakdown)
                .wardComplaintHeatmap(wardStats)
                .recentComplaints(recentComplaints)
                .flaggedContractors(contractorRepo.findByIsFlaggedTrue())
                .build();
    }

    private BigDecimal calculateAverageResolution(List<Complaint> complaints) {
        List<Duration> durations = complaints.stream()
                .filter(c -> c.getCreatedAt() != null && c.getResolvedAt() != null)
                .map(c -> Duration.between(c.getCreatedAt(), c.getResolvedAt()))
                .toList();

        if (durations.isEmpty()) {
            return BigDecimal.ZERO.setScale(1, RoundingMode.HALF_UP);
        }

        double averageHours = durations.stream()
                .mapToLong(Duration::toHours)
                .average()
                .orElse(0.0);

        return BigDecimal.valueOf(averageHours).setScale(1, RoundingMode.HALF_UP);
    }

    private List<ProjectStatusAggregate> buildStatusBreakdown(List<Project> projects) {
        Map<String, List<Project>> grouped = projects.stream()
                .collect(Collectors.groupingBy(p -> normalizeStatus(p.getStatus())));

        return grouped.entrySet().stream()
                .map(entry -> ProjectStatusAggregate.builder()
                        .status(entry.getKey())
                        .projectCount((long) entry.getValue().size())
                        .totalBudget(entry.getValue().stream()
                                .map(Project::getBudget)
                                .filter(Objects::nonNull)
                                .reduce(BigDecimal.ZERO, BigDecimal::add))
                        .build())
                .sorted(Comparator.comparing(ProjectStatusAggregate::getStatus))
                .toList();
    }

    private List<WardHeatmapStat> buildWardStats(List<Complaint> complaints, List<Project> projects, List<Ward> wards) {
        if (wards.isEmpty()) {
            return List.of();
        }

        Map<Long, Long> complaintCounts = new HashMap<>();
        for (Complaint complaint : complaints) {
            Ward ward = findNearestWard(wards, complaint.getLat(), complaint.getLng());
            if (ward != null) {
                complaintCounts.merge(ward.getId(), 1L, Long::sum);
            }
        }

        Map<Long, Long> projectCounts = new HashMap<>();
        for (Project project : projects) {
            Ward ward = findNearestWard(wards, project.getLat(), project.getLng());
            if (ward != null) {
                projectCounts.merge(ward.getId(), 1L, Long::sum);
            }
        }

        return wards.stream()
                .map(ward -> WardHeatmapStat.builder()
                        .wardName(ward.getName())
                        .zone(ward.getZone())
                        .complaintCount(complaintCounts.getOrDefault(ward.getId(), 0L))
                        .projectCount(projectCounts.getOrDefault(ward.getId(), 0L))
                        .build())
                .sorted(Comparator.comparing(WardHeatmapStat::getComplaintCount).reversed())
                .toList();
    }

    private List<ComplaintAdminView> buildRecentComplaints(List<Complaint> complaints, List<Ward> wards) {
        return complaints.stream()
                .sorted(Comparator.comparing(Complaint::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(6)
                .map(complaint -> {
                    Ward ward = findNearestWard(wards, complaint.getLat(), complaint.getLng());
                    String wardLabel = ward != null ? ward.getName() + " (" + ward.getZone() + ")" : "Unmapped";
                    String photo = complaint.getPhotoUrl();
                    String photoUrl = photo == null ? null : (photo.startsWith("http") ? photo : "/uploads/complaints/" + photo);

                    return ComplaintAdminView.builder()
                            .id(complaint.getId())
                            .title(complaint.getTitle())
                            .status(complaint.getStatus())
                            .severity(complaint.getSeverity())
                            .lat(complaint.getLat())
                            .lng(complaint.getLng())
                            .createdAt(complaint.getCreatedAt())
                            .wardLabel(wardLabel)
                            .photoUrl(photoUrl)
                            .build();
                })
                .toList();
    }

    private Ward findNearestWard(List<Ward> wards, Double lat, Double lng) {
        if (lat == null || lng == null || wards.isEmpty()) {
            return null;
        }

        return wards.stream()
                .min(Comparator.comparingDouble(ward -> calculateDistance(lat, lng, ward.getLatitude(), ward.getLongitude())))
                .orElse(null);
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    private String normalizeStatus(String status) {
        if (status == null || status.isBlank()) {
            return "Unknown";
        }
        String normalized = status.trim();
        if (normalized.equalsIgnoreCase("in progress")) return "In Progress";
        if (normalized.equalsIgnoreCase("completed")) return "Completed";
        if (normalized.equalsIgnoreCase("pending")) return "Pending";
        if (normalized.equalsIgnoreCase("resolved")) return "Resolved";
        return normalized;
    }
}