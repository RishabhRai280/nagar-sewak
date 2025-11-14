package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.entities.Project;
import com.nagar_sewak.backend.repositories.ProjectRepository;
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

    @GetMapping
    public List<Project> all() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> byId(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
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
}
