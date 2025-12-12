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
        {/* History Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Calendar className="text-purple-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Report History</h1>
                <p className="text-slate-600">Timeline of all your submitted reports</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline View */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Timeline View</h2>
          {complaints.length > 0 ? (
            <div className="space-y-6">
              {complaints.map((complaint, i) => (
                <div key={complaint.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${
                      complaint.status?.toLowerCase() === 'resolved' ? 'bg-emerald-500' :
                      complaint.status?.toLowerCase() === 'in_progress' ? 'bg-blue-500' :
                      'bg-orange-500'
                    }`} />
                    {i < complaints.length - 1 && <div className="w-0.5 h-16 bg-slate-200 mt-2" />}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-900">{complaint.title}</h3>
                      <StatusBadge status={complaint.status} />
                    </div>
                    <p className="text-slate-600 text-sm mb-2 line-clamp-2">{complaint.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Severity: {complaint.severity}/5</span>
                      <span>ID: #{complaint.id}</span>
                      <Link href={`/dashboard/citizen/complaints/${complaint.id}`} className="text-blue-600 hover:underline">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              <Calendar className="mx-auto mb-4 opacity-50" size={48} />
              <p className="text-lg font-medium">No history available</p>
              <p className="text-sm mt-1">Submit reports to build your history</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
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