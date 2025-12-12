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
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <User className="text-orange-600" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
                <p className="text-slate-600">Manage your account information</p>
              </div>
            </div>
            <Link href="/citizen/profile">
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition">
                Edit Profile
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600">Full Name</label>
                <p className="text-lg font-semibold text-slate-900">{userData.fullName || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Username</label>
                <p className="text-lg font-semibold text-slate-900">{userData.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Email</label>
                <p className="text-lg font-semibold text-slate-900">{userData.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Phone</label>
                <p className="text-lg font-semibold text-slate-900">{(userData as any).phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Address</label>
                <p className="text-lg font-semibold text-slate-900">{(userData as any).address || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 lg:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Account Statistics</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <ClipboardList className="text-blue-600" size={20} />
                  <h3 className="font-semibold text-slate-900">Total Reports</h3>
                </div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-sm text-slate-600">Submitted to date</p>
              </div>
              
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="text-emerald-600" size={20} />
                  <h3 className="font-semibold text-slate-900">Success Rate</h3>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                </p>
                <p className="text-sm text-slate-600">Reports resolved</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="text-purple-600" size={20} />
                  <h3 className="font-semibold text-slate-900">Citizen Level</h3>
                </div>
                <p className="text-lg font-bold text-slate-900">
                  {stats.total >= 10 ? 'Gold' : 
                   stats.total >= 5 ? 'Silver' : 
                   stats.total >= 1 ? 'Bronze' : 'New'}
                </p>
                <p className="text-sm text-slate-600">Based on contributions</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}