"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Token, fetchContractorDashboard, ContractorDashboardData, UserStore } from "@/lib/api/api";
import { Construction, AlertTriangle, CheckCircle, Star, Eye, RefreshCcw, LogOut } from 'lucide-react';
import Link from "next/link";

export default function ContractorDashboardComponent() {
    const router = useRouter();
    const [data, setData] = useState<ContractorDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openComplaints, setOpenComplaints] = useState<any[]>([]);
    const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'available' | 'tenders'>('overview');
    const [myTenders, setMyTenders] = useState<any[]>([]);
    const [filterSeverity, setFilterSeverity] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<'severity' | 'recent'>('recent');
    const [selectedProject, setSelectedProject] = useState<any | null>(null);
    const [showProgressModal, setShowProgressModal] = useState(false);

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

    const handleLogout = () => {
        Token.remove();
        UserStore.remove();
        router.push("/login");
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

    return (
        <main className="flex-1 relative min-h-screen bg-slate-50 overflow-y-auto">

            {/* Background Blobs */}
            <div className="absolute inset-0 pointer-events-none z-0 fixed">
                <motion.div animate={{ x: [0, 40, 0], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 18, repeat: Infinity }} className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-orange-200 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 px-6 pb-12 pt-32 lg:px-12 lg:pb-16 lg:pt-36 max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{data?.profile?.companyName || "Contractor"} Portal</h1>
                        <p className="text-slate-600 font-medium">Performance Overview & Tasks</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={loadData}
                            className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition border border-blue-100"
                            title="Refresh Data"
                        >
                            <RefreshCcw size={20} />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/60 hover:bg-red-50 text-slate-700 hover:text-red-600 rounded-xl border border-white/60 shadow-sm backdrop-blur-md transition font-bold text-sm"
                        >
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-4 mb-8 border-b border-slate-200 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`pb-3 px-2 font-bold transition whitespace-nowrap ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        My Projects
                    </button>
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`pb-3 px-2 font-bold transition whitespace-nowrap ${activeTab === 'available' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Available Works ({openComplaints.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('tenders')}
                        className={`pb-3 px-2 font-bold transition whitespace-nowrap ${activeTab === 'tenders' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        My Tenders ({myTenders.length})
                    </button>
                </div>

                {activeTab === 'overview' ? (
                    <>
                        {/* KPIs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            <StatCard label="Active Sites" value={kpis?.active} icon={Construction} color="blue" />
                            <StatCard label="Open Complaints" value={kpis?.complaints} icon={AlertTriangle} color="orange" />
                            <StatCard label="Completed" value={kpis?.completed} icon={CheckCircle} color="emerald" />
                            <StatCard label="Avg Rating" value={kpis?.rating?.toFixed(1)} icon={Star} color="yellow" suffix="★" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Projects Section */}
                            <div id="projects" className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <Construction className="text-blue-600" /> Assigned Projects
                                    </h2>
                                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{assignedProjects.length}</span>
                                </div>

                                <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                                    {assignedProjects.length > 0 ? (
                                        assignedProjects.map(p => {
                                            // Use actual progressPercentage from database, fallback to status-based estimate
                                            const progress = p.progressPercentage !== undefined && p.progressPercentage !== null 
                                                ? p.progressPercentage 
                                                : (p.status?.toLowerCase() === 'completed' ? 100 : 
                                                   p.status?.toLowerCase() === 'in progress' ? 50 : 0);
                                            return (
                                                <div key={p.id} className="p-5 bg-white/60 border border-white/80 rounded-xl hover:shadow-md transition group">
                                                    <div className="flex justify-between mb-2">
                                                        <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded ${p.status?.toLowerCase() === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                                            {p.status}
                                                        </span>
                                                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                                            ID: #{p.id}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-blue-700 transition-colors">{p.title}</h3>
                                                    <p className="text-sm text-slate-500 mb-3">Budget: ₹{p.budget?.toLocaleString()}</p>
                                                    
                                                    {/* Progress Bar */}
                                                    <div className="mb-3">
                                                        <div className="flex justify-between text-xs mb-1">
                                                            <span className="text-slate-600 font-bold">Progress</span>
                                                            <span className="text-blue-600 font-bold">{progress}%</span>
                                                        </div>
                                                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                                            <div 
                                                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                                                                style={{ width: `${progress}%` }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Link href={`/projects/${p.id}`} className="flex-1 text-center py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition">
                                                            View Details
                                                        </Link>
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedProject(p);
                                                                setShowProgressModal(true);
                                                            }}
                                                            className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition"
                                                        >
                                                            Update Progress
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-12 text-slate-500 bg-slate-50/50 rounded-xl border border-dashed border-slate-300">
                                            <Construction className="mx-auto mb-3 opacity-50 text-blue-400" size={32} />
                                            <p>No active projects assigned.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Complaints Section */}
                            <div id="complaints" className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <AlertTriangle className="text-orange-600" /> Public Complaints
                                    </h2>
                                    <span className="text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1 rounded-full">{linkedComplaints.length}</span>
                                </div>

                                <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                                    {linkedComplaints.length > 0 ? (
                                        linkedComplaints.map(c => (
                                            <div key={c.id} className="p-5 bg-white/60 border border-white/80 rounded-xl hover:shadow-md transition">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-slate-900 line-clamp-1 flex-1 mr-2">{c.title}</h4>
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${c.status?.toLowerCase() === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                                                        {c.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed">{c.description}</p>
                                                <div className="flex justify-between items-center">
                                                    <div className={`text-xs font-bold flex items-center gap-1 ${c.severity >= 4 ? 'text-red-600' : 'text-yellow-600'}`}>
                                                        <AlertTriangle size={14} /> Severity: {c.severity}/5
                                                    </div>
                                                    <Link href="/map" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                                                        Locate <Eye size={12} />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-slate-500 bg-slate-50/50 rounded-xl border border-dashed border-slate-300">
                                            <CheckCircle className="mx-auto mb-3 opacity-50 text-emerald-500" size={32} />
                                            <p>No complaints linked to your projects.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : activeTab === 'available' ? (
                    /* Available Works Section */
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Construction className="text-blue-600" /> Available Works
                                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{filteredComplaints.length}</span>
                            </h2>
                            
                            {/* Filters */}
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
                    </div>
                ) : (
                    /* Tender History Section */
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                📋 My Tender Submissions
                            </h2>
                            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{myTenders.length}</span>
                        </div>

                        {/* Tender Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <p className="text-xs text-blue-600 font-bold uppercase mb-1">Total Submitted</p>
                                <p className="text-2xl font-extrabold text-slate-900">{myTenders.length}</p>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <p className="text-xs text-emerald-600 font-bold uppercase mb-1">Accepted</p>
                                <p className="text-2xl font-extrabold text-slate-900">
                                    {myTenders.filter(t => t.status === 'ACCEPTED').length}
                                </p>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                                <p className="text-xs text-orange-600 font-bold uppercase mb-1">Pending</p>
                                <p className="text-2xl font-extrabold text-slate-900">
                                    {myTenders.filter(t => t.status === 'PENDING').length}
                                </p>
                            </div>
                            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                <p className="text-xs text-red-600 font-bold uppercase mb-1">Rejected</p>
                                <p className="text-2xl font-extrabold text-slate-900">
                                    {myTenders.filter(t => t.status === 'REJECTED').length}
                                </p>
                            </div>
                        </div>

                        {/* Tender List */}
                        <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                            {myTenders.length > 0 ? (
                                myTenders.map((tender, i) => (
                                    <motion.div
                                        key={tender.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="p-5 bg-white rounded-xl border border-slate-200 hover:shadow-lg transition"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
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
                                                    Complaint #{tender.complaintId}
                                                </h3>
                                                <p className="text-sm text-slate-600 line-clamp-2 mb-3">{tender.description}</p>
                                                <div className="flex gap-4 text-sm">
                                                    <span className="font-bold text-blue-600">
                                                        Bid: ₹{tender.quoteAmount.toLocaleString()}
                                                    </span>
                                                    <span className="font-bold text-emerald-600">
                                                        Duration: {tender.estimatedDays} days
                                                    </span>
                                                </div>
                                            </div>
                                            <Link href={`/tenders/${tender.id}`}>
                                                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition whitespace-nowrap">
                                                    View Details
                                                </button>
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                    <p className="mb-2">No tenders submitted yet</p>
                                    <button 
                                        onClick={() => setActiveTab('available')}
                                        className="text-blue-600 font-bold hover:underline"
                                    >
                                        Browse Available Works →
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tender Modal */}
                {selectedComplaint && (
                    <TenderModalWrapper
                        complaintId={selectedComplaint.id}
                        complaintTitle={selectedComplaint.title}
                        onClose={() => setSelectedComplaint(null)}
                        onSuccess={() => {
                            loadData();
                            alert("Tender submitted successfully!");
                        }}
                    />
                )}

                {/* Progress Update Modal */}
                {showProgressModal && selectedProject && (
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
                )}

            </div>
        </main>
    );
}

// Helper wrapper to lazy load the modal
import dynamic from 'next/dynamic';
const TenderModalWrapper = dynamic(() => import('../tenders/TenderModal'), { ssr: false });

function StatCard({ label, value, icon: Icon, color, suffix = "" }: any) {
    const colors = {
        blue: "text-blue-600 bg-blue-50",
        orange: "text-orange-600 bg-orange-50",
        emerald: "text-emerald-600 bg-emerald-50",
        yellow: "text-yellow-600 bg-yellow-50",
    }[color as string] || "text-slate-600 bg-slate-50";

    return (
        <div className="bg-white/70 backdrop-blur-lg border border-white/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-2">
                <div className={`p-3 rounded-xl ${colors}`}><Icon size={24} /></div>
                <span className="text-4xl font-extrabold text-slate-900">{value}{suffix}</span>
            </div>
            <p className="text-slate-500 font-bold text-sm mt-2">{label}</p>
        </div>
    )
}

// Progress Update Modal Component
function ProgressUpdateModal({ project, onClose, onSuccess }: any) {
    const [progress, setProgress] = useState(60);
    const [status, setStatus] = useState(project.status || 'In Progress');
    const [notes, setNotes] = useState('');
    const [photos, setPhotos] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + photos.length > 5) {
            alert('Maximum 5 photos allowed');
            return;
        }
        
        setPhotos([...photos, ...files]);
        
        // Create preview URLs
        const newUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls([...previewUrls, ...newUrls]);
    };

    const removePhoto = (index: number) => {
        const newPhotos = photos.filter((_, i) => i !== index);
        const newUrls = previewUrls.filter((_, i) => i !== index);
        URL.revokeObjectURL(previewUrls[index]);
        setPhotos(newPhotos);
        setPreviewUrls(newUrls);
    };

    const handleSubmit = async () => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('progress', progress.toString());
            formData.append('status', status);
            formData.append('notes', notes);
            photos.forEach(photo => formData.append('photos', photo));

            // Call API to update project progress
            await import('@/lib/api/api').then(mod => 
                mod.updateProjectProgress(project.id, formData)
            );

            alert('Progress updated successfully!');
            onSuccess();
        } catch (error: any) {
            alert(error.message || 'Failed to update progress');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-slate-900">Update Project Progress</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition"
                        >
                            ✕
                        </button>
                    </div>
                    <p className="text-slate-600 mt-1">{project.title}</p>
                </div>

                <div className="p-6 space-y-6">
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
                            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
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
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
                                    {photos.length}/5 photos selected
                                </p>
                            </label>
                        </div>

                        {/* Photo Previews */}
                        {previewUrls.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mt-4">
                                {previewUrls.map((url, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={url}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg"
                                        />
                                        <button
                                            onClick={() => removePhoto(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 border-t border-slate-200 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={uploading}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? 'Updating...' : 'Update Progress'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}