package com.nagar_sewak.backend.services;

import com.nagar_sewak.backend.dto.ProjectDetailDTO;
import com.nagar_sewak.backend.entities.Complaint;
import com.nagar_sewak.backend.entities.Contractor;
import com.nagar_sewak.backend.entities.Project;
import com.nagar_sewak.backend.repositories.ComplaintRepository;
import com.nagar_sewak.backend.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepo;
    private final ComplaintRepository complaintRepo;
    public final com.nagar_sewak.backend.repositories.ProjectMilestoneRepository milestoneRepo;
    public final org.springframework.context.ApplicationEventPublisher eventPublisher;

    public ProjectDetailDTO getProjectDetail(Long projectId) {
        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Get related complaints
        List<Complaint> complaints = complaintRepo.findByProjectId(projectId);

        // Build contractor info
        ProjectDetailDTO.ContractorInfo contractorInfo = null;
        if (project.getContractor() != null) {
            Contractor contractor = project.getContractor();
            contractorInfo = ProjectDetailDTO.ContractorInfo.builder()
                    .id(contractor.getId())
                    .companyName(contractor.getCompanyName())
                    .licenseNo(contractor.getLicenseNo())
                    .build();
        }

        // Build complaint info list
        List<ProjectDetailDTO.ComplaintInfo> complaintInfos = complaints.stream()
                .map(c -> {
                    String reportedBy = null;
                    if (c.getUser() != null) {
                        reportedBy = c.getUser().getFullName() != null ? c.getUser().getFullName() : c.getUser().getUsername();
                    }
                    
                    return ProjectDetailDTO.ComplaintInfo.builder()
                            .id(c.getId())
                            .title(c.getTitle())
                            .description(c.getDescription())
                            .severity(c.getSeverity())
                            .status(c.getStatus())
                            .reportedBy(reportedBy)
                            .reportedAt(c.getCreatedAt() != null ? 
                                java.time.LocalDateTime.ofInstant(c.getCreatedAt(), java.time.ZoneId.systemDefault()) : null)
                            .build();
                })
                .collect(Collectors.toList());

        // Build milestone info list
        List<com.nagar_sewak.backend.entities.ProjectMilestone> milestones = milestoneRepo.findByProjectIdOrderByPercentageAsc(projectId);
        List<ProjectDetailDTO.MilestoneInfo> milestoneInfos = milestones.stream()
                .map(m -> {
                    List<String> photoList = new java.util.ArrayList<>();
                    if (m.getPhotoUrls() != null && !m.getPhotoUrls().isEmpty()) {
                        photoList = java.util.Arrays.asList(m.getPhotoUrls().split(","));
                    }
                    
                    return ProjectDetailDTO.MilestoneInfo.builder()
                            .id(m.getId())
                            .percentage(m.getPercentage())
                            .notes(m.getNotes())
                            .photoUrls(photoList)
                            .status(m.getStatus())
                            .completedAt(m.getCompletedAt())
                            .updatedBy(m.getUpdatedBy())
                            .build();
                })
                .collect(Collectors.toList());

        return ProjectDetailDTO.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .budget(project.getBudget())
                .status(project.getStatus())
                .lat(project.getLat())
                .lng(project.getLng())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .progressPercentage(project.getProgressPercentage())
                .progressNotes(project.getProgressNotes())
                .progressPhotos(project.getProgressPhotos())
                .contractor(contractorInfo)
                .relatedComplaints(complaintInfos)
                .milestones(milestoneInfos)
                .build();
    }

    public void initializeMilestones(Long projectId) {
        // Create default milestones for a new project
        Integer[] milestonePercentages = {0, 25, 50, 75, 100};
        
        for (Integer percentage : milestonePercentages) {
            com.nagar_sewak.backend.entities.ProjectMilestone milestone = com.nagar_sewak.backend.entities.ProjectMilestone.builder()
                    .project(projectRepo.findById(projectId).orElseThrow())
                    .percentage(percentage)
                    .status(percentage == 0 ? "COMPLETED" : "PENDING")
                    .notes(percentage == 0 ? "Project started" : "")
                    .build();
            
            milestoneRepo.save(milestone);
        }
    }
}
