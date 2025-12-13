"use client";

import Link from "next/link";
import { Book, User, Users, ShieldCheck, ChevronRight, HelpCircle } from 'lucide-react';
import Sidebar from "@/app/components/Sidebar";
import { useSidebar } from "@/app/contexts/SidebarContext";
import { useEffect, useState } from "react";
import { Token, fetchCurrentUserProfile, UserStore } from "@/lib/api/api";

export default function HelpCenterPage() {
    const { collapsed } = useSidebar();
    const [role, setRole] = useState<"citizen" | "contractor" | "admin">("citizen");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkRole = async () => {
            // 1. Try from store
            const cached = UserStore.get();
            if (cached) {
                setRole(deriveRole(cached.roles));
                setLoading(false);
                return;
            }

            // 2. Try fetch
            if (Token.get()) {
                try {
                    const profile = await fetchCurrentUserProfile();
                    setRole(deriveRole(profile.roles));
                } catch (e) {
                    console.error(e);
                }
            }
            setLoading(false);
        };

        checkRole();
    }, []);

    const deriveRole = (roles?: string[]): "citizen" | "contractor" | "admin" => {
        if (!roles || roles.length === 0) return "citizen";
        if (roles.includes("ADMIN") || roles.includes("SUPER_ADMIN")) return "admin";
        if (roles.includes("CONTRACTOR")) return "contractor";
        return "citizen";
    };

    return (
        <div className="flex min-h-screen relative bg-slate-50 overflow-hidden">
            <div className={`${collapsed ? 'w-16' : 'w-64'} flex-shrink-0 hidden lg:block transition-all duration-300`}></div>

            <Sidebar />

            <main className="flex-1 px-4 sm:px-6 lg:px-10 pb-12 pt-32 lg:pt-36 relative z-10 overflow-y-auto w-full transition-all duration-300">
                <div className="max-w-5xl mx-auto space-y-12">

                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-[#1e3a8a] text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-900/20">
                            <Book size={32} />
                        </div>
                        <h1 className="text-4xl font-black text-[#111827] tracking-tight uppercase">User Manual & Help Center</h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Complete documentation and guides for the Nagar Sewak Platform. Select your role below to get started.
                        </p>
                    </div>

                    {/* Guides Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Citizen Guide - Visible to Everyone */}
                        <Link href="/help/citizen-guide" className="group">
                            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-[#1e3a8a] transition-all duration-300 h-full flex flex-col relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e3a8a] to-[#f97316]"></div>
                                <div className="w-14 h-14 bg-blue-50 text-[#1e3a8a] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors border border-blue-100 group-hover:border-[#1e3a8a]">
                                    <User size={28} />
                                </div>
                                <h2 className="text-xl font-black text-[#111827] mb-3 uppercase tracking-wide group-hover:text-[#1e3a8a] transition-colors">Citizen Guide</h2>
                                <p className="text-slate-600 mb-6 flex-1 text-sm leading-relaxed">
                                    Complete walkthrough on how to report issues, track complaints, and engage with your community using the Citizen Dashboard.
                                </p>
                                <div className="flex items-center text-[#1e3a8a] font-bold text-sm uppercase tracking-wider gap-2">
                                    Read Manual <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>

                        {/* Contractor Guide - Only for Contractor & Admin */}
                        {(role === 'contractor' || role === 'admin') && (
                            <Link href="/help/contractor-guide" className="group">
                                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-emerald-600 transition-all duration-300 h-full flex flex-col relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-teal-500"></div>
                                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors border border-emerald-100 group-hover:border-emerald-600">
                                        <Users size={28} />
                                    </div>
                                    <h2 className="text-xl font-black text-[#111827] mb-3 uppercase tracking-wide group-hover:text-emerald-600 transition-colors">Contractor Guide</h2>
                                    <p className="text-slate-600 mb-6 flex-1 text-sm leading-relaxed">
                                        Instructions for viewing tenders, managing assigned projects, updating progress, and submitting documentation.
                                    </p>
                                    <div className="flex items-center text-emerald-600 font-bold text-sm uppercase tracking-wider gap-2">
                                        Read Manual <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Admin Guide - Only for Admin */}
                        {role === 'admin' && (
                            <Link href="/help/admin-guide" className="group">
                                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-purple-600 transition-all duration-300 h-full flex flex-col relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-indigo-500"></div>
                                    <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors border border-purple-100 group-hover:border-purple-600">
                                        <ShieldCheck size={28} />
                                    </div>
                                    <h2 className="text-xl font-black text-[#111827] mb-3 uppercase tracking-wide group-hover:text-purple-600 transition-colors">Admin Guide</h2>
                                    <p className="text-slate-600 mb-6 flex-1 text-sm leading-relaxed">
                                        Comprehensive administrative documentation for managing complaints, overseeing projects, and handling user roles.
                                    </p>
                                    <div className="flex items-center text-purple-600 font-bold text-sm uppercase tracking-wider gap-2">
                                        Read Manual <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>

                    {/* Support Section */}
                    <div className="bg-[#1e3a8a] rounded-2xl p-8 lg:p-12 text-center text-white relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 p-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 p-64 bg-white/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

                        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                            <HelpCircle size={48} className="mx-auto text-blue-200" />
                            <h2 className="text-3xl font-black uppercase tracking-tight">Need Further Assistance?</h2>
                            <p className="text-blue-100 text-lg">
                                If you can't find what you're looking for in the manuals, our support team is available 24/7 to assist you.
                            </p>
                            <div className="flex justify-center gap-4 pt-4">
                                <button className="px-8 py-3 bg-white text-[#1e3a8a] font-bold rounded-xl hover:bg-blue-50 transition shadow-lg uppercase tracking-wide">
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
