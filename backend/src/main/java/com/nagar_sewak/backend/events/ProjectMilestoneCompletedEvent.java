package com.nagar_sewak.backend.events;

import com.nagar_sewak.backend.entities.Project;
import com.nagar_sewak.backend.entities.ProjectMilestone;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ProjectMilestoneCompletedEvent extends ApplicationEvent {
    private final Project project;
    private final ProjectMilestone milestone;

    public ProjectMilestoneCompletedEvent(Object source, Project project, ProjectMilestone milestone) {
        super(source);
        this.project = project;
        this.milestone = milestone;
    }
}
