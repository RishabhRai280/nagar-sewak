package com.nagar_sewak.backend.repositories;

import com.nagar_sewak.backend.entities.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    // Example custom method to support the accountability feature
    List<Rating> findByContractorId(Long contractorId);

    List<Rating> findTop5ByContractorIdOrderByCreatedAtDesc(Long contractorId);
}