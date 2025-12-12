"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Languages, ShieldCheck, Landmark } from "lucide-react";
import Image from "next/image";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    illustration?: string;
    theme?: 'blue' | 'green';
}

export default function AuthLayout({ children, title, subtitle, illustration, theme = 'blue' }: AuthLayoutProps) {
    const bgColor = theme === 'green' ? 'bg-[#065f46]' : 'bg-[#1e3a8a]';
    const accentColorText = theme === 'green' ? 'text-emerald-200' : 'text-orange-200';
    const accentBorder = theme === 'green' ? 'border-emerald-400/30' : 'border-orange-400/30';
    const gradient = theme === 'green'
        ? 'from-[#f97316] via-white to-[#1e3a8a]' // Saffron -> White -> Blue (Reverse for green theme contrast)
        : 'from-[#f97316] via-white to-[#166534]'; // Saffron -> White -> Green (Standard)

    const flexDirection = theme === 'green' ? 'lg:flex-row-reverse' : 'lg:flex-row';

    return (
        <div className={`min-h-screen w-full flex flex-col ${flexDirection} bg-slate-50`}>

            {/* Side Panel - Official Government Branding */}
            <div className={`hidden lg:flex w-1/2 ${bgColor} relative overflow-hidden flex-col justify-center items-center p-12 text-white transition-colors duration-500`}>

                {/* Background Pattern - Subtle */}
                <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                    {/* Large Emblem */}
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                        alt="Satyamev Jayate"
                        className="w-48 h-48 invert brightness-0 opacity-95 drop-shadow-2xl"
                    />

                    <div className="space-y-2">
                        <h1 className="font-extrabold text-4xl tracking-widest uppercase mb-1">Government of India</h1>
                        <p className={`${accentColorText} text-sm tracking-[0.3em] uppercase font-bold border-t ${accentBorder} pt-4 inline-block px-8`}>
                            Ministry of Urban Affairs
                        </p>
                    </div>

                    <div className="mt-12 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/10 text-xs font-semibold text-white/90 tracking-wide uppercase">
                        Official Citizen Portal
                    </div>
                </div>

                {/* Footer Strip */}
                <div className={`absolute bottom-0 w-full h-2 bg-gradient-to-r ${gradient}`}></div>
            </div>

            {/* Right Panel - Auth Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12 relative bg-white">
                {/* Mobile Header (only visible on small screens) */}
                <div className="lg:hidden absolute top-0 left-0 w-full p-4 flex justify-between items-center bg-white border-b border-slate-100 mb-8">
                    <Link href="/" className="flex items-center gap-2">
                        <Landmark size={24} className="text-[#1e3a8a]" />
                        <span className="font-bold text-[#1e3a8a]">Nagar Sewak</span>
                    </Link>
                </div>

                <div className="w-full max-w-md mx-auto pt-16 lg:pt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Clean Form Container - No "Box" Wrapper */}
                        <div className="p-2">
                            {children}
                        </div>

                        {/* Footer Links */}
                        <div className="mt-12 text-center text-xs text-slate-400 flex flex-col gap-2">
                            <p>© 2024 Nagar Sewak. All rights reserved.</p>
                            <div className="flex justify-center gap-4">
                                <Link href="/privacy" className="hover:text-blue-800 underline transition-colors">Privacy Policy</Link>
                                <Link href="/terms" className="hover:text-blue-800 underline transition-colors">Terms of Service</Link>
                                <Link href="/help" className="hover:text-blue-800 underline transition-colors">Help & Support</Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
