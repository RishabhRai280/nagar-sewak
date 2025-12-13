"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Token, fetchCurrentUserProfile, UserProfile } from "@/lib/api/api";
import { Calendar } from 'lucide-react';
import Sidebar from "@/app/components/Sidebar";
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

export default function CitizenHistoryPage() {
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

  const complaints: DashboardComplaint[] = (userData?.complaints ?? []) as DashboardComplaint[];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading your history...</p>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="flex min-h-screen relative bg-slate-50 overflow-hidden">
      <div className={`${collapsed ? 'w-16' : 'w-64'} flex-shrink-0 hidden lg:block transition-all duration-300`}></div>

      <Sidebar />

      <main className="flex-1 px-6 pb-12 pt-24 lg:px-10 lg:pb-16 lg:pt-28 relative z-10 overflow-y-auto w-full transition-all duration-300">
        {/* History Header - Gov Style */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8 mb-8 border-l-4 border-l-[#1e3a8a]">
          <div className="flex items-center justify-between mb-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1e3a8a] rounded-lg flex items-center justify-center shadow-md">
                <Calendar className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Activity Log</h1>
                <p className="text-sm font-medium text-slate-500">Timeline of your interactions and submissions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline View - Clean & Structured */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8 min-h-[500px]">
          <h2 className="text-sm font-bold text-slate-500 mb-8 uppercase tracking-widest border-b border-slate-100 pb-2">Chronological History</h2>

          {complaints.length > 0 ? (
            <div className="space-y-0 relative">
              {/* Vertical Line */}
              <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-200"></div>

              {complaints.map((complaint, i) => (
                <div key={complaint.id} className="flex gap-6 relative group">
                  <div className="flex flex-col items-center relative z-10 pt-1">
                    <div className={`w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${complaint.status?.toLowerCase() === 'resolved' ? 'bg-emerald-600' :
                      complaint.status?.toLowerCase() === 'in_progress' ? 'bg-blue-600' :
                        'bg-amber-500'
                      }`}>
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex-1 pb-10">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 group-hover:border-blue-300 group-hover:bg-white transition-all duration-300 hover:shadow-md cursor-pointer" onClick={() => router.push(`/dashboard/citizen/complaints/${complaint.id}`)}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1e3a8a] transition-colors">{complaint.title}</h3>
                          <span className="text-xs text-slate-500 font-medium">Recorded ID: #{complaint.id}</span>
                        </div>
                        <StatusBadge status={complaint.status} />
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-3">{complaint.description}</p>
                      <div className="flex items-center gap-4 border-t border-slate-200 pt-3 mt-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Severity: {complaint.severity}/5</span>
                        <span className="text-xs font-bold text-[#1e3a8a] uppercase tracking-wide hover:underline">View Details &rarr;</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                <Calendar className="text-slate-300" size={32} />
              </div>
              <h3 className="text-slate-900 font-bold text-lg mb-1">No Activity Found</h3>
              <p className="text-slate-500 text-sm mb-6">Your submission history is empty.</p>
              <Link href="/report">
                <button className="px-6 py-2.5 bg-[#1e3a8a] text-white rounded-lg font-bold hover:bg-blue-900 transition shadow-sm uppercase text-xs tracking-wider">
                  Create First Report
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status?: string | null }) {
  const s = status?.toLowerCase() || 'pending';
  const styles = s === 'resolved' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
    s === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
      'bg-amber-100 text-amber-800 border-amber-200';

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles}`}>
      {s.replace('_', ' ')}
    </span>
  )
}