package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.dto.ComplaintRequest;
import com.nagar_sewak.backend.entities.Complaint;
import com.nagar_sewak.backend.entities.Project;
import com.nagar_sewak.backend.entities.User;
import com.nagar_sewak.backend.repositories.ComplaintRepository;
import com.nagar_sewak.backend.repositories.ProjectRepository;
import com.nagar_sewak.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/complaints")
public class ComplaintController {
	
    private final ComplaintRepository complaintRepo;
    private final UserRepository userRepo;
    private final ProjectRepository projectRepo;

    // GET /complaints (Public/Map View)
    @GetMapping
    public List<Complaint> all() {
        return complaintRepo.findAll();
    }

    // POST /complaints (Citizen Only - Secured by SecurityConfig)
    @PostMapping
    public ResponseEntity<Complaint> create(
            @RequestBody ComplaintRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {

        // 1. Fetch User from DB using the principal's username (which is email/username)
        User citizen = userRepo.findByUsername(userDetails.getUsername()) 
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // 2. Create the Complaint entity from the request DTO
        Complaint complaint = new Complaint();
        complaint.setTitle(req.getTitle());
        complaint.setDescription(req.getDescription());
        complaint.setSeverity(req.getSeverity());
        complaint.setLat(req.getLat());
        complaint.setLng(req.getLng());
        complaint.setUser(citizen);
        complaint.setStatus("Pending");

        if (req.getProjectId() != null) {
            Optional<Project> project = projectRepo.findById(req.getProjectId());
            complaint.setProject(project.orElseThrow(() ->
                    new ResponseStatusException(HttpStatus.NOT_FOUND, "Linked project not found")));
        }

        // NOTE: Photo upload logic should be added here later.
        
        Complaint savedComplaint = complaintRepo.save(complaint);
        return new ResponseEntity<>(savedComplaint, HttpStatus.CREATED);
    }
}