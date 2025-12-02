package com.nagar_sewak.backend.repositories;

import com.nagar_sewak.backend.entities.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    // Example custom method to support the accountability feature
    List<Rating> findByContractorId(Long contractorId);

    List<Rating> findTop5ByContractorIdOrderByCreatedAtDesc(Long contractorId);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.contractor.id = :contractorId")
    Double findAverageRatingByContractorId(@Param("contractorId") Long contractorId);

    Long countByContractorId(Long contractorId);
}