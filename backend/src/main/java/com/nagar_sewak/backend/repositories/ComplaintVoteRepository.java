package com.nagar_sewak.backend.repositories;

import com.nagar_sewak.backend.entities.ComplaintVote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface ComplaintVoteRepository extends JpaRepository<ComplaintVote, Long> {
    
    // Count votes for a complaint
    long countByComplaintId(Long complaintId);
    
    // Check if user has voted
    boolean existsByComplaintIdAndUserId(Long complaintId, Long userId);
    
    // Find user's vote
    Optional<ComplaintVote> findByComplaintIdAndUserId(Long complaintId, Long userId);
    
    // Delete user's vote
    @Transactional
    @Modifying
    void deleteByComplaintIdAndUserId(Long complaintId, Long userId);
    
    // Get vote count for multiple complaints
    @Query("SELECT cv.complaint.id, COUNT(cv) FROM ComplaintVote cv WHERE cv.complaint.id IN :complaintIds GROUP BY cv.complaint.id")
    java.util.List<Object[]> countVotesByComplaintIds(java.util.List<Long> complaintIds);
}
