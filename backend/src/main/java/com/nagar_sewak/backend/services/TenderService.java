package com.nagar_sewak.backend.services;

import com.nagar_sewak.backend.dto.TenderDTO;
import com.nagar_sewak.backend.entities.*;
import com.nagar_sewak.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public TenderDTO submitTender(Long complaintId, String username, TenderDTO dto) {
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

        Tender saved = tenderRepo.save(tender);
        return mapToDTO(saved);
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
    public void acceptTender(Long tenderId) {
        Tender tender = tenderRepo.findById(tenderId)
                .orElseThrow(() -> new RuntimeException("Tender not found"));

        if (!"PENDING".equals(tender.getStatus())) {
            throw new RuntimeException("Tender is not pending");
        }

        // 1. Update this tender to ACCEPTED
        tender.setStatus("ACCEPTED");
        tenderRepo.save(tender);

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
        dto.setContractorId(tender.getContractor().getId());
        dto.setContractorName(tender.getContractor().getCompanyName());
        dto.setQuoteAmount(tender.getQuoteAmount());
        dto.setEstimatedDays(tender.getEstimatedDays());
        dto.setDescription(tender.getDescription());
        dto.setStatus(tender.getStatus());
        dto.setCreatedAt(tender.getCreatedAt());
        return dto;
    }
}
