package com.nagar_sewak.backend.repositories;


import com.nagar_sewak.backend.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    long countByStatus(String status);

    List<Project> findByContractorId(Long contractorId);
}