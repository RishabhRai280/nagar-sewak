package com.nagar_sewak.backend.repositories;

import com.nagar_sewak.backend.entities.Contractor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContractorRepository extends JpaRepository<Contractor, Long> {
    // Custom query to find flagged contractors for admin dashboard
    List<Contractor> findByIsFlaggedTrue();

    Optional<Contractor> findByUserUsername(String username);
}