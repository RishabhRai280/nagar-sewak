package com.nagar_sewak.backend.repositories;

import com.nagar_sewak.backend.entities.ComplaintComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintCommentRepository extends JpaRepository<ComplaintComment, Long> {
    
    // Get all comments for a complaint
    List<ComplaintComment> findByComplaintIdOrderByCreatedAtDesc(Long complaintId);
    
    // Count comments for a complaint
    long countByComplaintId(Long complaintId);
    
    // Get comments by user
    List<ComplaintComment> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Get comment count for multiple complaints
    @Query("SELECT cc.complaint.id, COUNT(cc) FROM ComplaintComment cc WHERE cc.complaint.id IN :complaintIds GROUP BY cc.complaint.id")
    List<Object[]> countCommentsByComplaintIds(List<Long> complaintIds);
}
