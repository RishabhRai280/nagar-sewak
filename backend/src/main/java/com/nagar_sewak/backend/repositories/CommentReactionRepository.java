package com.nagar_sewak.backend.repositories;

import com.nagar_sewak.backend.entities.CommentReaction;
import com.nagar_sewak.backend.entities.ComplaintComment;
import com.nagar_sewak.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentReactionRepository extends JpaRepository<CommentReaction, Long> {
    
    Optional<CommentReaction> findByCommentAndUser(ComplaintComment comment, User user);
    
    List<CommentReaction> findByComment(ComplaintComment comment);
    
    @Query("SELECT COUNT(r) FROM CommentReaction r WHERE r.comment = :comment AND r.type = :type")
    long countByCommentAndType(ComplaintComment comment, CommentReaction.ReactionType type);
    
    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying
    void deleteByCommentAndUser(ComplaintComment comment, User user);
}
