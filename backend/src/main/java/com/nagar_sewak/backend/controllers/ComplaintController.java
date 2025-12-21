package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.dto.ComplaintRequest;
import com.nagar_sewak.backend.entities.*;
import com.nagar_sewak.backend.repositories.*;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.*;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/complaints")
@CrossOrigin("*")
public class ComplaintController {

    private final ComplaintRepository complaintRepo;
    private final UserRepository userRepo;
    private final ProjectRepository projectRepo;
    private final com.nagar_sewak.backend.repositories.ComplaintVoteRepository voteRepo;
    private final com.nagar_sewak.backend.repositories.ComplaintCommentRepository commentRepo;
    private final CommentReactionRepository commentReactionRepo;
    private final CommentAttachmentRepository commentAttachmentRepo;
    private final CommentMentionRepository commentMentionRepo;
    private final com.nagar_sewak.backend.services.NotificationService notificationService;

    private final Path uploadBase = Paths.get("uploads/complaints");

    @GetMapping
    public List<ComplaintResponse> all() {
        return complaintRepo.findAll().stream()
                .map(complaint -> {
                    String photo = complaint.getPhotoUrl();
                    String photoUrl = photo != null ? "/uploads/complaints/" + photo : null;
                    
                    // Parse multiple photo URLs
                    List<String> photoUrlsList = new java.util.ArrayList<>();
                    if (complaint.getPhotoUrls() != null && !complaint.getPhotoUrls().trim().isEmpty()) {
                        String[] photos = complaint.getPhotoUrls().split(",");
                        for (String p : photos) {
                            if (!p.trim().isEmpty()) {
                                photoUrlsList.add("/uploads/complaints/" + p.trim());
                            }
                        }
                    }

                    return new ComplaintResponse(
                            complaint.getId(),
                            complaint.getTitle(),
                            complaint.getDescription(),
                            complaint.getSeverity(),
                            complaint.getStatus(),
                            complaint.getLat(),
                            complaint.getLng(),
                            photoUrl,
                            photoUrlsList,
                            complaint.getCreatedAt(),
                            complaint.getResolvedAt(),
                            complaint.getUser() != null ? complaint.getUser().getId() : null,
                            complaint.getUser() != null ? complaint.getUser().getFullName() : null,
                            complaint.getProject() != null ? complaint.getProject().getId() : null
                    );
                })
                .collect(java.util.stream.Collectors.toList());
    }

