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
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e3a8a] via-[#f97316] to-[#166534]"></div>
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
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 lg:px-6 lg:py-3 bg-[#f97316] hover:bg-orange-600 text-white rounded-lg font-bold shadow-md transition-all duration-300 text-sm lg:text-base">
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
            <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle} color="emerald" delay={0.3} />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/report">
                <button className="w-full p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                      <FileEdit className="text-white" size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-slate-900">Report Issue</h3>
                      <p className="text-xs text-slate-600">Submit new complaint</p>
                    </div>
                  </div>
                </button>
              </Link>

              <Link href="/map">
                <button className="w-full p-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                      <Map className="text-white" size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-slate-900">Live Map</h3>
                      <p className="text-xs text-slate-600">View community issues</p>
                    </div>
                  </div>
                </button>
              </Link>

              <Link href="/dashboard/citizen/reports">
                <button className="w-full p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                      <ClipboardList className="text-white" size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-slate-900">My Reports</h3>
                      <p className="text-xs text-slate-600">Track submissions</p>
                    </div>
                  </div>
                </button>
              </Link>

              <Link href="/dashboard/citizen/profile">
                <button className="w-full p-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl transition group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                      <User className="text-white" size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-slate-900">Profile</h3>
                      <p className="text-xs text-slate-600">Manage account</p>
                    </div>
                  </div>
                </button>
              </Link>
            </div>
          </div>

          {/* Recent Activity Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Reports */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <ClipboardList className="text-blue-600" size={20} />
                  Recent Reports
                </h2>
                <Link href="/dashboard/citizen/reports" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {complaints.slice(0, 3).map(complaint => (
                  <div key={complaint.id} className="p-4 border border-slate-200 rounded-xl hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-900 line-clamp-1">{complaint.title}</h3>
                      <StatusBadge status={complaint.status} />
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-2">{complaint.description}</p>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-medium ${complaint.severity >= 4 ? 'text-red-600' :
                        complaint.severity >= 3 ? 'text-orange-600' : 'text-yellow-600'
                        }`}>
                        Severity {complaint.severity}/5
                      </span>
                      <Link href={`/dashboard/citizen/complaints/${complaint.id}`} className="text-xs text-blue-600 hover:underline">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
                {complaints.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <AlertCircle className="mx-auto mb-2 opacity-50" size={32} />
                    <p>No reports submitted yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Community Impact */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <TrendingUp className="text-emerald-600" size={20} />
                  Community Impact
                </h2>
                <Link href="/dashboard/citizen/analytics" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  View Analytics
                </Link>
              </div>
              <div className="space-y-6">

                {/* Visual Civic Score */}
                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 relative overflow-hidden">
                  <div className="flex justify-between items-start relative z-10">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="text-orange-500 fill-orange-500" size={18} />
                        <h3 className="font-bold text-slate-900">Civic Score</h3>
                      </div>
                      <p className="text-xs text-slate-600 mb-3">Your contribution rating</p>
                      <div className="text-4xl font-black text-slate-900">
                        {Math.min(100, stats.total * 10 + stats.resolved * 15)}
                        <span className="text-lg text-slate-400 font-medium">/100</span>
                      </div>
                    </div>
                    {/* Progress Circle Mockup */}
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-blue-200" />
                        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent"
                          strokeDasharray={226}
                          strokeDashoffset={226 - (226 * Math.min(100, stats.total * 10 + stats.resolved * 15)) / 100}
                          className="text-blue-600 transition-all duration-1000 ease-out" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex flex-col justify-center items-center text-center">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-2 text-emerald-600">
                      <CheckCircle size={20} />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{stats.resolved}</p>
                    <p className="text-xs text-slate-600 font-medium">Issues Solved</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 flex flex-col justify-center items-center text-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2 text-purple-600">
                      <Award size={20} />
                    </div>
                    <p className="text-sm font-bold text-slate-900 mt-1">
                      {stats.total >= 10 ? 'Active Citizen' :
                        stats.total >= 5 ? 'Contributor' :
                          stats.total >= 1 ? 'Helper' : 'New Member'}
                    </p>
                    <p className="text-xs text-slate-600 font-medium">Current Badge</p>
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
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    red: "bg-red-50 text-red-600 border-red-100",
  }[color as string] || "bg-slate-50 text-slate-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wide">{label}</h3>
        <div className={`p-2.5 rounded-xl ${colorStyles} border`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-4xl font-extrabold text-slate-900">{value}{suffix}</p>
    </motion.div>
  )
}

function StatusBadge({ status }: { status?: string | null }) {
  const s = status?.toLowerCase() || 'pending';
  const styles = s === 'resolved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
    s === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
      'bg-orange-100 text-orange-700 border-orange-200';

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${styles}`}>
      {s.replace('_', ' ')}
    </span>
  )
}