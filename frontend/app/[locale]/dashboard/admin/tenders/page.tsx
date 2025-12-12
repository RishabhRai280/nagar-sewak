"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from "framer-motion";
import { fetchAdminDashboard, AdminDashboardData, Token } from "@/lib/api/api";
import { ClipboardList, Clock, FileText, CheckCircle, RefreshCcw } from 'lucide-react';
import Sidebar from "@/app/components/Sidebar";
import { useSidebar } from "@/app/contexts/SidebarContext";

export default function AdminTendersPage() {
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
    if (!Token.get()) { 
      router.push("/login"); 
      return; 
    }
    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading tenders...</p>
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
        {/* Tenders Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <ClipboardList className="text-purple-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Tender Management</h1>
                <p className="text-slate-600">Review and manage tender submissions</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/tenders/create">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition">
                  Create Tender
                </button>
              </Link>
              <Link href="/tenders">
                <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition">
                  View All
                </button>
              </Link>
              <button onClick={loadData} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition">
                <RefreshCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pending Review */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="text-orange-600" size={16} />
              </div>
              <h3 className="font-bold text-slate-900">Pending Review</h3>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">{pendingComplaints.length}</div>
            <p className="text-sm text-slate-600">Complaints awaiting tender review</p>
          </div>

          {/* Active Tenders */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600" size={16} />
              </div>
              <h3 className="font-bold text-slate-900">Active Tenders</h3>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">12</div>
            <p className="text-sm text-slate-600">Currently open for bidding</p>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-emerald-600" size={16} />
              </div>
              <h3 className="font-bold text-slate-900">Completed</h3>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">45</div>
            <p className="text-sm text-slate-600">Successfully awarded</p>
          </div>
        </div>

        <GlassCard title="Recent Tender Activities" icon={FileText}>
          <div className="space-y-4">
            {pendingComplaints.length > 0 ? (
              pendingComplaints.slice(0, 5).map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/complaints/${c.id}/tenders`}>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50 transition group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <FileText className="text-purple-600" size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition">{c.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">Severity: {c.severity}/5</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              c.severity >= 4 ? 'bg-red-100 text-red-700' :
                              c.severity >= 3 ? 'bg-orange-100 text-orange-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {c.severity >= 4 ? 'HIGH' : c.severity >= 3 ? 'MEDIUM' : 'LOW'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition">
                        Review
                      </button>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500">
                <FileText className="mx-auto mb-3 opacity-50" size={48} />
                <p className="font-medium">No pending tender reviews</p>
                <p className="text-sm mt-1">All complaints are either resolved or in progress.</p>
              </div>
            )}
          </div>
        </GlassCard>
      </main>
    </div>
  );
}

function GlassCard({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Icon className="text-blue-600" size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}