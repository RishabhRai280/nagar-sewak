"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from "next-intl";
import { fetchAdminDashboard, AdminDashboardData, Token, UserStore } from "@/lib/api/api";
import { LogOut, BarChart3, AlertTriangle, Clock, DollarSign, MapPin, Activity, RefreshCcw, FileText, Users, Plus, TrendingUp, ChevronRight } from 'lucide-react';
import ContractorManagement from '../contractors/ContractorManagement';
import Sidebar from "../Sidebar";
import { useSidebar } from "@/app/contexts/SidebarContext";

export default function AdminDashboardComponent() {
  const t = useTranslations('dashboard.admin');
  const router = useRouter();
  const { collapsed } = useSidebar();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingComplaints, setPendingComplaints] = useState<any[]>([]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [res, pending] = await Promise.all([
        fetchAdminDashboard(),
        import('@/lib/api/api').then(mod => mod.fetchOpenComplaints())
      ]);
      setData(res);
      setPendingComplaints(pending);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error loading dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Token.get()) { router.push("/login"); return; }
    loadData();
  }, [router]);

  const handleLogout = () => {
    Token.remove();
    UserStore.remove();
    router.push("/login");
  };

  const renderOverview = useCallback(() => {
    return (
      <section id="overview" className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/projects/status/in-progress">
            <KpiCard label={t('activeProjects')} value={data?.activeProjectsCount} icon={BarChart3} color="blue" clickable />
          </Link>
          <Link href="/map">
            <KpiCard label={t('pendingIssues')} value={data?.pendingComplaintsCount} icon={AlertTriangle} color="orange" clickable />
          </Link>
          <KpiCard label={t('avgResolution')} value={`${data?.averageResolutionTimeHours?.toFixed(1) || 0}h`} icon={Clock} color="purple" />
          <KpiCard label={t('sanctionedBudget')} value={`₹${(data?.totalSanctionedBudget || 0).toLocaleString()}`} icon={DollarSign} color="emerald" />
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="text-lg font-extrabold text-[#111827] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">{t('administrativeActions')}</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/projects/new">
              <button className="px-5 py-2.5 bg-[#1e3a8a] text-white rounded-lg font-bold hover:bg-blue-900 transition flex items-center gap-2 shadow-sm">
                <Plus size={18} /> {t('newProject')}
              </button>
            </Link>
            <Link href="/map">
              <button className="px-5 py-2.5 bg-white text-slate-700 border border-slate-300 rounded-lg font-bold hover:bg-slate-50 hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition flex items-center gap-2 shadow-sm">
                <MapPin size={18} /> {t('viewMap')}
              </button>
            </Link>
            <Link href="/contractors">
              <button className="px-5 py-2.5 bg-white text-slate-700 border border-slate-300 rounded-lg font-bold hover:bg-slate-50 hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition flex items-center gap-2 shadow-sm">
                <Users size={18} /> {t('manageContractors')}
              </button>
            </Link>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Latest Documents */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-[#111827] flex items-center gap-3 uppercase tracking-tight">
                <div className="w-10 h-10 bg-[#1e3a8a] rounded-lg flex items-center justify-center shadow-sm">
                  <FileText className="text-white" size={20} />
                </div>
                {t('latestReports')}
              </h2>
              <button className="text-[#1e3a8a] hover:text-blue-900 font-bold text-sm flex items-center gap-1 uppercase tracking-wide">
                {t('viewAll')} <ChevronRight size={16} />
              </button>
            </div>
            <div className="space-y-1 flex-1">
              {data?.recentComplaints?.slice(0, 4).map((complaint) => (
                <Link key={complaint.id} href={`/complaints/${complaint.id}`}>
                  <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition cursor-pointer group">
                    <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                      <FileText className="text-slate-500 group-hover:text-[#1e3a8a]" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#111827] text-sm group-hover:text-[#1e3a8a] transition truncate">{complaint.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">{t('submittedBy')} • ID: #{complaint.id}</p>
                    </div>
                    <div className="text-xs font-bold text-slate-400 border border-slate-200 px-2 py-1 rounded bg-slate-50">
                      {new Date(complaint.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              )) || (
                  <div className="text-center py-12 text-slate-400">
                    <FileText className="mx-auto mb-3 opacity-30" size={40} />
                    <p className="font-medium text-sm">{t('noRecentDocs')}</p>
                  </div>
                )}
            </div>
          </div>

          {/* Ward Hotspots (Real Data) */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-[#111827] flex items-center gap-3 uppercase tracking-tight">
                <div className="w-10 h-10 bg-[#1e3a8a] rounded-lg flex items-center justify-center shadow-sm">
                  <MapPin className="text-white" size={20} />
                </div>
                {t('wardHotspots')}
              </h2>
            </div>

            <div className="space-y-6 flex-1">
              {data?.wardComplaintHeatmap?.slice(0, 4).map((ward, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-slate-700 uppercase tracking-wide text-xs">{ward.wardName}</span>
                    <span className="font-black text-[#111827]">{ward.complaintCount} {t('issues')}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 border border-slate-200 overflow-hidden">
                    <div
                      className={`h-full rounded-r-full relative group ${ward.complaintCount > 20 ? 'bg-red-600' :
                        ward.complaintCount > 10 ? 'bg-orange-500' :
                          ward.complaintCount > 5 ? 'bg-amber-500' : 'bg-[#1e3a8a]'
                        }`}
                      style={{ width: `${Math.min((ward.complaintCount / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold mt-1 text-right">{ward.projectCount} {t('activeProjects')}</p>
                </div>
              ))}
              {(!data?.wardComplaintHeatmap || data.wardComplaintHeatmap.length === 0) && (
                <div className="text-center py-12 text-slate-400">
                  <MapPin className="mx-auto mb-3 opacity-30" size={40} />
                  <p className="font-medium text-sm">{t('noWardData')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Issue Ticker Section */}
        <div className="bg-[#0f172a] rounded-xl shadow-lg border border-slate-800 p-6 lg:p-8 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 p-32 bg-[#1e3a8a]/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>

          <div className="flex items-center justify-between mb-6 relative z-10 border-b border-slate-800/50 pb-4">
            <h2 className="text-xl font-black flex items-center gap-3 uppercase tracking-wider">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              {t('liveOperations')}
            </h2>
            <span className="text-[10px] font-bold bg-red-600/20 text-red-400 px-3 py-1 rounded-full border border-red-600/30 tracking-widest">
              {t('realTime')}
            </span>
          </div>

          <div className="space-y-3 relative z-10 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {data?.recentComplaints?.length ? (
              data.recentComplaints.slice(0, 5).map((complaint) => (
                <Link key={complaint.id} href={`/complaints/${complaint.id}`}>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition group cursor-pointer">
                    <div className={`p-3 rounded-lg border transition-colors ${complaint.severity >= 4 ? 'bg-red-500/10 text-red-500 border-red-500/20 group-hover:border-red-500/50' :
                      complaint.severity >= 3 ? 'bg-orange-500/10 text-orange-500 border-orange-500/20 group-hover:border-orange-500/50' :
                        'bg-blue-500/10 text-blue-500 border-blue-500/20 group-hover:border-blue-500/50'
                      }`}>
                      <AlertTriangle size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm tracking-wide line-clamp-1">{complaint.title}</h4>
                        <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                          {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {complaint.wardLabel ? `Ward ${complaint.wardLabel}` : t('locationUnmapped')} • ID: #{complaint.id}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm font-medium">{t('noCriticalAlerts')}</div>
            )}
          </div>
        </div>
      </section>
    );
  }, [data, pendingComplaints, handleLogout, t]);

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
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 border border-red-100">
          <AlertTriangle className="text-red-600" size={40} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase">{t('error')}</h3>
        <p className="text-slate-600 mb-8 max-w-md font-medium">{error}</p>
        <div className="flex gap-4">
          <button onClick={loadData} className="flex items-center gap-2 px-8 py-3 bg-[#1e3a8a] text-white rounded-xl font-bold hover:bg-blue-900 transition shadow-lg shadow-blue-900/20">
            <RefreshCcw size={18} /> {t('retry')}
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-8 py-3 bg-white text-slate-700 border border-slate-300 rounded-xl font-bold hover:bg-slate-50 transition">
            <LogOut size={18} /> {t('signOut')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen relative bg-slate-50 overflow-hidden">
      <div className={`${collapsed ? 'w-16' : 'w-64'} flex-shrink-0 hidden lg:block transition-all duration-300`}></div>
      <Sidebar />

      <main
        className="relative z-10 flex-1 px-4 sm:px-6 lg:px-10 pb-12 pt-32 lg:pt-36 overflow-y-auto w-full transition-all duration-300"
        data-dashboard-scroll
      >
        <div className="space-y-8">
          {/* Header Card */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e3a8a] to-[#f97316]"></div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#1e3a8a] rounded-xl flex items-center justify-center shadow-md">
                    <BarChart3 className="text-white" size={28} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-[#111827] tracking-tight uppercase">{t('title')}</h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">{t('subtitle')}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 justify-end items-center">
                <ContractorManagement onContractorCreated={loadData} />
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
          {renderOverview()}
        </div>
      </main>
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, color, clickable, suffix = "" }: any) {
  // Map internal colors to specific solid accent colors
  const accentColor = {
    blue: "text-[#1e3a8a]",
    orange: "text-orange-600",
    purple: "text-purple-600",
    emerald: "text-emerald-600",
    red: "text-red-600"
  }[color as string] || "text-slate-600";

  const iconBg = {
    blue: "bg-blue-50 border-blue-100",
    orange: "bg-orange-50 border-orange-100",
    purple: "bg-purple-50 border-purple-100",
    emerald: "bg-emerald-50 border-emerald-100",
    red: "bg-red-50 border-red-100"
  }[color as string] || "bg-slate-50 border-slate-200";

  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group ${clickable ? 'cursor-pointer hover:border-[#1e3a8a]' : ''}`}>
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