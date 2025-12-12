package com.nagar_sewak.backend.repositories;

import com.nagar_sewak.backend.entities.Tender;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TenderRepository extends JpaRepository<Tender, Long> {
    List<Tender> findByComplaintId(Long complaintId);
    List<Tender> findByContractorId(Long contractorId);
    List<Tender> findByStatus(String status);
}
