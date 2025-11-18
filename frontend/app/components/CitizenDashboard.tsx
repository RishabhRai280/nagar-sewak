"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import Sidebar from "./Sidebar";
import Link from "next/link";
import { Token, fetchCurrentUserProfile, UserProfile } from "@/lib/api";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Clock, Plus, Eye } from 'lucide-react';

// Define an interface to ensure TypeScript recognizes the fields used in this component,
// which are likely missing from the original 'ComplaintData' type from '@/lib/api'.
interface DashboardComplaint {
  id: number;
  title: string;
  description?: string | null;
  severity: number;
  status?: string | null;
  photoUrl?: string | null; // Added to fix Property 'photoUrl' does not exist error
  rating?: number | null;   // Added to fix Property 'rating' does not exist error
  // Assuming other required fields are present in the underlying data
}

export default function CitizenDashboardComponent() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Token.get()) {
      // NOTE: Replacing alert() with push redirect as per instructions
      router.push("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const profile = await fetchCurrentUserProfile();
        setUserData(profile);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Unable to load your profile.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  // Type assertion here to satisfy the compiler for accessing photoUrl/rating later
  const complaints: DashboardComplaint[] = (userData?.complaints ?? []) as DashboardComplaint[];

  const stats = useMemo(() => {
    // Now using the correctly typed complaints array
    const pending = complaints.filter(
      (c) => c.status?.toLowerCase() === "pending"
    ).length;
    return {
      total: complaints.length,
      pending,
      resolved: complaints.length - pending,
    };
  }, [complaints]); // Dependency changed to use the typed array

  // --- Loading State UI ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-lg text-slate-700 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // --- Error State UI ---
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center p-10 rounded-xl shadow-xl bg-white border border-red-200">
          <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
          <p className="text-xl text-red-700 font-medium">Dashboard Error</p>
          <p className="text-sm text-red-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Sidebar - Note: The imported Sidebar component needs to be updated next for theme consistency */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12">
        {/* Header */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{userData.fullName || userData.username}</span>
            </h1>
            <p className="text-slate-600">Manage your complaints and track progress</p>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-600 font-medium">Total Complaints</h3>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-blue-600" size={20} />
              </div>
            </div>
            <p className="text-4xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-xs text-slate-500 mt-2">All-time submissions</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-600 font-medium">Pending</h3>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="text-orange-600" size={20} />
              </div>
            </div>
            <p className="text-4xl font-bold text-orange-600">{stats.pending}</p>
            <p className="text-xs text-slate-500 mt-2">Awaiting resolution</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-600 font-medium">Resolved</h3>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-emerald-600" size={20} />
              </div>
            </div>
            <p className="text-4xl font-bold text-emerald-600">{stats.resolved}</p>
            <p className="text-xs text-slate-500 mt-2">Successfully completed</p>
          </motion.div>
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <Link href="/report">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105">
              <Plus size={20} />
              Submit New Complaint
            </button>
          </Link>
        </motion.div>

        {/* Complaints List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-slate-100 p-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Complaint History</h2>

          {complaints.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="text-slate-300 mx-auto mb-4" size={48} />
              <p className="text-slate-600 text-lg">No complaints yet</p>
              <p className="text-slate-500 mt-2">Start by submitting your first complaint to help improve your community</p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <motion.div
                  key={complaint.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border border-slate-200 rounded-lg p-5 hover:border-blue-300 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start gap-6">
                    <div className="flex gap-4 flex-1">
                      {/* Placeholder Image URL handling */}
                      {complaint.photoUrl && (
                        <img
                          src={`http://localhost:8080/uploads/${complaint.photoUrl}`}
                          className="w-24 h-24 rounded-lg object-cover border border-slate-200"
                          alt="complaint proof"
                          // Fallback handling if image fails to load
                          onError={(e) => {
                            (e.target as HTMLImageElement).onerror = null; 
                            (e.target as HTMLImageElement).src = `https://placehold.co/96x96/e2e8f0/64748b?text=No+Image`; 
                          }}
                        />
                      )}

                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-lg mb-1">
                          {complaint.title}
                        </h3>
                        <p className="text-sm text-slate-500 mb-2">
                          Severity: <span className="font-semibold text-slate-700">{complaint.severity}/5</span>
                        </p>
                        {complaint.description && (
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {complaint.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <span
                      className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0 ${
                        complaint.status?.toLowerCase() === "resolved"
                          ? "bg-emerald-100 text-emerald-700"
                          : complaint.status?.toLowerCase() === "in_progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {complaint.status}
                    </span>
                  </div>

                  <div className="flex gap-6 mt-4 text-sm font-semibold">
                    <Link
                      href={`/dashboard/citizen/complaints/${complaint.id}`}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
                    >
                      <Eye size={16} />
                      View Details
                    </Link>

                    {complaint.status?.toLowerCase() === "resolved" &&
                      !complaint.rating && (
                        <Link
                          href={`/rate/${complaint.id}`}
                          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition"
                        >
                          <CheckCircle size={16} />
                          Rate Work
                        </Link>
                      )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}