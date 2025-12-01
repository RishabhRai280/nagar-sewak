package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.dto.ComplaintRequest;
import com.nagar_sewak.backend.entities.Complaint;
import com.nagar_sewak.backend.entities.Project;
import com.nagar_sewak.backend.entities.User;
import com.nagar_sewak.backend.repositories.ComplaintRepository;
import com.nagar_sewak.backend.repositories.ProjectRepository;
import com.nagar_sewak.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.*;
import java.time.Instant;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/complaints")
@CrossOrigin("*")
public class ComplaintController {

    private final ComplaintRepository complaintRepo;
    private final UserRepository userRepo;
    private final ProjectRepository projectRepo;

    private final Path uploadBase = Paths.get("uploads/complaints");

    @GetMapping
    public List<ComplaintResponse> all() {
        return complaintRepo.findAll().stream()
                .map(complaint -> {
                    String photo = complaint.getPhotoUrl();
                    String photoUrl = photo != null ? "/uploads/complaints/" + photo : null;
                    
                    // Parse multiple photo URLs
                    List<String> photoUrlsList = new java.util.ArrayList<>();
                    if (complaint.getPhotoUrls() != null && !complaint.getPhotoUrls().trim().isEmpty()) {
                        String[] photos = complaint.getPhotoUrls().split(",");
                        for (String p : photos) {
                            if (!p.trim().isEmpty()) {
                                photoUrlsList.add("/uploads/complaints/" + p.trim());
                            }
                        }
                    }

                    return new ComplaintResponse(
                            complaint.getId(),
                            complaint.getTitle(),
                            complaint.getDescription(),
                            complaint.getSeverity(),
                            complaint.getStatus(),
                            complaint.getLat(),
                            complaint.getLng(),
                            photoUrl,
                            photoUrlsList,
                            complaint.getCreatedAt(),
                            complaint.getResolvedAt(),
                            complaint.getUser() != null ? complaint.getUser().getId() : null,
                            complaint.getUser() != null ? complaint.getUser().getFullName() : null,
                            complaint.getProject() != null ? complaint.getProject().getId() : null
                    );
                })
                .collect(java.util.stream.Collectors.toList());
    }

