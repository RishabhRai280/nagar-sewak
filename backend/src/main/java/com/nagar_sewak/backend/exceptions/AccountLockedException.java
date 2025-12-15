package com.nagar_sewak.backend.exceptions;

import org.springframework.security.core.AuthenticationException;

public class AccountLockedException extends AuthenticationException {
    
    private final long remainingLockTimeMinutes;
    
    public AccountLockedException(String message, long remainingLockTimeMinutes) {
        super(message);
        this.remainingLockTimeMinutes = remainingLockTimeMinutes;
    }
    
    public long getRemainingLockTimeMinutes() {
        return remainingLockTimeMinutes;
    }
}