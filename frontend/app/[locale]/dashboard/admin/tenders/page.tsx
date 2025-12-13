"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from "framer-motion";
import { fetchAdminDashboard, Token, fetchAllTenders, TenderData } from "@/lib/api/api";
import { ClipboardList, Clock, FileText, CheckCircle, RefreshCcw } from 'lucide-react';
import Sidebar from "@/app/components/Sidebar";
import { useSidebar } from "@/app/contexts/SidebarContext";

export default function AdminTendersPage() {
  const router = useRouter();
  const { collapsed } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tenders, setTenders] = useState<TenderData[]>([]);
  const [pendingComplaints, setPendingComplaints] = useState<any[]>([]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tendersRes, pending] = await Promise.all([
        fetchAllTenders({ limit: 100 }), // Get all tenders for stats
        import('@/lib/api/api').then(mod => mod.fetchOpenComplaints())
      ]);
      setTenders(tendersRes.tenders);
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

  const activeTendersCount = tenders.filter(t => t.status.toLowerCase() === 'open' || t.status.toLowerCase() === 'in progress').length;
  const completedTendersCount = tenders.filter(t => t.status.toLowerCase() === 'awarded' || t.status.toLowerCase() === 'completed').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-[#1e3a8a] rounded-full animate-spin" />
          <p className="text-[#1e3a8a] font-bold text-lg tracking-wide uppercase">Loading Tenders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md border border-slate-200">
          <p className="text-red-600 mb-4 font-bold">{error}</p>
          <button onClick={loadData} className="px-6 py-2 bg-[#1e3a8a] text-white rounded-lg font-bold hover:bg-blue-900 transition">
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

      <main className="flex-1 px-4 sm:px-6 lg:px-10 pb-12 pt-32 lg:pt-36 relative z-10 overflow-y-auto w-full transition-all duration-300">

        {/* Consistent Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e3a8a] to-[#f97316]"></div>
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shadow-md border border-purple-100">
                <ClipboardList size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#111827] uppercase tracking-tight">Tender Management</h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Manage Bids & Allocations</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href="/tenders/create">
                <button className="px-5 py-2.5 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition shadow-sm">
                  + Create Tender
                </button>
              </Link>
              <Link href="/tenders">
                <button className="px-4 py-2 bg-slate-50 text-slate-700 border border-slate-300 rounded-lg font-bold hover:bg-slate-100 transition shadow-sm">
                  View All
                </button>
              </Link>
              <button onClick={loadData} className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg font-bold hover:bg-slate-50 hover:border-[#1e3a8a] transition shadow-sm">
                <RefreshCcw size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center border border-orange-100">
                <Clock size={16} />
              </div>
              <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">Pending Review</h3>
            </div>
            <div className="text-3xl font-black text-[#111827] mb-1">{pendingComplaints.length}</div>
            <p className="text-xs text-slate-500 font-medium">Complaints awaiting tender decision</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100">
                <FileText size={16} />
              </div>
              <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">Active Tenders</h3>
            </div>
            <div className="text-3xl font-black text-[#111827] mb-1">{activeTendersCount}</div>
            <p className="text-xs text-slate-500 font-medium">Currently open for bidding</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center border border-emerald-100">
                <CheckCircle size={16} />
              </div>
              <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">Completed</h3>
            </div>
            <div className="text-3xl font-black text-[#111827] mb-1">{completedTendersCount}</div>
            <p className="text-xs text-slate-500 font-medium">Successfully awarded</p>
          </div>
        </div>

        {/* Solid Card for Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 text-[#1e3a8a] rounded-lg flex items-center justify-center">
              <FileText size={20} />
            </div>
            <h2 className="text-xl font-black text-[#111827] uppercase tracking-tight">Recent Tender Activities</h2>
          </div>
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
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-[#1e3a8a] bg-white hover:shadow-md transition group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center border border-purple-100 group-hover:bg-[#1e3a8a] group-hover:text-white transition">
                          <FileText size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-[#111827] group-hover:text-[#1e3a8a] transition text-sm">{c.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${c.severity >= 4 ? 'bg-red-50 text-red-700 border-red-200' :
                                c.severity >= 3 ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                  'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }`}>
                              Severity {c.severity}/5
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-lg group-hover:bg-[#1e3a8a] group-hover:text-white group-hover:border-[#1e3a8a] transition uppercase">
                        Review
                      </button>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <FileText className="mx-auto mb-3 opacity-50" size={48} />
                <p className="font-bold text-lg">No pending reviews</p>
                <p className="text-sm mt-1">All complaints have been processed.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}