    @GetMapping("/{id}")
    public ComplaintResponse getById(@PathVariable Long id) {
        Complaint complaint = complaintRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Complaint not found"));

        String photo = complaint.getPhotoUrl();
        String photoUrl = photo != null ? "/uploads/complaints/" + photo : null;
        
        // Parse multiple photo URLs
        List<String> photoUrlsList = new java.util.ArrayList<>();
        if (complaint.getPhotoUrls() != null && !complaint.getPhotoUrls().trim().isEmpty()) {
            String[] photos = complaint.getPhotoUrls().split(",");
            for (String p : photos) {
                if (!p.trim().isEmpty()) {
                    photoUrlsList.add("/uploads/complaints/" + p.trim());
                }
            }
        }

        return new ComplaintResponse(
                complaint.getId(),
                complaint.getTitle(),
                complaint.getDescription(),
                complaint.getSeverity(),
                complaint.getStatus(),
                complaint.getLat(),
                complaint.getLng(),
                photoUrl,
                photoUrlsList,
                complaint.getCreatedAt(),
                complaint.getResolvedAt(),
                complaint.getUser() != null ? complaint.getUser().getId() : null,
                complaint.getUser() != null ? complaint.getUser().getFullName() : null,
                complaint.getProject() != null ? complaint.getProject().getId() : null
        );
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Complaint> create(
            @RequestPart(value = "data") ComplaintRequest req,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {

        if (userDetails == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");

        if (req.getTitle() == null || req.getTitle().trim().isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title is required");

        if (req.getDescription() == null || req.getDescription().trim().isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Description is required");

        if (req.getSeverity() == null || req.getSeverity() < 1 || req.getSeverity() > 5)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Severity must be between 1 and 5");

        if (req.getLat() == null || req.getLng() == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Latitude and longitude are required");

        User citizen = userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Complaint complaint = new Complaint();
        complaint.setTitle(req.getTitle().trim());
        complaint.setDescription(req.getDescription().trim());
        complaint.setSeverity(req.getSeverity());
        complaint.setLat(req.getLat());
        complaint.setLng(req.getLng());
        complaint.setUser(citizen);
        complaint.setStatus("Pending");
        complaint.setCreatedAt(Instant.now());

        if (req.getProjectId() != null) {
            Project project = projectRepo.findById(req.getProjectId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
            complaint.setProject(project);
        }

        // Handle multiple file uploads
        if (files != null && !files.isEmpty()) {
            Files.createDirectories(uploadBase);
            List<String> uploadedFilenames = new java.util.ArrayList<>();
            
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    try {
                        String originalFilename = file.getOriginalFilename();
                        if (originalFilename == null || originalFilename.isEmpty()) {
                            originalFilename = "image.jpg";
                        }
                        String filename = System.currentTimeMillis() + "_" + Path.of(originalFilename).getFileName();
                        Path target = uploadBase.resolve(filename);
                        Files.write(target, file.getBytes(), StandardOpenOption.CREATE_NEW);
                        uploadedFilenames.add(filename);
                        
                        // Small delay to ensure unique timestamps
                        Thread.sleep(10);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                }
            }
            
            if (!uploadedFilenames.isEmpty()) {
                // Store first image in photoUrl for backward compatibility
                complaint.setPhotoUrl(uploadedFilenames.get(0));
                // Store all images as comma-separated list
                complaint.setPhotoUrls(String.join(",", uploadedFilenames));
            }
        }

        Complaint saved = complaintRepo.save(complaint);
        
        // Notify user about successful submission
        try {
            notificationService.createNotification(
                com.nagar_sewak.backend.services.NotificationService.NotificationDTO.builder()
                    .userId(citizen.getId())
                    .type(NotificationType.COMPLAINT_CREATED)
                    .priority(com.nagar_sewak.backend.entities.NotificationPriority.MEDIUM)
                    .title("Complaint Submitted")
                    .message("Your complaint '" + saved.getTitle() + "' has been successfully submitted.")
                    .actionUrl("/complaints/" + saved.getId())
                    .build()
            );
        } catch (Exception e) {
            // Log error but don't fail the request
            System.err.println("Failed to send complaint creation notification: " + e.getMessage());
        }

        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Complaint> updateComplaint(
            @PathVariable Long id,
            @RequestBody ComplaintRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null)
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");

        Complaint complaint = complaintRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Complaint not found"));

        if (req.getTitle() != null && !req.getTitle().trim().isEmpty())
            complaint.setTitle(req.getTitle().trim());

        if (req.getDescription() != null && !req.getDescription().trim().isEmpty())
            complaint.setDescription(req.getDescription().trim());

        if (req.getSeverity() != null && req.getSeverity() >= 1 && req.getSeverity() <= 5)
            complaint.setSeverity(req.getSeverity());

        if (req.getStatus() != null && !req.getStatus().trim().isEmpty()) {
            String newStatus = req.getStatus().trim();
            boolean isResolving = "resolved".equalsIgnoreCase(newStatus);
            complaint.setStatus(newStatus);
            if (isResolving && complaint.getResolvedAt() == null) {
                complaint.setResolvedAt(Instant.now());
            } else if (!isResolving) {
                complaint.setResolvedAt(null);
            }
        }

        return ResponseEntity.ok(complaintRepo.save(complaint));
    }

    public static final class ComplaintResponse {
        public final Long id;
        public final String title;
        public final String description;
        public final int severity;
        public final String status;
        public final Double lat;
        public final Double lng;
        public final String photoUrl;
        public final List<String> photoUrls;
        public final Instant createdAt;
        public final Instant resolvedAt;
        public final Long userId;
        public final String userFullName;
        public final Long projectId;

        public ComplaintResponse(Long id, String title, String description, int severity, String status,
                                 Double lat, Double lng, String photoUrl, List<String> photoUrls, Instant createdAt, Instant resolvedAt,
                                 Long userId, String userFullName, Long projectId) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.severity = severity;
            this.status = status;
            this.lat = lat;
            this.lng = lng;
            this.photoUrl = photoUrl;
            this.photoUrls = photoUrls;
            this.createdAt = createdAt;
            this.resolvedAt = resolvedAt;
            this.userId = userId;
            this.userFullName = userFullName;
            this.projectId = projectId;
        }
    }
    
    // ===== VOTING ENDPOINTS =====
    
    @PostMapping("/{id}/vote")
    public ResponseEntity<?> voteComplaint(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        
        Complaint complaint = complaintRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Complaint not found"));
        
        // Check if already voted
        if (voteRepo.existsByComplaintIdAndUserId(id, user.getId())) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Already voted"));
        }
        
        // Create vote
        com.nagar_sewak.backend.entities.ComplaintVote vote = new com.nagar_sewak.backend.entities.ComplaintVote();
        vote.setComplaint(complaint);
        vote.setUser(user);
        voteRepo.save(vote);
        
        long voteCount = voteRepo.countByComplaintId(id);
        return ResponseEntity.ok(java.util.Map.of(
            "success", true,
            "voteCount", voteCount,
            "hasVoted", true
        ));
    }
    
    @DeleteMapping("/{id}/vote")
    public ResponseEntity<?> unvoteComplaint(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        
        voteRepo.deleteByComplaintIdAndUserId(id, user.getId());
        
        long voteCount = voteRepo.countByComplaintId(id);
        return ResponseEntity.ok(java.util.Map.of(
            "success", true,
            "voteCount", voteCount,
            "hasVoted", false
        ));
    }
    
    @GetMapping("/{id}/votes")
    public ResponseEntity<?> getVotes(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        long voteCount = voteRepo.countByComplaintId(id);
        boolean hasVoted = false;
        
        if (userDetails != null) {
            User user = userRepo.findByUsername(userDetails.getUsername()).orElse(null);
            if (user != null) {
                hasVoted = voteRepo.existsByComplaintIdAndUserId(id, user.getId());
            }
        }
        
        return ResponseEntity.ok(java.util.Map.of(
            "voteCount", voteCount,
            "hasVoted", hasVoted
        ));
    }
    
    // ===== COMMENTS ENDPOINTS =====
    
    @GetMapping("/{id}/comments")
    public List<CommentResponse> getComments(@PathVariable Long id) {
        return commentRepo.findByComplaintIdOrderByCreatedAtDesc(id).stream()
                .map(comment -> new CommentResponse(
                    comment.getId(),
                    comment.getUser().getId(),
                    comment.getUser().getUsername(),
                    comment.getUser().getFullName(),
                    comment.getUser().getRoles().stream().findFirst().map(Role::name).orElse("CITIZEN"),
                    comment.getContent(),
                    comment.getCreatedAt(),
                    comment.getUpdatedAt(),
                    comment.getEdited()
                ))
                .toList();
    }
    
    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        
        Complaint complaint = complaintRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Complaint not found"));
        
        String content = body.get("content");
        if (content == null || content.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Content is required");
        }
        
        com.nagar_sewak.backend.entities.ComplaintComment comment = new com.nagar_sewak.backend.entities.ComplaintComment();
        comment.setComplaint(complaint);
        comment.setUser(user);
        comment.setContent(content.trim());
        comment = commentRepo.save(comment);
        
        // Process @mentions
        processMentions(comment, content);
        
        // Notify complaint owner (if not the commenter)
        if (!complaint.getUser().getId().equals(user.getId())) {
            notificationService.createNotification(
                com.nagar_sewak.backend.services.NotificationService.NotificationDTO.builder()
                    .userId(complaint.getUser().getId())
                    .type(NotificationType.COMMENT)
                    .priority(NotificationPriority.MEDIUM)
                    .title("New Comment on Your Complaint")
                    .message(user.getFullName() + " commented: " + content.substring(0, Math.min(100, content.length())))
                    .actionUrl("/complaints/" + id)
                    .build()
            );
        }
        
        return ResponseEntity.ok(new CommentResponse(
            comment.getId(),
            user.getId(),
            user.getUsername(),
            user.getFullName(),
            user.getRoles().stream().findFirst().map(Role::name).orElse("CITIZEN"),
            comment.getContent(),
            comment.getCreatedAt(),
            comment.getUpdatedAt(),
            comment.getEdited()
        ));
    }
    
    private void processMentions(com.nagar_sewak.backend.entities.ComplaintComment comment, String content) {
        // Find @mentions in content
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("@(\\w+)");
        java.util.regex.Matcher matcher = pattern.matcher(content);
        
        while (matcher.find()) {
            String username = matcher.group(1);
            userRepo.findByUsername(username).ifPresent(mentionedUser -> {
                // Create mention record
                var mention = new com.nagar_sewak.backend.entities.CommentMention();
                mention.setComment(comment);
                mention.setMentionedUser(mentionedUser);
                commentMentionRepo.save(mention);
                
                // Send notification
                notificationService.createNotification(
                    com.nagar_sewak.backend.services.NotificationService.NotificationDTO.builder()
                        .userId(mentionedUser.getId())
                        .type(NotificationType.MENTION)
                        .priority(NotificationPriority.HIGH)
                        .title("You were mentioned in a comment")
                        .message(comment.getUser().getFullName() + " mentioned you: " + content.substring(0, Math.min(100, content.length())))
                        .actionUrl("/complaints/" + comment.getComplaint().getId())
                        .build()
                );
            });
        }
    }
    
    @PutMapping("/{id}/comments/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long id,
            @PathVariable Long commentId,
            @RequestBody java.util.Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        
        com.nagar_sewak.backend.entities.ComplaintComment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
        
        if (!comment.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your comment");
        }
        
        String content = body.get("content");
        if (content == null || content.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Content is required");
        }
        
        comment.setContent(content.trim());
        comment = commentRepo.save(comment);
        
        return ResponseEntity.ok(new CommentResponse(
            comment.getId(),
            user.getId(),
            user.getUsername(),
            user.getFullName(),
            user.getRoles().stream().findFirst().map(Role::name).orElse("CITIZEN"),
            comment.getContent(),
            comment.getCreatedAt(),
            comment.getUpdatedAt(),
            comment.getEdited()
        ));
    }
    
    @DeleteMapping("/{id}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long id,
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        
        com.nagar_sewak.backend.entities.ComplaintComment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
        
        // Allow deletion by comment owner or admin
        boolean isAdmin = user.getRoles().contains("ADMIN") || user.getRoles().contains("SUPER_ADMIN");
        if (!comment.getUser().getId().equals(user.getId()) && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }
        
        commentRepo.delete(comment);
        return ResponseEntity.ok(java.util.Map.of("success", true));
    }
    
    // ===== COMMENT REACTIONS =====
    
    @PostMapping("/{id}/comments/{commentId}/reactions")
    public ResponseEntity<?> addReaction(
            @PathVariable Long id,
            @PathVariable Long commentId,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        
        com.nagar_sewak.backend.entities.ComplaintComment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
        
        String reactionType = request.get("type");
        com.nagar_sewak.backend.entities.CommentReaction.ReactionType type;
        try {
            type = com.nagar_sewak.backend.entities.CommentReaction.ReactionType.valueOf(reactionType.toUpperCase());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid reaction type");
        }
        
        // Check if user already reacted
        var existingReaction = commentReactionRepo.findByCommentAndUser(comment, user);
        if (existingReaction.isPresent()) {
            // Update reaction
            var reaction = existingReaction.get();
            reaction.setType(type);
            commentReactionRepo.save(reaction);
        } else {
            // Create new reaction
            var reaction = new com.nagar_sewak.backend.entities.CommentReaction();
            reaction.setComment(comment);
            reaction.setUser(user);
            reaction.setType(type);
            commentReactionRepo.save(reaction);
        }
        
        return ResponseEntity.ok(Map.of("success", true));
    }
    
    @DeleteMapping("/{id}/comments/{commentId}/reactions")
    public ResponseEntity<?> removeReaction(
            @PathVariable Long id,
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        
        com.nagar_sewak.backend.entities.ComplaintComment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
        
        commentReactionRepo.deleteByCommentAndUser(comment, user);
        return ResponseEntity.ok(Map.of("success", true));
    }
    
    @GetMapping("/{id}/comments/{commentId}/reactions")
    public ResponseEntity<?> getReactions(
            @PathVariable Long id,
            @PathVariable Long commentId) {
        
        com.nagar_sewak.backend.entities.ComplaintComment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
        
        var reactions = commentReactionRepo.findByComment(comment);
        
        // Count reactions by type
        Map<String, Long> counts = new java.util.HashMap<>();
        for (var type : com.nagar_sewak.backend.entities.CommentReaction.ReactionType.values()) {
            long count = commentReactionRepo.countByCommentAndType(comment, type);
            if (count > 0) {
                counts.put(type.name().toLowerCase(), count);
            }
        }
        
        return ResponseEntity.ok(counts);
    }
    
    // ===== COMMENT ATTACHMENTS =====
    
    @PostMapping("/{id}/comments/{commentId}/attachments")
    public ResponseEntity<?> addAttachment(
            @PathVariable Long id,
            @PathVariable Long commentId,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        
        com.nagar_sewak.backend.entities.ComplaintComment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
        
        // Verify user owns the comment
        if (!comment.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }
        
        try {
            // Save file
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get("uploads/comments");
            Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Create attachment record
            var attachment = new com.nagar_sewak.backend.entities.CommentAttachment();
            attachment.setComment(comment);
            attachment.setFileName(file.getOriginalFilename());
            attachment.setFileUrl("/uploads/comments/" + fileName);
            attachment.setFileType(file.getContentType());
            attachment.setFileSize(file.getSize());
            commentAttachmentRepo.save(attachment);
            
            return ResponseEntity.ok(Map.of(
                "id", attachment.getId(),
                "fileName", attachment.getFileName(),
                "fileUrl", attachment.getFileUrl(),
                "fileType", attachment.getFileType(),
                "fileSize", attachment.getFileSize()
            ));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload file");
        }
    }
    
    @DeleteMapping("/{id}/comments/{commentId}/attachments/{attachmentId}")
    public ResponseEntity<?> deleteAttachment(
            @PathVariable Long id,
            @PathVariable Long commentId,
            @PathVariable Long attachmentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        
        var attachment = commentAttachmentRepo.findById(attachmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Attachment not found"));
        
        // Verify user owns the comment
        if (!attachment.getComment().getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }
        
        // Delete file
        try {
            Path filePath = Paths.get(attachment.getFileUrl().substring(1)); // Remove leading /
            Files.deleteIfExists(filePath);
        } catch (Exception e) {
            // Log error but continue
        }
        
        commentAttachmentRepo.delete(attachment);
        return ResponseEntity.ok(Map.of("success", true));
    }
    
    record CommentResponse(
        Long id,
        Long userId,
        String username,
        String userFullName,
        String userRole,
        String content,
        java.time.LocalDateTime createdAt,
        java.time.LocalDateTime updatedAt,
        Boolean edited
    ) {}
}
