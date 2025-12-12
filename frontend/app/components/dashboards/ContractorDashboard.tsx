"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Token, fetchContractorDashboard, ContractorDashboardData, UserStore } from "@/lib/api/api";
import { Construction, AlertTriangle, CheckCircle, Star, Eye, RefreshCcw, LogOut, DollarSign, Clock, Award, FileText, TrendingUp, Calendar, MapPin, Plus, Filter, Search } from 'lucide-react';
import Link from "next/link";
import Sidebar from "../Sidebar";
import { useSidebar } from "@/app/contexts/SidebarContext";

export default function ContractorDashboardComponent() {
    const router = useRouter();
    const { collapsed } = useSidebar();
    const [data, setData] = useState<ContractorDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openComplaints, setOpenComplaints] = useState<any[]>([]);
    const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
    const [myTenders, setMyTenders] = useState<any[]>([]);
    const [filterSeverity, setFilterSeverity] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<'severity' | 'recent'>('recent');
    const [selectedProject, setSelectedProject] = useState<any | null>(null);
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [activeSection, setActiveSection] = useState<'overview' | 'projects' | 'complaints' | 'available' | 'tenders'>('overview');

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [fetchedData, openData, tendersData] = await Promise.all([
                fetchContractorDashboard(),
                import('@/lib/api/api').then(mod => mod.fetchOpenComplaints()),
                import('@/lib/api/api').then(mod => mod.fetchMyTenders()).catch(() => [])
            ]);
            setData(fetchedData);
            setOpenComplaints(openData);
            setMyTenders(tendersData);
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

    // Keep dashboard section in sync with sidebar hash
    useEffect(() => {
        const updateSection = () => {
            const hash = (window.location.hash || "#overview").replace("#", "");
            const allowed = ["overview", "projects", "complaints", "available", "tenders"];
            const newSection = allowed.includes(hash) ? (hash as any) : "overview";
            setActiveSection(newSection);
        };
        updateSection();
        window.addEventListener("hashchange", updateSection);
        return () => window.removeEventListener("hashchange", updateSection);
    }, []);

    const handleLogout = () => {
        Token.remove();
        UserStore.remove();
        router.push("/login");
    };

    const navigateToSection = (section: string) => {
        setActiveSection(section as any);
        window.location.hash = section;
    };

    const kpis = useMemo(() => data ? {
        active: data.metrics?.activeProjects ?? 0,
        completed: data.metrics?.completedProjects ?? 0,
        complaints: data.metrics?.pendingComplaints ?? 0,
        rating: data.profile?.avgRating ?? 0,
        totalEarnings: data.metrics?.totalBudget ?? 0,
        pendingPayments: data.metrics?.totalBudget ? (data.metrics.totalBudget * 0.3) : 0 // Mock calculation
    } : null, [data]);

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
                    <p className="text-slate-500 font-medium">Loading Workspace...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
                <AlertTriangle className="text-red-500 mb-4" size={48} />
                <h3 className="text-xl font-bold text-slate-800 mb-2">Unable to load dashboard</h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">{error}</p>
                <div className="flex gap-4">
                    <button
                        onClick={loadData}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                    >
                        <RefreshCcw size={18} /> Retry
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition"
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </div>
        )
    }

    const assignedProjects = data?.assignedProjects ?? [];
    const linkedComplaints = data?.linkedComplaints ?? [];

    const sectionVisible = (key: 'overview' | 'projects' | 'complaints' | 'available' | 'tenders') =>
        activeSection === key;

    return (
        <div className="flex min-h-screen relative bg-slate-50 overflow-hidden">
            <div className={`${collapsed ? 'w-16' : 'w-64'} flex-shrink-0 hidden lg:block transition-all duration-300`}></div>
            {/* Background */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <motion.div animate={{ x: [0, 30, 0], y: [0, 40, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full blur-[100px] opacity-50" />
                <motion.div animate={{ x: [0, -30, 0], y: [0, -20, 0] }} transition={{ duration: 15, repeat: Infinity }} className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-indigo-200 rounded-full blur-[100px] opacity-40" />
            </div>

            <Sidebar />

            <main
                className="relative z-10 flex-1 px-6 pb-12 pt-32 lg:px-12 lg:pb-16 lg:pt-36 space-y-12 overflow-y-auto transition-all duration-300"
                data-dashboard-scroll
            >
                {/* Overview Section - Full Dashboard */}
                <section id="overview" className={`space-y-8 ${sectionVisible('overview') ? '' : 'hidden'}`}>
                    {/* Header Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <Construction className="text-blue-600" size={24} />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Contractor Dashboard</h1>
                                        <p className="text-slate-600">Welcome back, {data?.profile?.companyName || "Contractor"}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-500">Manage your projects, tenders, and business operations</p>
                            </div>
                            <div className="flex flex-wrap gap-3 justify-end">
                                <button
                                    onClick={loadData}
                                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition"
                                    title="Refresh Data"
                                >
                                    <div className="flex items-center gap-2"><RefreshCcw size={18} /> Refresh</div>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-semibold border border-slate-200 hover:border-red-200 transition"
                                >
                                    <div className="flex items-center gap-2"><LogOut size={16} /> Sign Out</div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard label="Active Projects" value={kpis?.active} icon={Construction} color="blue" />
                        <StatCard label="Available Works" value={openComplaints.length} icon={AlertTriangle} color="orange" />
                        <StatCard label="Completed Projects" value={kpis?.completed} icon={CheckCircle} color="emerald" />
                        <StatCard label="Company Rating" value={kpis?.rating?.toFixed(1)} icon={Star} color="yellow" suffix="★" />
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <button 
                                onClick={() => navigateToSection('available')}
                                className="w-full p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                                        <Search className="text-white" size={20} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-slate-900">Find Work</h3>
                                        <p className="text-xs text-slate-600">Browse available projects</p>
                                    </div>
                                </div>
                            </button>
                            
                            <button 
                                onClick={() => navigateToSection('tenders')}
                                className="w-full p-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                                        <FileText className="text-white" size={20} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-slate-900">My Tenders</h3>
                                        <p className="text-xs text-slate-600">Track submissions</p>
                                    </div>
                                </div>
                            </button>
                            
                            <button 
                                onClick={() => navigateToSection('projects')}
                                className="w-full p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                                        <Construction className="text-white" size={20} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-slate-900">Projects</h3>
                                        <p className="text-xs text-slate-600">Manage active work</p>
                                    </div>
                                </div>
                            </button>
                            
                            <Link href="/map">
                                <button className="w-full p-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl transition group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                                            <MapPin className="text-white" size={20} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-semibold text-slate-900">Live Map</h3>
                                            <p className="text-xs text-slate-600">View locations</p>
                                        </div>
                                    </div>
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Activity Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Projects */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                    <Construction className="text-blue-600" size={20} />
                                    Recent Projects
                                </h2>
                                <button 
                                    onClick={() => navigateToSection('projects')}
                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                >
                                    View All
                                </button>
                            </div>
                            <div className="space-y-4">
                                {assignedProjects.slice(0, 3).map(p => {
                                    const progress = p.progressPercentage !== undefined && p.progressPercentage !== null 
                                        ? p.progressPercentage 
                                        : (p.status?.toLowerCase() === 'completed' ? 100 : 
                                           p.status?.toLowerCase() === 'in progress' ? 50 : 0);
                                    return (
                                        <div key={p.id} className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-slate-900 line-clamp-1">{p.title}</h3>
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                    p.status?.toLowerCase() === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {p.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm text-slate-600 mb-2">
                                                <span>₹{p.budget?.toLocaleString()}</span>
                                                <span>{progress}% Complete</span>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-2">
                                                <div 
                                                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                                {assignedProjects.length === 0 && (
                                    <div className="text-center py-8 text-slate-500">
                                        <Construction className="mx-auto mb-2 opacity-50" size={32} />
                                        <p>No active projects</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Available Opportunities */}
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                    <AlertTriangle className="text-orange-600" size={20} />
                                    New Opportunities
                                </h2>
                                <button 
                                    onClick={() => navigateToSection('available')}
                                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                >
                                    View All
                                </button>
                            </div>
                            <div className="space-y-4">
                                {openComplaints.slice(0, 3).map(c => (
                                    <div key={c.id} className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-slate-900 line-clamp-1">{c.title}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                                c.severity >= 4 ? 'bg-red-100 text-red-700' : 
                                                c.severity >= 3 ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                Severity {c.severity}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 line-clamp-2 mb-2">{c.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-500">#{c.id}</span>
                                            <button
                                                onClick={() => setSelectedComplaint(c)}
                                                className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                                            >
                                                Submit Tender
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {openComplaints.length === 0 && (
                                    <div className="text-center py-8 text-slate-500">
                                        <AlertTriangle className="mx-auto mb-2 opacity-50" size={32} />
                                        <p>No opportunities available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Projects Section - Full Page */}
                <section id="projects" className={`space-y-8 ${sectionVisible('projects') ? '' : 'hidden'}`}>
                    {/* Projects Header */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                </section>

                {/* Complaints Section - Full Page */}
                <section id="complaints" className={`space-y-8 ${sectionVisible('complaints') ? '' : 'hidden'}`}>
                    {/* Complaints Header */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <AlertTriangle className="text-orange-600" size={24} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">Project Complaints</h1>
                                    <p className="text-slate-600">Complaints related to your ongoing projects</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-semibold">
                                    {linkedComplaints.length} Linked
                                </span>
                                <button onClick={loadData} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition">
                                    <RefreshCcw size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Complaints Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <AlertTriangle className="text-orange-600" size={16} />
                                </div>
                                <h3 className="font-bold text-slate-900">Total</h3>
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">{linkedComplaints.length}</div>
                            <p className="text-sm text-slate-600">Linked complaints</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                    <AlertTriangle className="text-red-600" size={16} />
                                </div>
                                <h3 className="font-bold text-slate-900">High Priority</h3>
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">
                                {linkedComplaints.filter(c => c.severity >= 4).length}
                            </div>
                            <p className="text-sm text-slate-600">Urgent attention</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Clock className="text-blue-600" size={16} />
                                </div>
                                <h3 className="font-bold text-slate-900">In Progress</h3>
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">
                                {linkedComplaints.filter(c => c.status?.toLowerCase() === 'in progress').length}
                            </div>
                            <p className="text-sm text-slate-600">Being resolved</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="text-emerald-600" size={16} />
                                </div>
                                <h3 className="font-bold text-slate-900">Resolved</h3>
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">
                                {linkedComplaints.filter(c => c.status?.toLowerCase() === 'resolved').length}
                            </div>
                            <p className="text-sm text-slate-600">Successfully closed</p>
                        </div>
                    </div>

                    {/* Complaints List */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Complaint Details</h2>
                        <div className="space-y-4">
                            {linkedComplaints.length > 0 ? (
                                linkedComplaints.map(c => (
                                    <div key={c.id} className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="font-bold text-slate-900 text-lg">{c.title}</h4>
                                                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                                                        c.status?.toLowerCase() === 'resolved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                                                        c.status?.toLowerCase() === 'in progress' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                        'bg-orange-100 text-orange-700 border border-orange-200'
                                                    }`}>
                                                        {c.status}
                                                    </span>
                                                </div>
                                                <p className="text-slate-600 text-sm mb-3 line-clamp-2">{c.description}</p>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span className={`flex items-center gap-1 font-semibold ${
                                                        c.severity >= 4 ? 'text-red-600' : 
                                                        c.severity >= 3 ? 'text-orange-600' : 'text-yellow-600'
                                                    }`}>
                                                        <AlertTriangle size={14} />
                                                        Severity: {c.severity}/5
                                                    </span>
                                                    <span className="text-slate-500">ID: #{c.id}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 pt-3 border-t border-slate-100">
                                            <Link href={`/complaints/${c.id}`}>
                                                <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition">
                                                    View Details
                                                </button>
                                            </Link>
                                            <Link href={`/map?complaintId=${c.id}`}>
                                                <button className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium rounded-lg transition">
                                                    View on Map
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-16 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                    <CheckCircle className="mx-auto mb-4 opacity-50 text-emerald-500" size={48} />
                                    <p className="text-lg font-medium">No complaints linked to your projects</p>
                                    <p className="text-sm mt-1">Great job maintaining quality work!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section id="available" className={`bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 ${sectionVisible('available') ? '' : 'hidden'}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Construction className="text-blue-600" /> Available Works
                            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{filteredComplaints.length}</span>
                        </h2>
                        
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
                        </div>
                    </div>

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
                            <div className="col-span-full text-center py-12 text-slate-500">
                                <p>No open complaints available for tender at the moment.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Tenders Section - Full Page */}
                <section id="tenders" className={`space-y-8 ${sectionVisible('tenders') ? '' : 'hidden'}`}>
                    {/* Tenders Header */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <FileText className="text-purple-600" size={24} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900">My Tender Submissions</h1>
                                    <p className="text-slate-600">Track your submitted tenders and their status</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold">
                                    {myTenders.length} Submitted
                                </span>
                                <button onClick={loadData} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition">
                                    <RefreshCcw size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tender Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FileText className="text-blue-600" size={16} />
                                </div>
                                <h3 className="font-bold text-slate-900">Total Submitted</h3>
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">{myTenders.length}</div>
                            <p className="text-sm text-slate-600">All time submissions</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="text-emerald-600" size={16} />
                                </div>
                                <h3 className="font-bold text-slate-900">Accepted</h3>
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">
                                {myTenders.filter(t => t.status === 'ACCEPTED').length}
                            </div>
                            <p className="text-sm text-slate-600">Successful bids</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <Clock className="text-orange-600" size={16} />
                                </div>
                                <h3 className="font-bold text-slate-900">Pending</h3>
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">
                                {myTenders.filter(t => t.status === 'PENDING').length}
                            </div>
                            <p className="text-sm text-slate-600">Under review</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                    <AlertTriangle className="text-red-600" size={16} />
                                </div>
                                <h3 className="font-bold text-slate-900">Rejected</h3>
                            </div>
                            <div className="text-3xl font-bold text-slate-900 mb-2">
                                {myTenders.filter(t => t.status === 'REJECTED').length}
                            </div>
                            <p className="text-sm text-slate-600">Not selected</p>
                        </div>
                    </div>

                    {/* Tenders List */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Tender History</h2>
                        <div className="space-y-4">
                            {myTenders.length > 0 ? (
                                myTenders.map((tender, i) => {
                                    // Find the complaint title from openComplaints
                                    const complaint = openComplaints.find(c => c.id === tender.complaintId);
                                    const complaintTitle = complaint?.title || `Complaint #${tender.complaintId}`;
                                    
                                    return (
                                        <motion.div
                                            key={tender.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="p-6 border border-slate-200 rounded-xl hover:shadow-lg transition"
                                        >
                                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                            tender.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                                            tender.status === 'REJECTED' ? 'bg-red-100 text-red-700 border border-red-200' :
                                                            'bg-orange-100 text-orange-700 border border-orange-200'
                                                        }`}>
                                                            {tender.status}
                                                        </span>
                                                        <span className="text-xs text-slate-500">
                                                            Submitted: {new Date(tender.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-slate-900 text-lg mb-2">
                                                        {complaintTitle}
                                                    </h3>
                                                    <p className="text-sm text-slate-600 line-clamp-2 mb-4">{tender.description}</p>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <DollarSign size={16} className="text-blue-600" />
                                                            <span className="font-semibold text-slate-900">
                                                                ₹{tender.quoteAmount.toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar size={16} className="text-emerald-600" />
                                                            <span className="font-semibold text-slate-900">
                                                                {tender.estimatedDays} days
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <FileText size={16} className="text-purple-600" />
                                                            <span className="font-semibold text-slate-900">
                                                                ID: #{tender.id}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    <Link href={`/tenders/${tender.id}`}>
                                                        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition">
                                                            View Details
                                                        </button>
                                                    </Link>
                                                    {complaint && (
                                                        <Link href={`/map?complaintId=${complaint.id}`}>
                                                            <button className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-200 transition">
                                                                View Location
                                                            </button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-16 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                    <FileText className="mx-auto mb-4 opacity-50 text-purple-400" size={48} />
                                    <p className="text-lg font-medium">No tenders submitted yet</p>
                                    <p className="text-sm mt-1">Browse available works to submit your first tender</p>
                                    <button 
                                        onClick={() => navigateToSection('available')}
                                        className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
                                    >
                                        Find Opportunities
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Tender Modal */}
                {selectedComplaint && (
                    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
                        <TenderModalWrapper
                            complaintId={selectedComplaint.id}
                            complaintTitle={selectedComplaint.title}
                            onClose={() => setSelectedComplaint(null)}
                            onSuccess={() => {
                                loadData();
                                alert("Tender submitted successfully!");
                            }}
                        />
                    </div>
                )}

                {/* Progress Update Modal */}
                {showProgressModal && selectedProject && (
                    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
                        <ProgressUpdateModal
                            project={selectedProject}
                            onClose={() => {
                                setShowProgressModal(false);
                                setSelectedProject(null);
                            }}
                            onSuccess={() => {
                                loadData();
                                setShowProgressModal(false);
                                setSelectedProject(null);
                            }}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}

// Helper wrapper to lazy load the modal
import dynamic from 'next/dynamic';

const TenderModalWrapper = dynamic(() => import('../tenders/TenderModal'), {
    loading: () => <div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
});

const ProgressUpdateModal = ({ project, onClose, onSuccess }: any) => {
    const [progress, setProgress] = useState(project.progressPercentage || 0);
    const [status, setStatus] = useState(project.status || 'Pending');
    const [notes, setNotes] = useState('');
    const [photos, setPhotos] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (photos.length + files.length <= 5) {
            setPhotos(prev => [...prev, ...files]);
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            // Mock API call - replace with actual implementation
            await new Promise(resolve => setTimeout(resolve, 1000));
            onSuccess();
        } catch (error) {
            console.error('Failed to update progress:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">Update Project Progress</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition"
                        >
                            ✕
                        </button>
                    </div>
                    <p className="text-slate-600 mt-1">{project.title}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Progress Slider */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Progress: {progress}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={(e) => setProgress(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                        </div>
                    </div>

                    {/* Status Dropdown */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Project Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                        >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Progress Notes
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Describe the work completed, materials used, any issues encountered..."
                            rows={4}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-900"
                        />
                    </div>

                    {/* Photo Upload */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Progress Photos (Max 5)
                        </label>
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 transition">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handlePhotoChange}
                                className="hidden"
                                id="photo-upload"
                                disabled={photos.length >= 5}
                            />
                            <label
                                htmlFor="photo-upload"
                                className={`cursor-pointer ${photos.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className="text-4xl mb-2">📸</div>
                                <p className="text-sm font-bold text-slate-700">
                                    {photos.length >= 5 ? 'Maximum photos reached' : 'Click to upload photos'}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    JPG, PNG up to 10MB each
                                </p>
                            </label>
                        </div>

                        {/* Photo Preview */}
                        {photos.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mt-4">
                                {photos.map((photo, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(photo)}
                                            alt={`Progress ${index + 1}`}
                                            className="w-full h-20 object-cover rounded-lg border border-slate-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(index)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Updating...' : 'Update Progress'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

function StatCard({ label, value, icon: Icon, color, suffix = "" }: any) {
    const colorMap = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100", 
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
    };
    const colorStyles = colorMap[color as keyof typeof colorMap] || "bg-slate-50 text-slate-600 border-slate-100";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wide">{label}</h3>
                <div className={`p-2.5 rounded-xl border ${colorStyles}`}>
                    <Icon size={20} />
                </div>
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{value}{suffix}</p>
        </motion.div>
    );
}