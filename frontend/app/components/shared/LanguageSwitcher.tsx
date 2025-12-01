"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useTransition } from 'react';

const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' }
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
            // Remove the current locale from the pathname and add the new one
            const pathWithoutLocale = pathname.replace(/^\/(en|hi)/, '');
            const newPath = `/${newLocale}${pathWithoutLocale || ''}`;
            router.push(newPath);
            router.refresh();
        });
    };

    const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
                aria-label="Change language"
                disabled={isPending}
            >
                <Globe size={18} className={`text-slate-600 ${isPending ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium text-slate-700">
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
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50"
                        >
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => switchLanguage(lang.code)}
                                    className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-between ${locale === lang.code ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                                        }`}
                                >
                                    <div>
                                        <div className="font-medium">{lang.nativeName}</div>
                                        <div className="text-xs text-slate-500">{lang.name}</div>
                                    </div>
                                    {locale === lang.code && (
                                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
