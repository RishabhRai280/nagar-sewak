"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '@/app/contexts/AccessibilityContext';
import { Settings, Eye, Type, Zap, Volume2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AccessibilitySettings() {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const {
        highContrast,
        fontSize,
        reducedMotion,
        screenReaderMode,
        toggleHighContrast,
        setFontSize,
        toggleReducedMotion,
        toggleScreenReaderMode,
    } = useAccessibility();

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            // Focus the modal when it opens
            modalRef.current?.focus();
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    // Trap focus within modal
    useEffect(() => {
        if (isOpen && modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            const handleTabKey = (event: KeyboardEvent) => {
                if (event.key === 'Tab') {
                    if (event.shiftKey) {
                        if (document.activeElement === firstElement) {
                            event.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            event.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            };

            document.addEventListener('keydown', handleTabKey);
            return () => document.removeEventListener('keydown', handleTabKey);
        }
    }, [isOpen]);

    return (
        <>
            {/* Accessibility Settings Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-40 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Open accessibility settings"
                title="Accessibility Settings"
                aria-describedby="accessibility-description"
            >
                <Settings size={20} />
                <span id="accessibility-description" className="sr-only">
                    Configure accessibility options including high contrast mode, font size, and motion preferences
                </span>
            </button>

            {/* Accessibility Settings Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 z-50"
                            onClick={() => setIsOpen(false)}
                            aria-hidden="true"
                        />

                        {/* Modal */}
                        <motion.div
                            ref={modalRef}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200"
                            role="dialog"
                            aria-labelledby="accessibility-title"
                            aria-modal="true"
                            tabIndex={-1}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                <h2 id="accessibility-title" className="text-lg font-semibold text-slate-900">
                                    Accessibility Settings
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label="Close accessibility settings"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* High Contrast */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Eye size={20} className="text-slate-600" aria-hidden="true" />
                                        <div>
                                            <label htmlFor="high-contrast" className="text-sm font-medium text-slate-900">
                                                High Contrast Mode
                                            </label>
                                            <p id="high-contrast-desc" className="text-xs text-slate-600">
                                                Increases color contrast for better visibility
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        id="high-contrast"
                                        onClick={toggleHighContrast}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                            highContrast ? 'bg-blue-600' : 'bg-slate-200'
                                        }`}
                                        role="switch"
                                        aria-checked={highContrast}
                                        aria-labelledby="high-contrast"
                                        aria-describedby="high-contrast-desc"
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                highContrast ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>

                                {/* Font Size */}
                                <fieldset>
                                    <legend className="sr-only">Font Size Options</legend>
                                    <div className="flex items-center gap-3 mb-3">
                                        <Type size={20} className="text-slate-600" aria-hidden="true" />
                                        <div>
                                            <label className="text-sm font-medium text-slate-900">
                                                Font Size
                                            </label>
                                            <p id="font-size-desc" className="text-xs text-slate-600">
                                                Adjust text size for better readability
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-labelledby="font-size-desc">
                                        {(['normal', 'large', 'extra-large'] as const).map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setFontSize(size)}
                                                className={`px-3 py-2 text-xs rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    fontSize === size
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                                }`}
                                                role="radio"
                                                aria-checked={fontSize === size}
                                                aria-label={`Set font size to ${size}`}
                                            >
                                                {size === 'normal' && 'Normal'}
                                                {size === 'large' && 'Large'}
                                                {size === 'extra-large' && 'Extra Large'}
                                            </button>
                                        ))}
                                    </div>
                                </fieldset>

                                {/* Reduced Motion */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Zap size={20} className="text-slate-600" aria-hidden="true" />
                                        <div>
                                            <label htmlFor="reduced-motion" className="text-sm font-medium text-slate-900">
                                                Reduce Motion
                                            </label>
                                            <p id="reduced-motion-desc" className="text-xs text-slate-600">
                                                Minimizes animations and transitions
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        id="reduced-motion"
                                        onClick={toggleReducedMotion}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                            reducedMotion ? 'bg-blue-600' : 'bg-slate-200'
                                        }`}
                                        role="switch"
                                        aria-checked={reducedMotion}
                                        aria-labelledby="reduced-motion"
                                        aria-describedby="reduced-motion-desc"
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                reducedMotion ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>

                                {/* Screen Reader Mode */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Volume2 size={20} className="text-slate-600" aria-hidden="true" />
                                        <div>
                                            <label htmlFor="screen-reader" className="text-sm font-medium text-slate-900">
                                                Screen Reader Mode
                                            </label>
                                            <p id="screen-reader-desc" className="text-xs text-slate-600">
                                                Optimizes interface for screen readers
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        id="screen-reader"
                                        onClick={toggleScreenReaderMode}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                            screenReaderMode ? 'bg-blue-600' : 'bg-slate-200'
                                        }`}
                                        role="switch"
                                        aria-checked={screenReaderMode}
                                        aria-labelledby="screen-reader"
                                        aria-describedby="screen-reader-desc"
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                screenReaderMode ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-slate-50 rounded-b-xl">
                                <p className="text-xs text-slate-600 text-center">
                                    Settings are automatically saved and will persist across sessions
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}