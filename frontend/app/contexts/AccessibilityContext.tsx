"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilityContextType {
    highContrast: boolean;
    fontSize: 'normal' | 'large' | 'extra-large';
    reducedMotion: boolean;
    screenReaderMode: boolean;
    toggleHighContrast: () => void;
    setFontSize: (size: 'normal' | 'large' | 'extra-large') => void;
    toggleReducedMotion: () => void;
    toggleScreenReaderMode: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
    children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
    const [highContrast, setHighContrast] = useState(false);
    const [fontSize, setFontSizeState] = useState<'normal' | 'large' | 'extra-large'>('normal');
    const [reducedMotion, setReducedMotion] = useState(false);
    const [screenReaderMode, setScreenReaderMode] = useState(false);

    // Load preferences from localStorage on mount
    useEffect(() => {
        try {
            const savedHighContrast = localStorage.getItem('accessibility-high-contrast');
            const savedFontSize = localStorage.getItem('accessibility-font-size');
            const savedReducedMotion = localStorage.getItem('accessibility-reduced-motion');
            const savedScreenReader = localStorage.getItem('accessibility-screen-reader');

            if (savedHighContrast) {
                setHighContrast(JSON.parse(savedHighContrast));
            }
            if (savedFontSize && ['normal', 'large', 'extra-large'].includes(savedFontSize)) {
                setFontSizeState(savedFontSize as 'normal' | 'large' | 'extra-large');
            }
            if (savedReducedMotion) {
                setReducedMotion(JSON.parse(savedReducedMotion));
            }
            if (savedScreenReader) {
                setScreenReaderMode(JSON.parse(savedScreenReader));
            }

            // Check for system preferences
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion && !savedReducedMotion) {
                setReducedMotion(true);
            }

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
        
        // High contrast mode
        if (highContrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }

        // Font size
        root.classList.remove('font-normal', 'font-large', 'font-extra-large');
        root.classList.add(`font-${fontSize}`);

        // Reduced motion
        if (reducedMotion) {
            root.classList.add('reduced-motion');
        } else {
            root.classList.remove('reduced-motion');
        }

        // Screen reader mode
        if (screenReaderMode) {
            root.classList.add('screen-reader-mode');
        } else {
            root.classList.remove('screen-reader-mode');
        }
    }, [highContrast, fontSize, reducedMotion, screenReaderMode]);

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

    const toggleReducedMotion = () => {
        const newValue = !reducedMotion;
        setReducedMotion(newValue);
        try {
            localStorage.setItem('accessibility-reduced-motion', JSON.stringify(newValue));
        } catch (error) {
            console.warn('Failed to save reduced motion preference:', error);
        }
    };

    const toggleScreenReaderMode = () => {
        const newValue = !screenReaderMode;
        setScreenReaderMode(newValue);
        try {
            localStorage.setItem('accessibility-screen-reader', JSON.stringify(newValue));
        } catch (error) {
            console.warn('Failed to save screen reader preference:', error);
        }
    };

    const value: AccessibilityContextType = {
        highContrast,
        fontSize,
        reducedMotion,
        screenReaderMode,
        toggleHighContrast,
        setFontSize,
        toggleReducedMotion,
        toggleScreenReaderMode,
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