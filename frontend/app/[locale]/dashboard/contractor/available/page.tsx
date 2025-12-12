"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Token, fetchContractorDashboard, ContractorDashboardData } from "@/lib/api/api";
import { Construction, AlertTriangle, RefreshCcw } from 'lucide-react';
import Sidebar from "@/app/components/Sidebar";
import { useSidebar } from "@/app/contexts/SidebarContext";

export default function ContractorAvailablePage() {
    const router = useRouter();
    const { collapsed } = useSidebar();
    const [data, setData] = useState<ContractorDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openComplaints, setOpenComplaints] = useState<any[]>([]);
    const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
    const [filterSeverity, setFilterSeverity] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<'severity' | 'recent'>('recent');

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [fetchedData, openData] = await Promise.all([
                fetchContractorDashboard(),
                import('@/lib/api/api').then(mod => mod.fetchOpenComplaints())
            ]);
            setData(fetchedData);
            setOpenComplaints(openData);
        } catch (err: any) {
            console.error(err);
            setError(err?.message || "Error loading dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!Token.get()) {
            router.push("/login");
            return;
        }
        loadData();
    }, [router]);

    const filteredComplaints = useMemo(() => {
        let filtered = [...openComplaints];
        if (filterSeverity) {
            filtered = filtered.filter(c => c.severity >= filterSeverity);
        }
        if (sortBy === 'severity') {
            filtered.sort((a, b) => b.severity - a.severity);
        } else {
            filtered.sort((a, b) => b.id - a.id);
        }
        return filtered;
    }, [openComplaints, filterSeverity, sortBy]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium">Loading available works...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button onClick={loadData} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen relative bg-slate-50 overflow-hidden">
            <div className={`${collapsed ? 'w-16' : 'w-64'} flex-shrink-0 hidden lg:block transition-all duration-300`}></div>
            
            <Sidebar />

            <main className="flex-1 px-6 pb-12 pt-24 lg:px-10 lg:pb-16 lg:pt-28 relative z-10 overflow-y-auto w-full transition-all duration-300">
                {/* Available Works Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Construction className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Available Works</h1>
                                <p className="text-slate-600">Browse and bid on open municipal projects</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-3 flex-wrap">
                            <select 
                                value={filterSeverity || ''} 
                                onChange={(e) => setFilterSeverity(e.target.value ? Number(e.target.value) : null)}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Severity</option>
                                <option value="4">High (4-5)</option>
                                <option value="3">Medium (3+)</option>
                                <option value="1">Low (1+)</option>
                            </select>
                            
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value as 'severity' | 'recent')}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="recent">Most Recent</option>
                                <option value="severity">Highest Severity</option>
                            </select>

                            <button onClick={loadData} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition">
                                <RefreshCcw size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                            {filteredComplaints.length} Available
                        </span>
                    </div>
                </div>

                {/* Available Works Grid */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Open Opportunities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredComplaints.length > 0 ? (
                            filteredComplaints.map(c => (
                                <div key={c.id} className="p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-lg transition flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded uppercase">Pending</span>
                                        <span className="text-xs text-slate-500 font-mono">#{c.id}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-1">{c.title}</h3>
                                    <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-1">{c.description}</p>

                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                                        <AlertTriangle size={14} className={c.severity >= 4 ? "text-red-500" : "text-yellow-500"} />
                                        <span>Severity: {c.severity}/5</span>
                                    </div>

                                    <button
                                        onClick={() => setSelectedComplaint(c)}
                                        className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
                                    >
                                        Submit Tender
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                <Construction className="mx-auto mb-4 opacity-50 text-blue-400" size={48} />
                                <p className="text-lg font-medium">No open complaints available</p>
                                <p className="text-sm mt-1">Check back later for new opportunities</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}