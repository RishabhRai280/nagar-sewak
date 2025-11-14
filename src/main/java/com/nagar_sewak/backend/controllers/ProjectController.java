package com.nagar_sewak.backend.controllers;

import com.nagar_sewak.backend.entities.Project;
import com.nagar_sewak.backend.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectRepository repo;

    @GetMapping
    public List<Project> all() {
        return repo.findAll();
    }

    @PostMapping
    public Project create(@RequestBody Project p) {
        return repo.save(p);
    }
}
