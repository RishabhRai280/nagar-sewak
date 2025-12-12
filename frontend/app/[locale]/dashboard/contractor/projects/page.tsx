"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Token, fetchContractorDashboard, ContractorDashboardData } from "@/lib/api/api";
import { Construction, CheckCircle, DollarSign, TrendingUp, RefreshCcw } from 'lucide-react';
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
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium">Loading projects...</p>
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
                {/* Projects Header */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Construction className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
                                <p className="text-slate-600">Manage your assigned construction projects</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold">
                                {assignedProjects.length} Active
                            </span>
                            <button onClick={loadData} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition">
                                <RefreshCcw size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Project Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Construction className="text-blue-600" size={16} />
                            </div>
                            <h3 className="font-bold text-slate-900">Active</h3>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-2">
                            {assignedProjects.filter(p => p.status?.toLowerCase() === 'in progress').length}
                        </div>
                        <p className="text-sm text-slate-600">Currently working</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="text-emerald-600" size={16} />
                            </div>
                            <h3 className="font-bold text-slate-900">Completed</h3>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-2">
                            {assignedProjects.filter(p => p.status?.toLowerCase() === 'completed').length}
                        </div>
                        <p className="text-sm text-slate-600">Successfully finished</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="text-purple-600" size={16} />
                            </div>
                            <h3 className="font-bold text-slate-900">Total Value</h3>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-2">
                            ₹{assignedProjects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()}
                        </div>
                        <p className="text-sm text-slate-600">Project portfolio</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="text-orange-600" size={16} />
                            </div>
                            <h3 className="font-bold text-slate-900">Avg Progress</h3>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-2">
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
                        <p className="text-sm text-slate-600">Overall completion</p>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Project Details</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {assignedProjects.length > 0 ? (
                            assignedProjects.map(p => {
                                const progress = p.progressPercentage !== undefined && p.progressPercentage !== null 
                                    ? p.progressPercentage 
                                    : (p.status?.toLowerCase() === 'completed' ? 100 : 
                                       p.status?.toLowerCase() === 'in progress' ? 50 : 0);
                                return (
                                    <div key={p.id} className="p-6 border border-slate-200 rounded-2xl hover:shadow-lg transition group">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full ${
                                                p.status?.toLowerCase() === 'completed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                                                p.status?.toLowerCase() === 'in progress' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                'bg-orange-100 text-orange-700 border border-orange-200'
                                            }`}>
                                                {p.status}
                                            </span>
                                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                                #{p.id}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-lg mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">{p.title}</h3>
                                        
                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-600">Budget:</span>
                                                <span className="font-semibold text-slate-900">₹{p.budget?.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-600">Last Updated:</span>
                                                <span className="font-semibold text-slate-900">
                                                    {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'No date'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-slate-700 font-semibold">Progress</span>
                                                <span className="text-blue-600 font-bold">{progress}%</span>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Link href={`/projects/${p.id}`} className="flex-1 text-center py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition">
                                                View Details
                                            </Link>
                                            <button 
                                                onClick={() => {
                                                    setSelectedProject(p);
                                                    setShowProgressModal(true);
                                                }}
                                                className="px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-16 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                <Construction className="mx-auto mb-4 opacity-50 text-blue-400" size={48} />
                                <p className="text-lg font-medium">No active projects assigned</p>
                                <p className="text-sm mt-1">Check back later for new project assignments</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}