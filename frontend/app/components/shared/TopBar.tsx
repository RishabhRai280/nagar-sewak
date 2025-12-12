'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Minus, Plus, RefreshCw, Volume2 } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function TopBar() {
    const t = useTranslations('nav'); // Assuming 'nav' has some labels, or use 'common'
    const [fontSize, setFontSize] = useState(100);

    const adjustFontSize = (action: 'increase' | 'decrease' | 'reset') => {
        const root = document.documentElement;
        let newSize = fontSize;

        if (action === 'increase' && fontSize < 120) newSize += 5;
        if (action === 'decrease' && fontSize > 90) newSize -= 5;
        if (action === 'reset') newSize = 100;

        setFontSize(newSize);
        root.style.fontSize = `${newSize}%`;
    };

    return (
        <div className="bg-slate-900/90 text-[11px] md:text-xs text-white border-b border-slate-700 py-1.5 px-4 lg:px-6 flex flex-col md:flex-row justify-between items-center z-50 relative gap-2 md:gap-0">

            {/* Left: Government Identity */}
            <div className="flex items-center gap-4">
                <span className="font-bold tracking-wide uppercase opacity-90">
                    Government of India
                </span>
                <span className="hidden md:inline h-3 w-[1px] bg-slate-600"></span>
                <span className="hidden md:inline opacity-80">
                    Ministry of Urban Affairs
                </span>
            </div>

            {/* Right: Accessibility & Tools */}
            <div className="flex items-center gap-4">

                {/* Skip Content */}
                <a href="#main-content" className="hover:underline hidden sm:block text-slate-300 hover:text-white transition">
                    Skip to Main Content
                </a>

                <span className="h-3 w-[1px] bg-slate-600 hidden sm:block"></span>

                {/* Screen Reader (Mock) */}
                <button className="flex items-center gap-1 hover:text-white text-slate-300" title="Screen Reader">
                    <Volume2 size={12} /> <span className="sr-only">Screen Reader Access</span>
                </button>

                <span className="h-3 w-[1px] bg-slate-600"></span>

                {/* Font Resize */}
                <div className="flex items-center bg-slate-800 rounded px-1">
                    <button
                        onClick={() => adjustFontSize('decrease')}
                        className="px-1.5 py-0.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white font-serif"
                        title="Decrease Font Size"
                    >
                        A-
                    </button>
                    <button
                        onClick={() => adjustFontSize('reset')}
                        className="px-1.5 py-0.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white font-serif"
                        title="Reset Font Size"
                    >
                        A
                    </button>
                    <button
                        onClick={() => adjustFontSize('increase')}
                        className="px-1.5 py-0.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white font-serif"
                        title="Increase Font Size"
                    >
                        A+
                    </button>
                </div>

                <span className="h-3 w-[1px] bg-slate-600"></span>

                {/* Language */}
                <div className="scale-90 origin-right">
                    <LanguageSwitcher />
                </div>
            </div>
        </div>
    );
}
