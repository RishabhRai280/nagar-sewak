package com.nagar_sewak.backend.repositories;

import com.nagar_sewak.backend.entities.CommentAttachment;
import com.nagar_sewak.backend.entities.ComplaintComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentAttachmentRepository extends JpaRepository<CommentAttachment, Long> {
    
    List<CommentAttachment> findByComment(ComplaintComment comment);
    
    void deleteByComment(ComplaintComment comment);
}
