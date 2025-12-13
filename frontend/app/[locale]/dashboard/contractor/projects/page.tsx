"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Token, fetchContractorDashboard, ContractorDashboardData } from "@/lib/api/api";
import { Construction, CheckCircle, DollarSign, TrendingUp, RefreshCcw, ArrowRight } from 'lucide-react';
import Sidebar from "@/app/components/Sidebar";
import { useSidebar } from "@/app/contexts/SidebarContext";

export default function ContractorProjectsPage() {
    const router = useRouter();
    const { collapsed } = useSidebar();
    const [data, setData] = useState<ContractorDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProject, setSelectedProject] = useState<any | null>(null);
    const [showProgressModal, setShowProgressModal] = useState(false);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedData = await fetchContractorDashboard();
            setData(fetchedData);
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

    const assignedProjects = data?.assignedProjects ?? [];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-[#1e3a8a] rounded-full animate-spin" />
                    <p className="text-[#1e3a8a] font-bold text-lg tracking-wide uppercase">Loading Workspace...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-md border border-slate-200">
                    <p className="text-red-600 mb-4 font-bold">{error}</p>
                    <button onClick={loadData} className="px-6 py-2 bg-[#1e3a8a] text-white rounded-lg font-bold hover:bg-blue-900 transition">
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

            <main className="flex-1 px-4 sm:px-6 lg:px-10 pb-12 pt-32 lg:pt-36 relative z-10 overflow-y-auto w-full transition-all duration-300">

                {/* Consistent Header Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e3a8a] to-[#f97316]"></div>
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-[#1e3a8a] rounded-xl flex items-center justify-center shadow-md">
                                <Construction className="text-white" size={28} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tight">Active Projects</h1>
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Manage Construction Work</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <span className="px-4 py-2 bg-blue-50 text-[#1e3a8a] rounded-lg font-bold border border-blue-100 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#1e3a8a]"></span>
                                {assignedProjects.length} Active
                            </span>
                            <button onClick={loadData} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg font-bold hover:bg-slate-50 hover:border-[#1e3a8a] transition shadow-sm">
                                <RefreshCcw size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Project Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-blue-50 text-[#1e3a8a] rounded-lg flex items-center justify-center border border-blue-100">
                                <Construction size={16} />
                            </div>
                            <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">Active</h3>
                        </div>
                        <div className="text-3xl font-black text-[#111827] mb-1">
                            {assignedProjects.filter(p => p.status?.toLowerCase() === 'in progress').length}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">Currently working</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center border border-emerald-100">
                                <CheckCircle size={16} />
                            </div>
                            <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">Completed</h3>
                        </div>
                        <div className="text-3xl font-black text-[#111827] mb-1">
                            {assignedProjects.filter(p => p.status?.toLowerCase() === 'completed').length}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">Successfully finished</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center border border-purple-100">
                                <DollarSign size={16} />
                            </div>
                            <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">Total Value</h3>
                        </div>
                        <div className="text-3xl font-black text-[#111827] mb-1">
                            ₹{assignedProjects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">Project portfolio</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center border border-orange-100">
                                <TrendingUp size={16} />
                            </div>
                            <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">Avg Progress</h3>
                        </div>
                        <div className="text-3xl font-black text-[#111827] mb-1">
                            {assignedProjects.length > 0
                                ? Math.round(assignedProjects.reduce((sum, p) => {
                                    const progress = p.progressPercentage !== undefined && p.progressPercentage !== null
                                        ? p.progressPercentage
                                        : (p.status?.toLowerCase() === 'completed' ? 100 :
                                            p.status?.toLowerCase() === 'in progress' ? 50 : 0);
                                    return sum + progress;
                                }, 0) / assignedProjects.length)
                                : 0
                            }%
                        </div>
                        <p className="text-xs text-slate-500 font-medium">Overall completion</p>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8">
                    <h2 className="text-xl font-black text-[#111827] mb-6 uppercase tracking-tight flex items-center gap-2">
                        <Construction className="text-[#1e3a8a]" size={24} />
                        Project Details
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {assignedProjects.length > 0 ? (
                            assignedProjects.map(p => {
                                const progress = p.progressPercentage !== undefined && p.progressPercentage !== null
                                    ? p.progressPercentage
                                    : (p.status?.toLowerCase() === 'completed' ? 100 :
                                        p.status?.toLowerCase() === 'in progress' ? 50 : 0);
                                return (
                                    <div key={p.id} className="p-6 border border-slate-200 rounded-xl hover:shadow-lg hover:border-[#1e3a8a] transition group bg-white">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full ${p.status?.toLowerCase() === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                                    p.status?.toLowerCase() === 'in progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                        'bg-orange-50 text-orange-700 border border-orange-200'
                                                }`}>
                                                {p.status}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                                #{p.id}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-[#111827] text-lg mb-3 group-hover:text-[#1e3a8a] transition-colors line-clamp-2">{p.title}</h3>

                                        <div className="space-y-3 mb-4 text-sm">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500 font-medium">Budget</span>
                                                <span className="font-bold text-slate-900">₹{p.budget?.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-500 font-medium">Updated</span>
                                                <span className="font-bold text-slate-900">
                                                    {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'No date'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <div className="flex justify-between text-xs font-bold mb-2">
                                                <span className="text-slate-500 uppercase">Progress</span>
                                                <span className="text-[#1e3a8a]">{progress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-full bg-[#1e3a8a] rounded-full transition-all duration-500"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Link href={`/projects/${p.id}`} className="flex-1 text-center py-2.5 bg-[#1e3a8a] text-white text-xs font-bold uppercase rounded-lg hover:bg-blue-900 transition shadow-sm">
                                                Details
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setSelectedProject(p);
                                                    setShowProgressModal(true);
                                                }}
                                                className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold uppercase rounded-lg hover:bg-slate-50 hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-16 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                <Construction className="mx-auto mb-4 opacity-50 text-blue-400" size={48} />
                                <p className="text-lg font-bold">No projects assigned</p>
                                <p className="text-sm mt-1 max-w-sm mx-auto">Projects assigned to you by administrators will appear here automatically.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}