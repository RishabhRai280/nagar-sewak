"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilityContextType {
    highContrast: boolean;
    fontSize: 'normal' | 'large' | 'extra-large';
    toggleHighContrast: () => void;
    setFontSize: (size: 'normal' | 'large' | 'extra-large') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
    children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
    const [highContrast, setHighContrast] = useState(false);
    const [fontSize, setFontSizeState] = useState<'normal' | 'large' | 'extra-large'>('normal');

    // Load preferences from localStorage on mount
    useEffect(() => {
        try {
            const savedHighContrast = localStorage.getItem('accessibility-high-contrast');
            const savedFontSize = localStorage.getItem('accessibility-font-size');

            if (savedHighContrast) {
                setHighContrast(JSON.parse(savedHighContrast));
            }
            if (savedFontSize && ['normal', 'large', 'extra-large'].includes(savedFontSize)) {
                setFontSizeState(savedFontSize as 'normal' | 'large' | 'extra-large');
            }

            // Check for system preferences
            const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
            if (prefersHighContrast && !savedHighContrast) {
                setHighContrast(true);
            }
        } catch (error) {
            console.warn('Failed to load accessibility preferences:', error);
        }
    }, []);

    // Apply accessibility settings to document
    useEffect(() => {
        const root = document.documentElement;

        // High contrast mode (Dark Mode)
        if (highContrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }

        // Font size
        root.classList.remove('font-normal', 'font-large', 'font-extra-large');
        root.classList.add(`font-${fontSize}`);
    }, [highContrast, fontSize]);

    const toggleHighContrast = () => {
        const newValue = !highContrast;
        setHighContrast(newValue);
        try {
            localStorage.setItem('accessibility-high-contrast', JSON.stringify(newValue));
        } catch (error) {
            console.warn('Failed to save high contrast preference:', error);
        }
    };

    const setFontSize = (size: 'normal' | 'large' | 'extra-large') => {
        setFontSizeState(size);
        try {
            localStorage.setItem('accessibility-font-size', size);
        } catch (error) {
            console.warn('Failed to save font size preference:', error);
        }
    };

    const value: AccessibilityContextType = {
        highContrast,
        fontSize,
        toggleHighContrast,
        setFontSize,
    };

    return (
        <AccessibilityContext.Provider value={value}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility() {
    const context = useContext(AccessibilityContext);
    if (context === undefined) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
}