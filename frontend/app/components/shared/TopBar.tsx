'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import LanguageSwitcher from './LanguageSwitcher';

export default function TopBar() {
    return (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-b border-slate-700/50 py-2 px-4 lg:px-8 flex justify-between items-center z-50 relative shadow-lg">

            {/* Left: Government Identity */}
            <div className="flex items-center gap-3">
                <span className="text-xs md:text-sm font-bold tracking-wide uppercase">
                    Government of India
                </span>
                <span className="hidden md:inline h-4 w-[1px] bg-slate-600"></span>
                <span className="hidden md:inline text-xs opacity-90">
                    Ministry of Urban Affairs
                </span>
            </div>

            {/* Right: Language Switcher */}
            <div className="flex items-center">
                <LanguageSwitcher />
            </div>
        </div>
    );
}
