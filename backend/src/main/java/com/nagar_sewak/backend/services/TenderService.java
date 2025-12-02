package com.nagar_sewak.backend.services;

import com.nagar_sewak.backend.dto.TenderDTO;
import com.nagar_sewak.backend.entities.*;
import com.nagar_sewak.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TenderService {

    private final TenderRepository tenderRepo;
    private final ComplaintRepository complaintRepo;
    private final ContractorRepository contractorRepo;
    private final ProjectRepository projectRepo;
    private final UserRepository userRepo;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;

    private final Path uploadBase = Paths.get("uploads/tenders");

    public TenderDTO submitTender(Long complaintId, String username, TenderDTO dto, List<MultipartFile> documents) throws IOException {
        Complaint complaint = complaintRepo.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        Contractor contractor = contractorRepo.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Contractor profile not found"));

        Tender tender = new Tender();
        tender.setComplaint(complaint);
        tender.setContractor(contractor);
        tender.setQuoteAmount(dto.getQuoteAmount());
        tender.setEstimatedDays(dto.getEstimatedDays());
        tender.setDescription(dto.getDescription());
        tender.setStatus("PENDING");

        // Handle document uploads
        if (documents != null && !documents.isEmpty()) {
            Files.createDirectories(uploadBase);
            List<String> uploadedFilenames = new java.util.ArrayList<>();
            
            for (MultipartFile file : documents) {
                if (file != null && !file.isEmpty()) {
                    String originalFilename = file.getOriginalFilename();
                    if (originalFilename == null || originalFilename.isEmpty()) {
                        originalFilename = "document";
                    }
                    String filename = System.currentTimeMillis() + "_" + Path.of(originalFilename).getFileName();
                    Path target = uploadBase.resolve(filename);
                    Files.write(target, file.getBytes(), StandardOpenOption.CREATE_NEW);
                    uploadedFilenames.add(filename);
                    
                    try {
                        Thread.sleep(10); // Small delay for unique timestamps
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                }
            }
            
            if (!uploadedFilenames.isEmpty()) {
                tender.setDocumentUrls(String.join(",", uploadedFilenames));
            }
        }

        Tender saved = tenderRepo.save(tender);
        return mapToDTO(saved);
    }

    public TenderDTO getTenderById(Long tenderId) {
        Tender tender = tenderRepo.findById(tenderId)
                .orElseThrow(() -> new RuntimeException("Tender not found"));
        return mapToDTO(tender);
    }

    public List<TenderDTO> getTendersForComplaint(Long complaintId) {
        return tenderRepo.findByComplaintId(complaintId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<TenderDTO> getMyTenders(String username) {
        Contractor contractor = contractorRepo.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Contractor not found"));
        return tenderRepo.findByContractorId(contractor.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TenderDTO publishTenderOpportunity(Long complaintId, TenderDTO dto) {
        Complaint complaint = complaintRepo.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        Tender tender = new Tender();
        tender.setComplaint(complaint);
        tender.setTitle(dto.getTitle() != null ? dto.getTitle() : "Tender for: " + complaint.getTitle());
        tender.setDescription(dto.getDescription() != null ? dto.getDescription() : complaint.getDescription());
        tender.setBudget(dto.getBudget());
        tender.setStartDate(dto.getStartDate());
        tender.setEndDate(dto.getEndDate());
        tender.setStatus("OPEN");

        Tender saved = tenderRepo.save(tender);
        
        // Publish event to notify all contractors
        eventPublisher.publishEvent(new com.nagar_sewak.backend.events.TenderPublishedEvent(this, saved));
        
        return mapToDTO(saved);
    }

    @Transactional
    public void acceptTender(Long tenderId) {
        Tender tender = tenderRepo.findById(tenderId)
                .orElseThrow(() -> new RuntimeException("Tender not found"));

        if (!"PENDING".equals(tender.getStatus())) {
            throw new RuntimeException("Tender is not pending");
        }

        // 1. Update this tender to ACCEPTED
        String oldStatus = tender.getStatus();
        tender.setStatus("ACCEPTED");
        tenderRepo.save(tender);

        // Publish event for tender acceptance
        eventPublisher.publishEvent(new com.nagar_sewak.backend.events.TenderStatusChangedEvent(
            this, tender, oldStatus, "ACCEPTED", null));

        // 2. Reject other tenders for this complaint
        List<Tender> others = tenderRepo.findByComplaintId(tender.getComplaint().getId());
        for (Tender t : others) {
            if (!t.getId().equals(tenderId) && "PENDING".equals(t.getStatus())) {
                t.setStatus("REJECTED");
                tenderRepo.save(t);
            }
        }

        // 3. Create Project
        Complaint complaint = tender.getComplaint();
        Project project = new Project();
        project.setTitle("Fix: " + complaint.getTitle());
        project.setDescription("Work order for complaint #" + complaint.getId() + ": " + tender.getDescription());
        project.setContractorId(tender.getContractor().getId());
        project.setBudget(tender.getQuoteAmount());
        project.setStatus("In Progress");
        project.setLat(complaint.getLat());
        project.setLng(complaint.getLng());
        
        Project savedProject = projectRepo.save(project);

        // 4. Update Complaint
        complaint.setStatus("In Progress");
        complaint.setProject(savedProject);
        complaintRepo.save(complaint);
    }

    private TenderDTO mapToDTO(Tender tender) {
        TenderDTO dto = new TenderDTO();
        dto.setId(tender.getId());
        dto.setComplaintId(tender.getComplaint().getId());
        dto.setComplaintTitle(tender.getComplaint().getTitle());
        dto.setTitle(tender.getTitle());
        dto.setBudget(tender.getBudget());
        dto.setStartDate(tender.getStartDate());
        dto.setEndDate(tender.getEndDate());
        
        if (tender.getContractor() != null) {
            dto.setContractorId(tender.getContractor().getId());
            dto.setContractorName(tender.getContractor().getCompanyName());
            dto.setContractorCompany(tender.getContractor().getCompanyName());
            dto.setContractorLicense(tender.getContractor().getLicenseNo());
            dto.setContractorAvgRating(tender.getContractor().getAvgRating() != null ? tender.getContractor().getAvgRating().doubleValue() : 0.0);
        }
        
        dto.setQuoteAmount(tender.getQuoteAmount());
        dto.setEstimatedDays(tender.getEstimatedDays());
        dto.setDescription(tender.getDescription());
        dto.setStatus(tender.getStatus());
        dto.setCreatedAt(tender.getCreatedAt());
        dto.setUpdatedAt(tender.getUpdatedAt());
        
        // Parse document URLs
        List<String> documentUrlsList = new java.util.ArrayList<>();
        if (tender.getDocumentUrls() != null && !tender.getDocumentUrls().trim().isEmpty()) {
            String[] docs = tender.getDocumentUrls().split(",");
            for (String doc : docs) {
                if (!doc.trim().isEmpty()) {
                    documentUrlsList.add("/uploads/tenders/" + doc.trim());
                }
            }
        }
        dto.setDocumentUrls(documentUrlsList);
        
        return dto;
    }
}
