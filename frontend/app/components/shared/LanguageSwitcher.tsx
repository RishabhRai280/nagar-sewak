"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useTransition, useEffect } from 'react';

const languages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' }
];

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const switchLanguage = (newLocale: string) => {
        setIsOpen(false);

        startTransition(() => {
            // Store language preference in localStorage
            try {
                localStorage.setItem('preferred-language', newLocale);
            } catch (error) {
                console.warn('Failed to save language preference:', error);
            }

            // Remove the current locale from the pathname and add the new one
            const pathWithoutLocale = pathname.replace(/^\/(en|hi)/, '');
            const newPath = `/${newLocale}${pathWithoutLocale || ''}`;
            router.push(newPath);
            router.refresh();
        });
    };

    const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

    // Load saved language preference on mount
    useEffect(() => {
        try {
            const savedLanguage = localStorage.getItem('preferred-language');
            if (savedLanguage && savedLanguage !== locale && languages.some(lang => lang.code === savedLanguage)) {
                // Only switch if the saved language is different from current and is valid
                const pathWithoutLocale = pathname.replace(/^\/(en|hi)/, '');
                const newPath = `/${savedLanguage}${pathWithoutLocale || ''}`;
                router.replace(newPath);
            }
        } catch (error) {
            console.warn('Failed to load language preference:', error);
        }
    }, []); // Empty dependency array to run only on mount

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 border border-white/20 disabled:opacity-50"
                aria-label="Change language"
                disabled={isPending}
            >
                <Globe size={16} className={`text-white ${isPending ? 'animate-spin' : ''}`} />
                <span className="text-sm font-semibold text-white">
                    {currentLanguage.nativeName}
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 ring-1 ring-black/5"
                        >
                            <div className="p-2">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => switchLanguage(lang.code)}
                                        className={`w-full px-4 py-3 text-left rounded-lg transition-all duration-200 flex items-center justify-between group ${locale === lang.code
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-slate-700 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{lang.flag}</span>
                                            <div>
                                                <div className={`font-semibold ${locale === lang.code ? 'text-blue-700' : 'text-slate-900'
                                                    }`}>
                                                    {lang.nativeName}
                                                </div>
                                                <div className="text-xs text-slate-500">{lang.name}</div>
                                            </div>
                                        </div>
                                        {locale === lang.code && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center"
                                            >
                                                <Check size={14} className="text-white" />
                                            </motion.div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
