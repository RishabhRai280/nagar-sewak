"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Token, fetchContractorDashboard, ContractorDashboardData, UserStore } from "@/lib/api";
import { Construction, AlertTriangle, CheckCircle, Star, Eye, RefreshCcw, LogOut } from 'lucide-react';
import Link from "next/link";

export default function ContractorDashboardComponent() {
  const router = useRouter();
  const [data, setData] = useState<ContractorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleLogout = () => {
    Token.remove();
    UserStore.remove();
    router.push("/login");
  };

  const kpis = useMemo(() => data ? {
      active: data.metrics?.activeProjects ?? 0,
      completed: data.metrics?.completedProjects ?? 0,
      complaints: data.metrics?.pendingComplaints ?? 0,
      rating: data.profile?.avgRating ?? 0
  } : null, [data]);

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
  const recentRatings = data?.recentRatings ?? [];

  return (
    // FIX: overflow-y-auto enables scrolling
    <main className="flex-1 relative min-h-screen bg-slate-50 overflow-y-auto">
      
      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none z-0 fixed">
         <motion.div animate={{ x: [0, 40, 0], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 18, repeat: Infinity }} className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-orange-200 rounded-full blur-[100px]" />
      </div>

      {/* FIX: pt-32 pushes content down so Header doesn't cover it */}
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
                        <Construction className="text-blue-600"/> Assigned Projects
                    </h2>
                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{assignedProjects.length}</span>
                </div>
                
                <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                    {assignedProjects.length > 0 ? (
                        assignedProjects.map(p => (
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
                                {/* FIX: Using window.location as backup if Next Link fails in some contexts, but Link is preferred */}
                                <Link href={`/projects/${p.id}`} className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline cursor-pointer z-10 relative">
                                    View Details <Eye size={16}/>
                                </Link>
                            </div>
                        ))
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
                        <AlertTriangle className="text-orange-600"/> Public Complaints
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
                                        <AlertTriangle size={14}/> Severity: {c.severity}/5
                                    </div>
                                    <Link href="/map" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                                        Locate <Eye size={12}/>
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
      </div>
    </main>
  );
}

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
                <div className={`p-3 rounded-xl ${colors}`}><Icon size={24}/></div>
                <span className="text-4xl font-extrabold text-slate-900">{value}{suffix}</span>
            </div>
            <p className="text-slate-500 font-bold text-sm mt-2">{label}</p>
        </div>
    )
}