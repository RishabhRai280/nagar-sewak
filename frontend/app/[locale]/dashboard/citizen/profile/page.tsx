"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Token, fetchCurrentUserProfile, UserProfile } from "@/lib/api/api";
import { User, ClipboardList, CheckCircle, Star } from 'lucide-react';
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

export default function CitizenProfilePage() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading your profile...</p>
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
        {/* Profile Header - Gov Style */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8 mb-8 border-l-4 border-l-[#1e3a8a]">
          <div className="flex items-center justify-between mb-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#1e3a8a] rounded-lg flex items-center justify-center shadow-md">
                <User className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Citizen Profile</h1>
                <p className="text-sm font-medium text-slate-500">Manage your personal details and preferences</p>
              </div>
            </div>
            <Link href="/citizen/profile">
              <button className="px-5 py-2.5 bg-[#1e3a8a] text-white rounded-lg font-bold hover:bg-blue-900 transition shadow-sm uppercase text-xs tracking-wider">
                Edit Information
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information - 2 Cols */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8">
            <h2 className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-widest border-b border-slate-100 pb-2">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">Full Name</label>
                <p className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">{userData.fullName || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">Username</label>
                <p className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">@{userData.username}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">Email Address</label>
                <p className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">{userData.email}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">Phone Number</label>
                <p className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">{(userData as any).phone || 'Not provided'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">Residential Address</label>
                <p className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">{(userData as any).address || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Account Statistics - 1 Col */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8 flex flex-col gap-6">
            <h2 className="text-sm font-bold text-slate-500 mb-0 uppercase tracking-widest border-b border-slate-100 pb-2">Impact Summary</h2>

            <div className="p-5 bg-white rounded-lg border border-slate-200 border-l-4 border-l-blue-600 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-700 text-sm uppercase">Total Reports</h3>
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded">
                  <ClipboardList size={18} />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">{stats.total}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Submitted to date</p>
            </div>

            <div className="p-5 bg-white rounded-lg border border-slate-200 border-l-4 border-l-emerald-600 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-700 text-sm uppercase">Success Rate</h3>
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded">
                  <CheckCircle size={18} />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">
                {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">Resolution efficiency</p>
            </div>

            <div className="p-5 bg-white rounded-lg border border-slate-200 border-l-4 border-l-purple-600 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-700 text-sm uppercase">Badge Level</h3>
                <div className="p-1.5 bg-purple-50 text-purple-600 rounded">
                  <Star size={18} />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900">
                {stats.total >= 10 ? 'Gold' :
                  stats.total >= 5 ? 'Silver' :
                    stats.total >= 1 ? 'Bronze' : 'New'}
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">Community status</p>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}