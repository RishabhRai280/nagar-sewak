package com.nagar_sewak.backend.services;

import com.nagar_sewak.backend.dto.ContractorProfileDTO;
import com.nagar_sewak.backend.entities.Contractor;
import com.nagar_sewak.backend.entities.Project;
import com.nagar_sewak.backend.repositories.ContractorRepository;
import com.nagar_sewak.backend.repositories.ProjectRepository;
import com.nagar_sewak.backend.repositories.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContractorService {

    private final ContractorRepository contractorRepo;
    private final ProjectRepository projectRepo;
    private final RatingRepository ratingRepo;

    public ContractorProfileDTO getContractorProfile(Long contractorId) {
        Contractor contractor = contractorRepo.findById(contractorId)
                .orElseThrow(() -> new RuntimeException("Contractor not found"));
        return mapToDTO(contractor);
    }

    public List<ContractorProfileDTO> getAllContractors() {
        return contractorRepo.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private ContractorProfileDTO mapToDTO(Contractor contractor) {
        // Get contractor's projects
        List<Project> projects = projectRepo.findByContractorId(contractor.getId());

        // Calculate average rating
        Double avgRating = ratingRepo.findAverageRatingByContractorId(contractor.getId());

        // Get total ratings count
        Long totalRatings = ratingRepo.countByContractorId(contractor.getId());

        // Map projects to DTOs
        List<ContractorProfileDTO.ProjectInfo> projectInfos = projects.stream()
                .map(p -> ContractorProfileDTO.ProjectInfo.builder()
                        .id(p.getId())
                        .title(p.getTitle())
                        .description(p.getDescription())
                        .budget(p.getBudget())
                        .status(p.getStatus())
                        .completedAt(p.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());

        // Get contact info from user if available
        String contactEmail = contractor.getUser() != null ? contractor.getUser().getEmail() : null;
        String contactPhone = null; // Not available in current schema
        String address = null; // Not available in current schema
        String specialization = null; // Not available in current schema

        return ContractorProfileDTO.builder()
                .id(contractor.getId())
                .companyName(contractor.getCompanyName())
                .licenseNo(contractor.getLicenseNo())
                .contactEmail(contactEmail)
                .contactPhone(contactPhone)
                .address(address)
                .specialization(specialization)
                .avgRating(avgRating != null ? avgRating : 0.0)
                .totalRatings(totalRatings != null ? totalRatings.intValue() : 0)
                .totalProjects(projects.size())
                .completedProjects((int) projects.stream().filter(p -> "Completed".equals(p.getStatus())).count())
                .projects(projectInfos)
                .build();
    }
}
