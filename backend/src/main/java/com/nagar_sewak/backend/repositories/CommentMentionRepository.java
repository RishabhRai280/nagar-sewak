package com.nagar_sewak.backend.repositories;

import com.nagar_sewak.backend.entities.CommentMention;
import com.nagar_sewak.backend.entities.ComplaintComment;
import com.nagar_sewak.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentMentionRepository extends JpaRepository<CommentMention, Long> {
    
    List<CommentMention> findByComment(ComplaintComment comment);
    
    List<CommentMention> findByMentionedUser(User user);
    
    void deleteByComment(ComplaintComment comment);
}
