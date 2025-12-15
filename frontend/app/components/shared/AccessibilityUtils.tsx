"use client";

// Status announcement component for dynamic updates
export function StatusAnnouncement({ 
    message, 
    priority = 'polite' 
}: { 
    message: string;
    priority?: 'polite' | 'assertive';
}) {
    return (
        <div
            role="status"
            aria-live={priority}
            aria-atomic="true"
            className="sr-only"
        >
            {message}
        </div>
    );
}