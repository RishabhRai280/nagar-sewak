package com.nagar_sewak.backend.events;

import com.nagar_sewak.backend.entities.Tender;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class TenderStatusChangedEvent extends ApplicationEvent {
    private final Tender tender;
    private final String oldStatus;
    private final String newStatus;
    private final String rejectionReason;

    public TenderStatusChangedEvent(Object source, Tender tender, String oldStatus, String newStatus, String rejectionReason) {
        super(source);
        this.tender = tender;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.rejectionReason = rejectionReason;
    }
}