    @GetMapping("/{id}")
    public ComplaintResponse getById(@PathVariable Long id) {
        Complaint complaint = complaintRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Complaint not found"));

        String photo = complaint.getPhotoUrl();
        String photoUrl = photo != null ? "/uploads/complaints/" + photo : null;
        
        // Parse multiple photo URLs
        List<String> photoUrlsList = new java.util.ArrayList<>();
        if (complaint.getPhotoUrls() != null && !complaint.getPhotoUrls().trim().isEmpty()) {
            String[] photos = complaint.getPhotoUrls().split(",");
            for (String p : photos) {
                if (!p.trim().isEmpty()) {
                    photoUrlsList.add("/uploads/complaints/" + p.trim());
                }
            }
        }

        return new ComplaintResponse(
                complaint.getId(),
                complaint.getTitle(),
                complaint.getDescription(),
                complaint.getSeverity(),
                complaint.getStatus(),
                complaint.getLat(),
                complaint.getLng(),
                photoUrl,
                photoUrlsList,
                complaint.getCreatedAt(),
                complaint.getResolvedAt(),
                complaint.getUser() != null ? complaint.getUser().getId() : null,
                complaint.getUser() != null ? complaint.getUser().getFullName() : null,
                complaint.getProject() != null ? complaint.getProject().getId() : null
        );
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Complaint> create(
            @RequestPart(value = "data") ComplaintRequest req,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {

        if (userDetails == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");

        if (req.getTitle() == null || req.getTitle().trim().isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title is required");

        if (req.getDescription() == null || req.getDescription().trim().isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Description is required");

        if (req.getSeverity() == null || req.getSeverity() < 1 || req.getSeverity() > 5)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Severity must be between 1 and 5");

        if (req.getLat() == null || req.getLng() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Latitude and longitude are required");

        User citizen = userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Complaint complaint = new Complaint();
        complaint.setTitle(req.getTitle().trim());
        complaint.setDescription(req.getDescription().trim());
        complaint.setSeverity(req.getSeverity());
        complaint.setLat(req.getLat());
        complaint.setLng(req.getLng());
        complaint.setUser(citizen);
        complaint.setStatus("Pending");
        complaint.setCreatedAt(Instant.now());

        if (req.getProjectId() != null) {
            Project project = projectRepo.findById(req.getProjectId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
            complaint.setProject(project);
        }

        // Handle multiple file uploads
        if (files != null && !files.isEmpty()) {
            Files.createDirectories(uploadBase);
            List<String> uploadedFilenames = new java.util.ArrayList<>();
            
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    try {
                        String originalFilename = file.getOriginalFilename();
                        if (originalFilename == null || originalFilename.isEmpty()) {
                            originalFilename = "image.jpg";
                        }
                        String filename = System.currentTimeMillis() + "_" + Path.of(originalFilename).getFileName();
                        Path target = uploadBase.resolve(filename);
                        Files.write(target, file.getBytes(), StandardOpenOption.CREATE_NEW);
                        uploadedFilenames.add(filename);
                        
                        // Small delay to ensure unique timestamps
                        Thread.sleep(10);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                }
            }
            
            if (!uploadedFilenames.isEmpty()) {
                // Store first image in photoUrl for backward compatibility
                complaint.setPhotoUrl(uploadedFilenames.get(0));
                // Store all images as comma-separated list
                complaint.setPhotoUrls(String.join(",", uploadedFilenames));
            }
        }

        Complaint saved = complaintRepo.save(complaint);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Complaint> updateComplaint(
            @PathVariable Long id,
            @RequestBody ComplaintRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");

        Complaint complaint = complaintRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Complaint not found"));

        if (req.getTitle() != null && !req.getTitle().trim().isEmpty())
            complaint.setTitle(req.getTitle().trim());

        if (req.getDescription() != null && !req.getDescription().trim().isEmpty())
            complaint.setDescription(req.getDescription().trim());

        if (req.getSeverity() != null && req.getSeverity() >= 1 && req.getSeverity() <= 5)
            complaint.setSeverity(req.getSeverity());

        if (req.getStatus() != null && !req.getStatus().trim().isEmpty()) {
            String newStatus = req.getStatus().trim();
            boolean isResolving = "resolved".equalsIgnoreCase(newStatus);
            complaint.setStatus(newStatus);
            if (isResolving && complaint.getResolvedAt() == null) {
                complaint.setResolvedAt(Instant.now());
            } else if (!isResolving) {
                complaint.setResolvedAt(null);
            }
        }

        return ResponseEntity.ok(complaintRepo.save(complaint));
    }

    public static final class ComplaintResponse {
        public final Long id;
        public final String title;
        public final String description;
        public final int severity;
        public final String status;
        public final Double lat;
        public final Double lng;
        public final String photoUrl;
        public final List<String> photoUrls;
        public final Instant createdAt;
        public final Instant resolvedAt;
        public final Long userId;
        public final String userFullName;
        public final Long projectId;

        public ComplaintResponse(Long id, String title, String description, int severity, String status,
                                 Double lat, Double lng, String photoUrl, List<String> photoUrls, Instant createdAt, Instant resolvedAt,
                                 Long userId, String userFullName, Long projectId) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.severity = severity;
            this.status = status;
            this.lat = lat;
            this.lng = lng;
            this.photoUrl = photoUrl;
            this.photoUrls = photoUrls;
            this.createdAt = createdAt;
            this.resolvedAt = resolvedAt;
            this.userId = userId;
            this.userFullName = userFullName;
            this.projectId = projectId;
        }
    }
}
