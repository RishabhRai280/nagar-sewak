package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.dto.TenderDTO;
import com.nagar_sewak.backend.services.TenderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tenders")
@CrossOrigin("*")
public class TenderController {

    private final TenderService tenderService;

    // POST /tenders/complaints/{id}/submit - Contractor submits tender with documents
    @PostMapping(value = "/complaints/{complaintId}/submit", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TenderDTO> submitTender(
            @PathVariable Long complaintId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestPart(value = "data") TenderDTO dto,
            @RequestPart(value = "documents", required = false) List<org.springframework.web.multipart.MultipartFile> documents) throws java.io.IOException {
        return ResponseEntity.ok(tenderService.submitTender(complaintId, userDetails.getUsername(), dto, documents));
    }

    // GET /tenders/{id} - Get tender details
    @GetMapping("/{tenderId}")
    public ResponseEntity<TenderDTO> getTenderById(@PathVariable Long tenderId) {
        return ResponseEntity.ok(tenderService.getTenderById(tenderId));
    }

    // GET /tenders/my - Contractor views their tenders
    @GetMapping("/my")
    public ResponseEntity<List<TenderDTO>> getMyTenders(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(tenderService.getMyTenders(userDetails.getUsername()));
    }

    // GET /tenders/complaints/{id} - Admin views tenders for a complaint
    @GetMapping("/complaints/{complaintId}")
    public ResponseEntity<List<TenderDTO>> getTendersForComplaint(@PathVariable Long complaintId) {
        return ResponseEntity.ok(tenderService.getTendersForComplaint(complaintId));
    }

    // POST /tenders/{id}/accept - Admin accepts a tender
    @PostMapping("/{tenderId}/accept")
    public ResponseEntity<?> acceptTender(@PathVariable Long tenderId) {
        tenderService.acceptTender(tenderId);
        return ResponseEntity.ok(Map.of("message", "Tender accepted and project created"));
    }
}
