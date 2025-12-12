package com.nagar_sewak.backend.repositories;

import com.nagar_sewak.backend.entities.ProjectMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMilestoneRepository extends JpaRepository<ProjectMilestone, Long> {
    List<ProjectMilestone> findByProjectIdOrderByPercentageAsc(Long projectId);
    Optional<ProjectMilestone> findByProjectIdAndPercentage(Long projectId, Integer percentage);
}
