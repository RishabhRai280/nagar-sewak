"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Token, fetchContractorDashboard, ContractorDashboardData, UserStore } from "@/lib/api/api";
import { Construction, AlertTriangle, CheckCircle, Star, RefreshCcw, LogOut, DollarSign, Clock, FileText, TrendingUp, MapPin, Search, ChevronRight } from 'lucide-react';
import Link from "next/link";
import Sidebar from "../Sidebar";
import { useSidebar } from "@/app/contexts/SidebarContext";
import NotificationWrapper from "../notifications/NotificationWrapper";

export default function ContractorDashboardComponent() {
    const t = useTranslations('dashboard.contractor');
    const router = useRouter();
    const { collapsed } = useSidebar();
    const [data, setData] = useState<ContractorDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openComplaints, setOpenComplaints] = useState<any[]>([]);
    const [myTenders, setMyTenders] = useState<any[]>([]);
    const [filterSeverity, setFilterSeverity] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<'severity' | 'recent'>('recent');
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
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-[#1e3a8a] rounded-full animate-spin" />
                    <p className="text-[#1e3a8a] font-bold text-lg tracking-wide uppercase">{t('loading')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
                <AlertTriangle className="text-red-600 mb-4" size={48} />
                <h3 className="text-xl font-black text-slate-900 mb-2 uppercase">{t('error')}</h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">{error}</p>
                <div className="flex gap-4">
                    <button onClick={loadData} className="flex items-center gap-2 px-6 py-3 bg-[#1e3a8a] text-white rounded-xl font-bold hover:bg-blue-900 transition shadow-lg">
                        <RefreshCcw size={18} /> {t('retry')}
                    </button>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-300 rounded-xl font-bold hover:bg-slate-50 transition">
                        <LogOut size={18} /> {t('signOut')}
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

            <Sidebar />

            {/* Notification UI */}
            <div className="fixed top-4 right-4 z-50">
                <NotificationWrapper />
            </div>

            <main
                className="relative z-10 flex-1 px-6 pb-12 pt-32 lg:px-12 lg:pb-16 lg:pt-36 space-y-12 overflow-y-auto transition-all duration-300"
                data-dashboard-scroll
            >
                {/* Overview Section */}
                <section id="overview" className={`space-y-8 ${sectionVisible('overview') ? '' : 'hidden'}`}>
                    {/* Header Card */}
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e3a8a] to-[#f97316]"></div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div className="space-y-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-[#1e3a8a] rounded-xl flex items-center justify-center shadow-md">
                                        <Construction className="text-white" size={28} />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-black text-[#111827] tracking-tight uppercase">{t('subtitle')}</h1>
                                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">
                                            {data?.profile?.companyName || t('authorized')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3 justify-end items-center">
                                <button onClick={loadData} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg font-bold hover:bg-slate-50 hover:border-[#1e3a8a] transition shadow-sm" title={t('refresh')}>
                                    <RefreshCcw size={18} />
                                </button>
                                <div className="h-8 w-px bg-slate-200 mx-1"></div>
                                <button onClick={handleLogout} className="px-4 py-2 bg-slate-100 text-slate-700 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg font-bold transition flex items-center gap-2">
                                    <LogOut size={18} /> <span className="hidden sm:inline">{t('signOut')}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard label={t('activeProjects')} value={kpis?.active} icon={Construction} color="blue" />
                        <StatCard label={t('availableWorks')} value={openComplaints.length} icon={AlertTriangle} color="orange" />
                        <StatCard label={t('completedProjects')} value={kpis?.completed} icon={CheckCircle} color="emerald" />
                        <StatCard label={t('companyRating')} value={kpis?.rating?.toFixed(1)} icon={Star} color="yellow" suffix="★" />
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8">
                        <h2 className="text-lg font-extrabold text-[#111827] uppercase tracking-wider mb-6 border-b border-slate-100 pb-2">{t('operationalActions')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <button onClick={() => navigateToSection('available')} className="group flex items-center gap-4 p-4 bg-white border border-slate-200 hover:border-[#1e3a8a] rounded-xl hover:shadow-lg transition-all duration-300">
                                <div className="w-12 h-12 bg-blue-50 text-[#1e3a8a] rounded-lg flex items-center justify-center group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors">
                                    <Search size={24} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-[#111827] text-sm uppercase tracking-wide group-hover:text-[#1e3a8a]">{t('findWork')}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{t('browseOpp')}</p>
                                </div>
                            </button>

                            <button onClick={() => navigateToSection('tenders')} className="group flex items-center gap-4 p-4 bg-white border border-slate-200 hover:border-emerald-600 rounded-xl hover:shadow-lg transition-all duration-300">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <FileText size={24} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-[#111827] text-sm uppercase tracking-wide group-hover:text-emerald-600">{t('myTenders')}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{t('trackSub')}</p>
                                </div>
                            </button>

                            <button onClick={() => navigateToSection('projects')} className="group flex items-center gap-4 p-4 bg-white border border-slate-200 hover:border-purple-600 rounded-xl hover:shadow-lg transition-all duration-300">
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <Construction size={24} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-[#111827] text-sm uppercase tracking-wide group-hover:text-purple-600">{t('activeProjects')}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{t('manageOngoing')}</p>
                                </div>
                            </button>

                            <Link href="/map" className="group flex items-center gap-4 p-4 bg-white border border-slate-200 hover:border-orange-600 rounded-xl hover:shadow-lg transition-all duration-300">
                                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                    <MapPin size={24} />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-bold text-[#111827] text-sm uppercase tracking-wide group-hover:text-orange-600">{t('liveMap')}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{t('geoView')}</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Activity Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Projects */}
                        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                                <h2 className="text-xl font-black text-[#111827] flex items-center gap-3 uppercase tracking-tight">
                                    <Construction className="text-[#1e3a8a]" size={20} />
                                    {t('recentProjects')}
                                </h2>
                                <button onClick={() => navigateToSection('projects')} className="text-[#1e3a8a] text-xs font-bold uppercase tracking-wider hover:underline">{t('viewAll')}</button>
                            </div>
                            <div className="space-y-4 flex-1">
                                {assignedProjects.slice(0, 3).map(p => {
                                    const progress = p.progressPercentage ?? (p.status?.toLowerCase() === 'completed' ? 100 : 50);
                                    return (
                                        <div key={p.id} className="p-4 border border-slate-200 rounded-xl hover:border-[#1e3a8a] transition group bg-slate-50/50">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-[#111827] text-sm">{p.title}</h3>
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${p.status?.toLowerCase() === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                                                    }`}>{p.status}</span>
                                            </div>
                                            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3">
                                                <div className="bg-[#1e3a8a] h-1.5 rounded-full" style={{ width: `${progress}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                                {assignedProjects.length === 0 && (
                                    <div className="text-center py-12 text-slate-400">
                                        <p className="font-bold text-sm">{t('noActiveProjects')}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Available Opportunities */}
                        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                                <h2 className="text-xl font-black text-[#111827] flex items-center gap-3 uppercase tracking-tight">
                                    <AlertTriangle className="text-orange-600" size={20} />
                                    {t('newTenders')}
                                </h2>
                                <button onClick={() => navigateToSection('available')} className="text-[#1e3a8a] text-xs font-bold uppercase tracking-wider hover:underline">{t('viewAll')}</button>
                            </div>
                            <div className="space-y-4 flex-1">
                                {openComplaints.slice(0, 3).map(c => (
                                    <div key={c.id} className="p-4 border border-slate-200 rounded-xl hover:border-orange-400 transition bg-orange-50/30">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-[#111827] text-sm line-clamp-1">{c.title}</h3>
                                            <span className="text-[10px] font-mono text-slate-500">#{c.id}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${c.severity >= 4 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                                                }`}>{t('severity')} {c.severity}</span>

                                            {myTenders.some(t => t.complaintId === c.id) ? (
                                                <button disabled className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded uppercase tracking-wide cursor-not-allowed border border-slate-200">
                                                    Applied
                                                </button>
                                            ) : (
                                                <Link href={`/tenders/create?complaintId=${c.id}`} className="text-[10px] font-bold text-white bg-[#1e3a8a] px-3 py-1 rounded uppercase tracking-wide hover:bg-blue-900 transition">
                                                    {t('bidNow')}
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {openComplaints.length === 0 && (
                                    <div className="text-center py-12 text-slate-400">
                                        <p className="font-bold text-sm">{t('noChances')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Projects Section */}
                <section id="projects" className={`space-y-8 ${sectionVisible('projects') ? '' : 'hidden'}`}>
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-[#111827] flex items-center gap-3 uppercase tracking-tight">
                                <Construction className="text-[#1e3a8a]" size={24} />
                                {t('myProjects')}
                            </h2>
                            <button onClick={loadData} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"><RefreshCcw size={16} /></button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {assignedProjects.length > 0 ? assignedProjects.map(p => (
                                <div key={p.id} className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[10px] font-bold uppercase px-2 py-1 bg-blue-50 text-blue-800 rounded">{p.status}</span>
                                        <span className="text-xs font-mono text-slate-400">#{p.id}</span>
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-4">{p.title}</h3>
                                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                                        <span>Progress</span>
                                        <span>{p.progressPercentage || 0}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
                                        <div className="bg-[#1e3a8a] h-2 rounded-full" style={{ width: `${p.progressPercentage || 0}%` }}></div>
                                    </div>
                                    <Link href={`/projects/${p.id}`} className="block w-full text-center py-2 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs uppercase hover:bg-[#1e3a8a] hover:text-white hover:border-[#1e3a8a] transition rounded-lg">
                                        {t('manageProject')}
                                    </Link>
                                </div>
                            )) : <div className="text-center col-span-3 py-12 text-slate-500">{t('noActiveFound')}</div>}
                        </div>
                    </div>
                </section>

                {/* Available Section */}
                <section id="available" className={`space-y-8 ${sectionVisible('available') ? '' : 'hidden'}`}>
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-[#111827] flex items-center gap-3 uppercase tracking-tight">
                                <Search className="text-[#1e3a8a]" size={24} />
                                {t('availableWorks')}
                            </h2>
                            <div className="flex gap-2">
                                <select className="text-xs font-bold border border-slate-200 rounded px-2 py-1" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                                    <option value="recent">{t('recent')}</option>
                                    <option value="severity">{t('priority')}</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredComplaints.length > 0 ? filteredComplaints.map(c => (
                                <div key={c.id} className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded text-white ${c.severity >= 4 ? 'bg-red-600' : 'bg-amber-500'}`}>{t('severity')} {c.severity}</span>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-2">{c.title}</h3>
                                    <p className="text-sm text-slate-500 mb-4 line-clamp-3 flex-1">{c.description}</p>
                                    <Link href={`/tenders/create?complaintId=${c.id}`} className="block w-full text-center py-2 bg-[#1e3a8a] text-white font-bold text-xs uppercase hover:bg-blue-900 transition rounded-lg shadow-lg shadow-blue-900/20">
                                        {t('submitTender')}
                                    </Link>
                                </div>
                            )) : <div className="text-center col-span-3 py-12 text-slate-500">{t('noAvailableFound')}</div>}
                        </div>
                    </div>
                </section>

                {/* Tenders Section */}
                <section id="tenders" className={`space-y-8 ${sectionVisible('tenders') ? '' : 'hidden'}`}>
                    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-[#111827] flex items-center gap-3 uppercase tracking-tight">
                                <FileText className="text-[#1e3a8a]" size={24} />
                                {t('mySubmissions')}
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {myTenders.length > 0 ? myTenders.map(tender => (
                                <div key={tender.id} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50">
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">Tender #{tender.id}</h4>
                                        <p className="text-xs text-slate-500">{t('submittedOn')} {new Date(tender.createdAt || Date.now()).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded border ${tender.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                        tender.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                                            'bg-blue-50 text-blue-700 border-blue-200'
                                        }`}>{tender.status}</span>
                                </div>
                            )) : <div className="text-center py-12 text-slate-500">{t('noTendersFound')}</div>}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color, suffix = "" }: any) {
    const accentColor = {
        blue: "text-[#1e3a8a]",
        orange: "text-orange-600",
        yellow: "text-amber-500",
        emerald: "text-emerald-600",
        red: "text-red-600"
    }[color as string] || "text-slate-600";

    const iconBg = {
        blue: "bg-blue-50 border-blue-100",
        orange: "bg-orange-50 border-orange-100",
        yellow: "bg-amber-50 border-amber-100",
        emerald: "bg-emerald-50 border-emerald-100",
        red: "bg-red-50 border-red-100"
    }[color as string] || "bg-slate-50 border-slate-200";

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group hover:border-[#1e3a8a]">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
                    <div className="text-3xl font-black text-[#111827] tracking-tight">{value}{suffix}</div>
                </div>
                <div className={`p-3 rounded-xl border ${iconBg} ${accentColor} group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    )
}