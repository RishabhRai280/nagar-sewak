package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.dto.ProjectDetailDTO;
import com.nagar_sewak.backend.entities.Project;
import com.nagar_sewak.backend.repositories.ProjectRepository;
import com.nagar_sewak.backend.services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectRepository repo;
    private final ProjectService projectService;

    @GetMapping
    public List<Project> all() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDetailDTO> byId(@PathVariable Long id) {
        try {
            ProjectDetailDTO projectDetail = projectService.getProjectDetail(id);
            return ResponseEntity.ok(projectDetail);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Project> create(
            @RequestBody Project p,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }

        // Validate input
        if (p.getTitle() == null || p.getTitle().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title is required");
        }
        if (p.getDescription() == null || p.getDescription().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Description is required");
        }
        if (p.getBudget() == null || p.getBudget().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Valid budget is required");
        }
        if (p.getLat() == null || p.getLng() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Latitude and longitude are required");
        }

        // Set default status if not provided
        if (p.getStatus() == null || p.getStatus().trim().isEmpty()) {
            p.setStatus("Pending");
        }

        Project savedProject = repo.save(p);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProject);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(
            @PathVariable Long id,
            @RequestBody Project updatedProject,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }

        Project project = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        // Update fields if provided
        if (updatedProject.getTitle() != null && !updatedProject.getTitle().trim().isEmpty()) {
            project.setTitle(updatedProject.getTitle().trim());
        }
        if (updatedProject.getDescription() != null && !updatedProject.getDescription().trim().isEmpty()) {
            project.setDescription(updatedProject.getDescription().trim());
        }
        if (updatedProject.getBudget() != null && updatedProject.getBudget().compareTo(BigDecimal.ZERO) > 0) {
            project.setBudget(updatedProject.getBudget());
        }
        if (updatedProject.getStatus() != null && !updatedProject.getStatus().trim().isEmpty()) {
            project.setStatus(updatedProject.getStatus().trim());
        }
        if (updatedProject.getLat() != null && updatedProject.getLng() != null) {
            project.setLat(updatedProject.getLat());
            project.setLng(updatedProject.getLng());
        }
        if (updatedProject.getContractorId() != null) {
            project.setContractorId(updatedProject.getContractorId());
        }

        Project savedProject = repo.save(project);
        return ResponseEntity.ok(savedProject);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Project>> getProjectsByStatus(@PathVariable String status) {
        // Normalize status parameter
        String normalizedStatus = switch (status.toLowerCase()) {
            case "in-progress" -> "In Progress";
            case "completed" -> "Completed";
            case "pending" -> "Pending";
            case "issues" -> "Issues";
            default -> status;
        };
        
        List<Project> projects = repo.findByStatus(normalizedStatus);
        return ResponseEntity.ok(projects);
    }

    @PostMapping(value = "/{id}/progress", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Project> updateProgress(
            @PathVariable Long id,
            @RequestParam("progress") Integer progress,
            @RequestParam("status") String status,
            @RequestParam("notes") String notes,
            @RequestParam(value = "photos", required = false) List<org.springframework.web.multipart.MultipartFile> photos,
            @AuthenticationPrincipal UserDetails userDetails) throws java.io.IOException {

        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }

        Project project = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        // Update progress fields
        project.setProgressPercentage(progress);
        project.setStatus(status);
        project.setProgressNotes(notes);

        // Handle photo uploads
        if (photos != null && !photos.isEmpty()) {
            // Use absolute path from project root
            String projectRoot = System.getProperty("user.dir");
            java.nio.file.Path uploadDir = java.nio.file.Paths.get(projectRoot, "uploads", "projects");
            
            if (!java.nio.file.Files.exists(uploadDir)) {
                java.nio.file.Files.createDirectories(uploadDir);
            }

            java.util.List<String> photoUrls = new java.util.ArrayList<>();
            for (org.springframework.web.multipart.MultipartFile photo : photos) {
                String filename = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
                java.nio.file.Path filePath = uploadDir.resolve(filename);
                photo.transferTo(filePath.toFile());
                photoUrls.add("/uploads/projects/" + filename);
            }

            // Append to existing photos or create new list
            String existingPhotos = project.getProgressPhotos();
            if (existingPhotos != null && !existingPhotos.isEmpty()) {
                photoUrls.add(0, existingPhotos);
            }
            project.setProgressPhotos(String.join(",", photoUrls));
        }

        Project savedProject = repo.save(project);
        return ResponseEntity.ok(savedProject);
    }
}
