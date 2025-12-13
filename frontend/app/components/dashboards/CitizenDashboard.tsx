"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import Sidebar from "../shared/Sidebar";
import Link from "next/link";
import { Token, fetchCurrentUserProfile, UserProfile, buildAssetUrl } from "@/lib/api/api";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Clock, Plus, Map, ClipboardList, FileEdit, LayoutDashboard, User, TrendingUp, Star, RefreshCcw, AlertTriangle, Share2, Award } from 'lucide-react';
import NotificationWrapper from "../notifications/NotificationWrapper";
import { useSidebar } from "@/app/contexts/SidebarContext";

interface DashboardComplaint {
  id: number;
  title: string;
  description?: string | null;
  severity: number;
  status?: string | null;
  photoUrl?: string | null;
  rating?: number | null;
  projectId?: number | null;
}

export default function CitizenDashboardComponent() {
  const router = useRouter();
  const { collapsed } = useSidebar();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!Token.get()) {
      router.push("/login");
      return;
    }
    const loadProfile = async () => {
      try {
        const profile = await fetchCurrentUserProfile();
        setUserData(profile);
      } catch (err: any) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const profile = await fetchCurrentUserProfile();
      setUserData(profile);
    } catch (err: any) {
      console.error("Error loading profile:", err);
      // Handle error silently for now
    } finally {
      setLoading(false);
    }
  };



  const complaints: DashboardComplaint[] = (userData?.complaints ?? []) as DashboardComplaint[];

  const stats = useMemo(() => {
    const pending = complaints.filter(c => c.status?.toLowerCase() === "pending").length;
    const inProgress = complaints.filter(c => c.status?.toLowerCase() === "in_progress").length;
    const resolved = complaints.filter(c => c.status?.toLowerCase() === "resolved").length;
    const highPriority = complaints.filter(c => c.severity >= 4).length;

    return {
      total: complaints.length,
      pending,
      inProgress,
      resolved,
      highPriority,
    };
  }, [complaints]);



  const navigateToSection = (section: string) => {
    router.push(`/dashboard/citizen/${section}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="flex min-h-screen relative bg-slate-50 overflow-hidden">
      <div className={`${collapsed ? 'w-16' : 'w-64'} flex-shrink-0 hidden lg:block transition-all duration-300`}></div>

      {/* --- GLOBAL PARALLAX BACKGROUND --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <motion.div animate={{ x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-200 rounded-full blur-[120px] opacity-40" />
        <motion.div animate={{ x: [0, -50, 0], y: [0, -50, 0] }} transition={{ duration: 25, repeat: Infinity }} className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-200 rounded-full blur-[120px] opacity-40" />
      </div>

      <Sidebar />

      {/* Main Content - Better spacing for Gov Header */}
      <main
        className="flex-1 px-6 pb-12 pt-32 lg:px-10 lg:pb-16 lg:pt-36 relative z-10 overflow-y-auto w-full transition-all duration-300"
        data-dashboard-scroll
      >
        {/* Overview Section */}
        <section id="overview" className="space-y-8">
          {/* Header Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e3a8a] to-[#f97316]"></div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center">
                    <LayoutDashboard className="text-[#1e3a8a]" size={24} />
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Citizen Dashboard</h1>
                    <p className="text-slate-600">Welcome back, {userData.fullName || userData.username}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 max-w-lg">Your contributions help build a better city. Track your reports and see the impact.</p>
              </div>
              <div className="flex flex-wrap gap-3 justify-end">
                <NotificationWrapper />
                <button onClick={loadData} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition shadow-sm">
                  <RefreshCcw size={16} />
                </button>
                <Link href="/report">
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 lg:px-6 lg:py-3 bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-lg font-bold shadow-md transition-all duration-300 text-sm lg:text-base">
                    <Plus size={18} /> New Report
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards - Gov Colors */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6">
            <StatCard label="Total Reports" value={stats.total} icon={AlertCircle} color="blue" delay={0.1} />
            <StatCard label="Pending" value={stats.pending} icon={Clock} color="orange" delay={0.2} />
            <StatCard label="In Progress" value={stats.inProgress} icon={TrendingUp} color="purple" delay={0.25} />
            <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle} color="blue" delay={0.3} />
          </div>

          {/* Quick Actions - Official Blue Theme */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-wider flex items-center gap-2">
              <LayoutDashboard size={20} className="text-slate-400" /> Quick Access
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/report">
                <button className="w-full h-full p-5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#1e3a8a] rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md text-left relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#1e3a8a] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-12 h-12 bg-[#1e3a8a] text-white rounded-lg flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                    <FileEdit size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#1e3a8a] transition-colors">Report Issue</h3>
                  <p className="text-sm text-slate-500 mt-1">Submit a new grievance</p>
                </button>
              </Link>

              <Link href="/map">
                <button className="w-full h-full p-5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#1e3a8a] rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md text-left relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#1e3a8a] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-lg flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                    <Map size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#1e3a8a] transition-colors">Live Map</h3>
                  <p className="text-sm text-slate-500 mt-1">View community issues</p>
                </button>
              </Link>

              <Link href="/dashboard/citizen/reports">
                <button className="w-full h-full p-5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#1e3a8a] rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md text-left relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#1e3a8a] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                    <ClipboardList size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#1e3a8a] transition-colors">My Reports</h3>
                  <p className="text-sm text-slate-500 mt-1">Track status & history</p>
                </button>
              </Link>

              <Link href="/dashboard/citizen/profile">
                <button className="w-full h-full p-5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#1e3a8a] rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md text-left relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#1e3a8a] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-12 h-12 bg-slate-600 text-white rounded-lg flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                    <User size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#1e3a8a] transition-colors">Profile</h3>
                  <p className="text-sm text-slate-500 mt-1">Manage your account</p>
                </button>
              </Link>
            </div>
          </div>

          {/* Recent Activity Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Reports */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ClipboardList className="text-slate-400" size={20} />
                  Recent Submissions
                </h2>
                <Link href="/dashboard/citizen/reports" className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-full transition">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {complaints.slice(0, 3).map(complaint => (
                  <div key={complaint.id} className="group p-4 bg-slate-50 hover:bg-white border border-slate-100 hover:border-blue-200 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => router.push(`/dashboard/citizen/complaints/${complaint.id}`)}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-[#1e3a8a] transition-colors">#{complaint.id} - {complaint.title}</h3>
                      <StatusBadge status={complaint.status} />
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">{complaint.description}</p>
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                      <span className={`flex items-center gap-1 ${complaint.severity >= 4 ? 'text-red-600' : complaint.severity >= 3 ? 'text-amber-600' : 'text-slate-500'}`}>
                        <AlertCircle size={12} /> Severity {complaint.severity}/5
                      </span>
                      <span>•</span>
                      <span>Click to view details</span>
                    </div>
                  </div>
                ))}
                {complaints.length === 0 && (
                  <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ClipboardList className="text-slate-300" size={32} />
                    </div>
                    <p className="text-slate-500 font-medium">No reports submitted yet</p>
                    <Link href="/report" className="text-[#1e3a8a] font-bold text-sm mt-2 inline-block hover:underline">Start your first report</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Community Impact - Blue Theme */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-0 overflow-hidden flex flex-col">
              <div className="p-6 pb-4 border-b border-slate-100 flex justify-between items-center bg-white">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="text-slate-400" size={20} /> Impact Score
                </h2>
                <Link href="/dashboard/citizen/analytics" className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-full transition">
                  Full Analytics
                </Link>
              </div>

              <div className="p-8 flex-1 flex flex-col items-center justify-center bg-slate-50/50">
                <div className="relative w-48 h-48 mb-6">
                  {/* Circular Progress Container */}
                  <svg className="w-full h-full transform -rotate-90 drop-shadow-xl">
                    <circle cx="96" cy="96" r="88" stroke="#e2e8f0" strokeWidth="12" fill="transparent" />
                    <circle cx="96" cy="96" r="88" stroke="#1e3a8a" strokeWidth="12" fill="transparent"
                      strokeDasharray={552}
                      strokeDashoffset={552 - (552 * Math.min(100, stats.total * 10 + stats.resolved * 15)) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-slate-900">{Math.min(100, stats.total * 10 + stats.resolved * 15)}</span>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Points</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full px-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                    <div className="text-[#1e3a8a] font-black text-2xl">{stats.resolved}</div>
                    <div className="text-xs text-slate-500 font-bold uppercase mt-1">Solved</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
                    <div className="text-slate-700 font-black text-2xl">{stats.total}</div>
                    <div className="text-xs text-slate-500 font-bold uppercase mt-1">Total</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, delay, suffix = "" }: any) {
  const borderColors = {
    blue: "border-l-blue-600",
    orange: "border-l-orange-500",
    purple: "border-l-purple-600",
    emerald: "border-l-emerald-600",
  }[color as string] || "border-l-slate-400";

  const iconColors = {
    blue: "text-blue-600 bg-blue-50",
    orange: "text-orange-600 bg-orange-50",
    purple: "text-purple-600 bg-purple-50",
    emerald: "text-emerald-600 bg-emerald-50",
  }[color as string] || "text-slate-600 bg-slate-50";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-white rounded-xl p-6 border border-slate-200 border-l-4 shadow-sm hover:shadow-md transition-all duration-300 ${borderColors}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest">{label}</h3>
        <div className={`p-2 rounded-lg ${iconColors}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-3xl font-black text-slate-900">{value}{suffix}</p>
    </motion.div>
  )
}

function StatusBadge({ status }: { status?: string | null }) {
  const s = status?.toLowerCase() || 'pending';
  const styles = s === 'resolved' ? 'bg-emerald-600 text-white' :
    s === 'in_progress' ? 'bg-blue-600 text-white' :
      'bg-amber-500 text-white';

  return (
    <span className={`px-2 py-1 rounded text-[10px] font-bold border-none uppercase tracking-wider ${styles}`}>
      {s.replace('_', ' ')}
    </span>
  )
}