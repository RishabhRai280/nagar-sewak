package com.nagar_sewak.backend.repositories; // FIX: Corrected package name (was coms.nagar...)

import com.nagar_sewak.backend.entities.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    long countByStatus(String status);

    List<Complaint> findByUserUsername(String username);
}