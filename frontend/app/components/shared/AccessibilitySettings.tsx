"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '@/app/contexts/AccessibilityContext';
import { Settings, Moon, Sun, Type, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AccessibilitySettings() {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const {
        highContrast,
        fontSize,
        toggleHighContrast,
        setFontSize,
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
                className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 group"
                aria-label="Open accessibility settings"
                title="Accessibility Settings"
                aria-describedby="accessibility-description"
            >
                <Settings size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                <span id="accessibility-description" className="sr-only">
                    Configure accessibility options including dark mode and font size
                </span>
            </button>

            {/* Accessibility Settings Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                            onClick={() => setIsOpen(false)}
                            aria-hidden="true"
                        />

                        {/* Modal */}
                        <motion.div
                            ref={modalRef}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200"
                            role="dialog"
                            aria-labelledby="accessibility-title"
                            aria-modal="true"
                            tabIndex={-1}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-slate-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Settings className="text-blue-600" size={20} />
                                    </div>
                                    <h2 id="accessibility-title" className="text-xl font-bold text-slate-900">
                                        Accessibility Settings
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label="Close accessibility settings"
                                >
                                    <X size={20} className="text-slate-600" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Dark Mode (High Contrast) */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-gradient-to-br from-slate-50 to-blue-50 p-5 rounded-xl border border-slate-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${highContrast ? 'bg-slate-800' : 'bg-amber-100'
                                                }`}>
                                                {highContrast ? (
                                                    <Moon size={24} className="text-blue-400" />
                                                ) : (
                                                    <Sun size={24} className="text-amber-600" />
                                                )}
                                            </div>
                                            <div>
                                                <label htmlFor="dark-mode" className="text-base font-bold text-slate-900 block">
                                                    Dark Mode
                                                </label>
                                                <p id="dark-mode-desc" className="text-sm text-slate-600">
                                                    {highContrast ? 'Dark theme enabled' : 'Switch to dark theme'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            id="dark-mode"
                                            onClick={toggleHighContrast}
                                            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50 shadow-inner ${highContrast ? 'bg-blue-600' : 'bg-slate-300'
                                                }`}
                                            role="switch"
                                            aria-checked={highContrast}
                                            aria-labelledby="dark-mode"
                                            aria-describedby="dark-mode-desc"
                                        >
                                            <span
                                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-md ${highContrast ? 'translate-x-7' : 'translate-x-1'
                                                    }`}
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Font Size */}
                                <motion.fieldset
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="bg-gradient-to-br from-slate-50 to-purple-50 p-5 rounded-xl border border-slate-200"
                                >
                                    <legend className="sr-only">Font Size Options</legend>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                            <Type size={24} className="text-purple-600" />
                                        </div>
                                        <div>
                                            <label className="text-base font-bold text-slate-900 block">
                                                Text Size
                                            </label>
                                            <p id="font-size-desc" className="text-sm text-slate-600">
                                                Adjust text size for better readability
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-labelledby="font-size-desc">
                                        {(['normal', 'large', 'extra-large'] as const).map((size, index) => (
                                            <motion.button
                                                key={size}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 + index * 0.05 }}
                                                onClick={() => setFontSize(size)}
                                                className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-500/50 font-semibold ${fontSize === size
                                                        ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/30 scale-105'
                                                        : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:bg-purple-50'
                                                    }`}
                                                role="radio"
                                                aria-checked={fontSize === size}
                                                aria-label={`Set font size to ${size}`}
                                            >
                                                <div className="text-center">
                                                    <div className={`${size === 'normal' ? 'text-sm' :
                                                            size === 'large' ? 'text-base' :
                                                                'text-lg'
                                                        }`}>
                                                        A
                                                    </div>
                                                    <div className="text-xs mt-1 opacity-80">
                                                        {size === 'normal' && 'Normal'}
                                                        {size === 'large' && 'Large'}
                                                        {size === 'extra-large' && 'X-Large'}
                                                    </div>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.fieldset>
                            </div>

                            {/* Footer */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-b-2xl border-t border-slate-200"
                            >
                                <p className="text-xs text-slate-600 text-center flex items-center justify-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Settings are automatically saved
                                </p>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}