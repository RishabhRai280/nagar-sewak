package com.nagar_sewak.backend.events;

import com.nagar_sewak.backend.entities.Tender;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class TenderPublishedEvent extends ApplicationEvent {
    private final Tender tender;

    public TenderPublishedEvent(Object source, Tender tender) {
        super(source);
        this.tender = tender;
    }
}
