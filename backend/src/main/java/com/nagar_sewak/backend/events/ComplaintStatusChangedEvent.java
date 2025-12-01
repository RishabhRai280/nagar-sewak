package com.nagar_sewak.backend.events;

import com.nagar_sewak.backend.entities.Complaint;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class ComplaintStatusChangedEvent extends ApplicationEvent {
    private final Complaint complaint;
    private final String oldStatus;
    private final String newStatus;

    public ComplaintStatusChangedEvent(Object source, Complaint complaint, String oldStatus, String newStatus) {
        super(source);
        this.complaint = complaint;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
    }
}
