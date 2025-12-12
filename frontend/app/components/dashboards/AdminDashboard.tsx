"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from "framer-motion";
import { fetchAdminDashboard, AdminDashboardData, Token, UserStore } from "@/lib/api/api";
import { LogOut, BarChart3, AlertTriangle, Clock, DollarSign, MapPin, Activity, RefreshCcw, ClipboardList, FileText, Users, CheckCircle, Star, Plus, Zap, TrendingUp } from 'lucide-react';
import ContractorManagement from '../contractors/ContractorManagement';
import Sidebar from "../Sidebar";
import { useCallback } from "react";
import { useSidebar } from "@/app/contexts/SidebarContext";

export default function AdminDashboardComponent() {
  const router = useRouter();
  const { collapsed } = useSidebar();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingComplaints, setPendingComplaints] = useState<any[]>([]);
  const [selectedComplaintForTender, setSelectedComplaintForTender] = useState<any | null>(null);


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

  const navigateToSection = (section: string) => {
    router.push(`/dashboard/admin/${section}`);
  };

  const renderOverview = useCallback(() => {
    return (
      <section id="overview" className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/projects/status/in-progress">
            <KpiCard label="Active Projects" value={data?.activeProjectsCount} icon={BarChart3} color="blue" clickable />
          </Link>
          <Link href="/map">
            <KpiCard label="Pending Issues" value={data?.pendingComplaintsCount} icon={AlertTriangle} color="orange" clickable />
          </Link>
          <KpiCard label="Avg Resolution" value={`${data?.averageResolutionTimeHours?.toFixed(1) || 0}h`} icon={Clock} color="purple" />
          <KpiCard label="Sanctioned Budget" value={`₹${(data?.totalSanctionedBudget || 0).toLocaleString()}`} icon={DollarSign} color="emerald" />
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/projects/new">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
                <Plus size={16} /> New Project
              </button>
            </Link>
            <Link href="/map">
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition flex items-center gap-2">
                <MapPin size={16} /> View Map
              </button>
            </Link>
            <Link href="/contractors">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition flex items-center gap-2">
                <Users size={16} /> Manage Contractors
              </button>
            </Link>
            <button onClick={loadData} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition flex items-center gap-2">
              <RefreshCcw size={16} /> Refresh Data
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Latest Documents */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="text-blue-600" size={20} />
                </div>
                Latest document
              </h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                See all
              </button>
            </div>
            <div className="space-y-4">
              {data?.recentComplaints?.slice(0, 4).map((complaint, i) => (
                <Link key={complaint.id} href={`/complaints/${complaint.id}`}>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition cursor-pointer group">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="text-red-600" size={16} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition">{complaint.title}</h4>
                      <p className="text-xs text-slate-500">Submitted by • Citizen</p>
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(complaint.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              )) || (
                  <div className="text-center py-8 text-slate-500">
                    <FileText className="mx-auto mb-2 opacity-50" size={32} />
                    <p>No recent documents</p>
                  </div>
                )}
            </div>
          </div>

          {/* Department Performance */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Activity className="text-purple-600" size={20} />
                </div>
                Department Performance
              </h2>
              <select className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-1 outline-none">
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>

            <div className="space-y-5">
              {/* Roads Dept */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-700">Road Maintenance</span>
                  <span className="font-bold text-slate-900">85%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full w-[85%] relative group">
                    <div className="absolute -top-8 right-0 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      124 Issues Fixed
                    </div>
                  </div>
                </div>
              </div>

              {/* Sanitation */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-700">Sanitation & Waste</span>
                  <span className="font-bold text-slate-900">92%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full w-[92%] relative group">
                    <div className="absolute -top-8 right-0 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      205 Bins Cleared
                    </div>
                  </div>
                </div>
              </div>

              {/* Water */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-700">Water Supply</span>
                  <span className="font-bold text-slate-900">74%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-blue-400 h-2.5 rounded-full w-[74%] relative group">
                    <div className="absolute -top-8 right-0 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      68 Leaks Fixed
                    </div>
                  </div>
                </div>
              </div>

              {/* Electrical */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-700">Electrical & Streetlights</span>
                  <span className="font-bold text-slate-900">88%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-yellow-500 h-2.5 rounded-full w-[88%] relative group">
                    <div className="absolute -top-8 right-0 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      150 Lights Repaired
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Issue Ticker Section */}
        <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-700 p-6 lg:p-8 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>

          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              Live Issue Ticker
            </h2>
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/30">
              LIVE UPDATES
            </span>
          </div>

          <div className="space-y-4 relative z-10 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {data?.pendingComplaintsCount ? (
              <>
                {/* Mock Live Items mixed with real count context if available, otherwise generic structure */}
                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                  <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                    <AlertTriangle size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm">Large Pothole / Road Damage</h4>
                      <span className="text-[10px] text-slate-400">Just now</span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">Sector 4, Main Market Road. High traffic area...</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                  <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                    <Zap size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm">Streetlight Malfunction</h4>
                      <span className="text-[10px] text-slate-400">2 mins ago</span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">Block B, Lane 5 darker than usual...</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <TrendingUp size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm">Water Supply Interruption</h4>
                      <span className="text-[10px] text-slate-400">5 mins ago</span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">Low pressure reported in Zone 2...</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-slate-500 text-sm text-center py-4">No active critical alerts.</p>
            )}
          </div>
        </div>
      </section>
    );
  }, [data, pendingComplaints, handleLogout]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading Admin Overview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
        <AlertTriangle className="text-red-500 mb-4" size={48} />
        <h3 className="text-xl font-bold text-slate-800 mb-2">Unable to load dashboard</h3>
        <p className="text-slate-600 mb-6">{error}</p>
        <div className="flex gap-4">
          <button onClick={loadData} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
            <RefreshCcw size={18} /> Retry
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition">
            <LogOut size={18} /> Sign Out
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
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e3a8a] via-[#f97316] to-[#166534]"></div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center">
                    <BarChart3 className="text-[#1e3a8a]" size={24} />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-600">Strengthening public sector workforce through Technology</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500">Leverage technology to improve efficiency and innovation.</p>
              </div>
              <div className="flex flex-wrap gap-3 justify-end">
                <ContractorManagement onContractorCreated={loadData} />
                <button onClick={loadData} className="px-4 py-2.5 rounded-xl bg-[#1e3a8a] hover:bg-blue-800 text-white font-bold shadow-lg transition" title="Refresh Data">
                  <div className="flex items-center gap-2"><RefreshCcw size={18} /> Refresh</div>
                </button>
                <button onClick={handleLogout} className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 font-semibold border border-slate-200 hover:border-red-200 transition">
                  <div className="flex items-center gap-2"><LogOut size={16} /> Sign Out</div>
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
  const colors = {
    blue: "bg-blue-100 text-blue-600 border-blue-200",
    orange: "bg-orange-100 text-orange-600 border-orange-200",
    purple: "bg-purple-100 text-purple-600 border-purple-200",
    emerald: "bg-emerald-100 text-emerald-600 border-emerald-200",
    red: "bg-red-100 text-red-600 border-red-200"
  }[color as string] || "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${clickable ? 'cursor-pointer hover:border-blue-300' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl border ${colors}`}>
          <Icon size={24} />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-900">{value}{suffix}</div>
          <div className="text-sm font-medium text-slate-500">{label}</div>
        </div>
      </div>
    </div>
  )
}

function GlassCard({ title, icon: Icon, children, className = "" }: any) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-lg p-6 lg:p-8 ${className}`}>
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
          <Icon size={20} className="text-slate-600" />
        </div>
        {title}
      </h2>
      {children}
    </div>
  )
}