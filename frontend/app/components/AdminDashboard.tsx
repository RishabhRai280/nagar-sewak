"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from "framer-motion";
import { fetchAdminDashboard, AdminDashboardData, Token, UserStore } from "@/lib/api";
import { LogOut, BarChart3, AlertTriangle, Clock, DollarSign, MapPin, Activity, RefreshCcw } from 'lucide-react';
import ContractorManagement from './ContractorManagement';

export default function AdminDashboardComponent() {
  const router = useRouter();
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
        import('@/lib/api').then(mod => mod.fetchOpenComplaints())
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
    <div className="flex-1 relative min-h-screen bg-slate-50 overflow-y-auto">
      {/* Parallax Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 fixed">
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 15, repeat: Infinity }} className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-purple-200 rounded-full blur-[120px]" />
        <motion.div animate={{ x: [0, -30, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-200 rounded-full blur-[120px]" />
      </div>

      {/* Better spacing for header */}
      <main className="relative z-10 px-4 sm:px-6 lg:px-10 pb-12 pt-24 lg:pt-28 max-w-7xl mx-auto">

        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2">Admin Overview</h1>
            <p className="text-slate-600 font-medium text-sm lg:text-base">Real-time governance metrics & analytics</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-slate-600 font-medium">System Active</span>
              </div>
              <div className="text-sm text-slate-500">
                Total Projects: <span className="font-bold text-slate-900">{data?.totalProjects || 0}</span>
              </div>
              <div className="text-sm text-slate-500">
                Resolved: <span className="font-bold text-emerald-600">{data?.resolvedComplaintsCount || 0}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:gap-3">
            <ContractorManagement onContractorCreated={loadData} />
            <button onClick={loadData} className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition border border-blue-100" title="Refresh Data">
              <RefreshCcw size={18} />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 lg:px-5 py-2.5 bg-white/60 hover:bg-red-50 text-slate-700 hover:text-red-600 rounded-xl border border-white/60 shadow-sm backdrop-blur-md transition font-bold text-sm">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Link href="/projects/status/in-progress">
            <KpiCard label="Active Projects" value={data?.activeProjectsCount} icon={BarChart3} color="blue" clickable />
          </Link>
          <Link href="/map">
            <KpiCard label="Pending Issues" value={data?.pendingComplaintsCount} icon={AlertTriangle} color="orange" clickable />
          </Link>
          <KpiCard label="Avg Resolution" value={`${data?.averageResolutionTimeHours?.toFixed(1) || 0}h`} icon={Clock} color="purple" />
          <KpiCard label="Sanctioned Budget" value={`₹${(data?.totalSanctionedBudget || 0).toLocaleString()}`} icon={DollarSign} color="emerald" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Project Status */}
          <GlassCard title="Project Status" icon={Activity}>
            <div className="space-y-5">
              {data?.projectStatusBreakdown?.map((entry, i) => {
                const statusSlug = entry.status.toLowerCase().replace(/ /g, '-');
                return (
                  <Link key={i} href={`/projects/status/${statusSlug}`}>
                    <div className="group cursor-pointer hover:bg-slate-50 p-3 rounded-xl transition-all">
                      <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                        <span className="group-hover:text-blue-600 transition">{entry.status}</span>
                        <span>{entry.projectCount}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(entry.projectCount / (data.totalProjects || 1)) * 100}%` }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full group-hover:from-blue-600 group-hover:to-indigo-600 transition"
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1 text-right">₹{Number(entry.totalBudget).toLocaleString()}</p>
                    </div>
                  </Link>
                );
              })}
              {!data?.projectStatusBreakdown?.length && <p className="text-slate-500 text-center">No project data found.</p>}
            </div>
          </GlassCard>

          {/* Pending Tenders / Complaints */}
          <GlassCard title="Tender Management" icon={FileText}>
            {pendingComplaints.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm font-bold text-blue-900">
                  {pendingComplaints.length} complaint{pendingComplaints.length !== 1 ? 's' : ''} awaiting tender review
                </p>
              </div>
            )}
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {pendingComplaints.length > 0 ? (
                pendingComplaints.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-white/50 hover:bg-white/60 hover:border-blue-200 transition group"
                  >
                    <div className="flex-1 mr-2">
                      <p className="font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition">{c.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500 font-semibold">Severity: {c.severity}/5</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.severity >= 4 ? 'bg-red-100 text-red-700' :
                          c.severity >= 3 ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {c.severity >= 4 ? 'HIGH' : c.severity >= 3 ? 'MEDIUM' : 'LOW'}
                        </span>
                      </div>
                    </div>
                    <Link href={`/complaints/${c.id}/tenders`}>
                      <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition shadow-sm hover:shadow-md">
                        Review Tenders
                      </button>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto text-slate-300 mb-3" size={48} />
                  <p className="text-slate-500 font-medium">No pending complaints requiring tenders.</p>
                  <p className="text-xs text-slate-400 mt-1">All complaints are either resolved or in progress.</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Ward Hotspots */}
          <GlassCard title="Ward Hotspots" icon={MapPin}>
            <div className="space-y-3">
              {data?.wardComplaintHeatmap?.slice(0, 5).map((ward, i) => (
                <Link key={i} href="/map">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-white/50 hover:bg-white/60 hover:border-blue-200 transition cursor-pointer group">
                    <div>
                      <p className="font-bold text-slate-800 group-hover:text-blue-600 transition">{ward.wardName}</p>
                      <p className="text-xs text-slate-500 font-semibold">{ward.zone} Zone</p>
                    </div>
                    <div className="flex gap-3 text-xs font-bold">
                      <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100">{ward.complaintCount} Issues</span>
                      <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">{ward.projectCount} Projects</span>
                    </div>
                  </div>
                </Link>
              ))}
              {!data?.wardComplaintHeatmap?.length && <p className="text-slate-500 text-center">No ward activity data.</p>}
            </div>
          </GlassCard>

          {/* Flagged Contractors */}
          <GlassCard title="Contractor Compliance" icon={AlertTriangle}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="text-xs text-slate-500 uppercase bg-white/40 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Company</th>
                    <th className="px-4 py-3">License</th>
                    <th className="px-4 py-3">Rating</th>
                    <th className="px-4 py-3 rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data?.flaggedContractors?.map((c, i) => (
                    <tr key={i} className="hover:bg-white/40 transition">
                      <td className="px-4 py-3 font-bold text-slate-900">{c.companyName}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">{c.licenseNo}</td>
                      <td className="px-4 py-3 font-bold text-red-600 flex items-center gap-1">{c.avgRating.toFixed(1)} <span className="text-yellow-500 text-xs">★</span></td>
                      <td className="px-4 py-3"><span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-[10px] uppercase font-bold border border-red-200">Flagged</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!data?.flaggedContractors?.length) && <p className="p-8 text-center text-slate-500 italic">No contractors currently flagged.</p>}
            </div>
          </GlassCard>
        </div>

        {/* Recent Complaints Section */}
        <div className="mb-10">
          <GlassCard title="Recent Complaints" icon={AlertTriangle}>
            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {data?.recentComplaints?.map((complaint, i) => (
                <motion.div
                  key={complaint.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/40 border border-white/50 hover:bg-white/60 hover:border-blue-200 transition group"
                >
                  <div className="flex-1 mr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition">{complaint.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        complaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                        'bg-orange-100 text-orange-700 border border-orange-200'
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <AlertTriangle size={12} />
                        Severity: {complaint.severity}/5
                      </span>
                      {complaint.lat && complaint.lng && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {complaint.lat.toFixed(4)}, {complaint.lng.toFixed(4)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/map?lat=${complaint.lat}&lng=${complaint.lng}`}>
                      <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition border border-slate-200">
                        View on Map
                      </button>
                    </Link>
                    <Link href={`/complaints/${complaint.id}/tenders`}>
                      <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition">
                        Manage
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
              {!data?.recentComplaints?.length && (
                <p className="text-slate-500 text-center py-8">No recent complaints to display.</p>
              )}
            </div>
          </GlassCard>
        </div>



      </main>
    </div>
  );
}

import { FileText } from "lucide-react";

function KpiCard({ label, value, icon: Icon, color, clickable }: any) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
    emerald: "bg-emerald-100 text-emerald-600"
  }[color as string] || "bg-slate-100 text-slate-600";

  return (
    <div className={`bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-lg hover:-translate-y-1 transition-transform duration-300 ${clickable ? 'cursor-pointer hover:shadow-2xl hover:border-blue-200' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${colors}`}><Icon size={24} /></div>
      </div>
      <div className="text-3xl font-extrabold text-slate-900">{value}</div>
      <div className="text-sm font-bold text-slate-500 mt-1">{label}</div>
    </div>
  )
}

function GlassCard({ title, icon: Icon, children, className = "" }: any) {
  return (
    <div className={`bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl p-8 ${className}`}>
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Icon size={24} className="text-slate-700" /> {title}
      </h2>
      {children}
    </div>
  )
}