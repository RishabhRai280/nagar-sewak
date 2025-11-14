package com.nagar_sewak.backend.repositories;


import com.nagar_sewak.backend.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    long countByStatus(String status);
}