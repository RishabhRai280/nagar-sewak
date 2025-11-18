// frontend/app/components/ContractorDashboard.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Token, fetchCurrentUserProfile, UserProfile } from "@/lib/api";
import { LayoutDashboard, AlertTriangle, Clock, Star, TrendingUp, CheckCircle, Construction, DollarSign, Eye } from 'lucide-react';
import Link from "next/link";

// Mock Data Interfaces (matching the expectation of a future backend API)
interface ContractorDashboardData extends UserProfile {
    assignedProjects: any[]; 
    relatedComplaints: any[]; 
    contractorDetails: {
      avgRating: number;
      totalRatings: number;
    } | null;
}

// Mock function for fetching contractor-specific data (Replace with real API call later)
const fetchContractorDashboard = async (): Promise<ContractorDashboardData> => {
    const profile = await fetchCurrentUserProfile();
    
    // Mocking specific contractor data for the demo
    return {
        ...profile,
        assignedProjects: [
            { id: 1, title: "Main Road Flyover Construction", status: "In Progress", budget: 150000000, contractorId: 1, lat: 19.1000, lng: 72.8800 },
            { id: 2, title: "Community Park Renovation", status: "Completed", budget: 5000000, contractorId: 1, lat: 19.0700, lng: 72.9000 },
        ],
        relatedComplaints: [
            { id: 3, title: "Graffiti in Community Park", status: "Resolved", severity: 1, description: "Graffiti was painted on the newly renovated park wall.", lat: 19.0705, lng: 72.9010 },
            { id: 4, title: "Water Line Leak - Sector 5", status: "Pending", severity: 4, description: "Major water leak reported near the intersection.", lat: 19.0900, lng: 72.8750 },
        ],
        contractorDetails: {
            avgRating: 2.0, // Seeded low value
            totalRatings: 1,
        }
    } as ContractorDashboardData;
};


export default function ContractorDashboardComponent() {
  const router = useRouter();
  const [data, setData] = useState<ContractorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Token.get()) {
      router.push("/login");
      return;
    }

    const load = async () => {
      try {
        const fetchedData = await fetchContractorDashboard();
        setData(fetchedData);
      } catch (err: any) {
        setError(err?.message || "Error loading dashboard");
        if (String(err.message).includes("Access Denied"))
          router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const kpis = useMemo(() => {
    const projects = data?.assignedProjects || [];
    const complaints = data?.relatedComplaints || [];
    const pendingProjects = projects.filter(p => p.status?.toLowerCase() === 'in progress').length;
    const completedProjects = projects.filter(p => p.status?.toLowerCase() === 'completed').length;
    const pendingComplaints = complaints.filter(c => c.status?.toLowerCase() !== 'resolved').length;

    return {
      pendingProjects,
      completedProjects,
      totalComplaints: complaints.length,
      pendingComplaints,
      avgRating: data?.contractorDetails?.avgRating || 0,
      isFlagged: (data?.contractorDetails?.avgRating || 5) <= 2.5
    };
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-slate-700 font-medium">Loading Contractor Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return <div className="p-20 text-center text-red-600">Error: {error || "Failed to load data."}</div>;
  }

  return (
    <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2">
          Contractor Portal
        </h1>
        <p className="text-slate-600">Welcome, {data.fullName || data.username} | {data.contractorDetails?.totalRatings} Citizen Reviews</p>
      </motion.div>

      {kpis.isFlagged && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 mb-8 bg-red-100 border border-red-300 rounded-xl flex items-center gap-4 shadow-md"
        >
          <AlertTriangle size={32} className="text-red-600 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-red-800">PERFORMANCE ALERT!</h3>
            <p className="text-red-700">Your average rating is below 2.5. Please address citizen feedback immediately to avoid being flagged.</p>
          </div>
        </motion.div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <KpiCard 
          label="Active Projects" 
          value={kpis.pendingProjects} 
          icon={Construction} 
          accent="from-blue-400 to-blue-600" 
          bgAccent="bg-blue-50"
        />
        <KpiCard 
          label="Pending Complaints" 
          value={kpis.pendingComplaints} 
          icon={AlertTriangle} 
          accent="from-orange-400 to-orange-600" 
          bgAccent="bg-orange-50"
        />
        <KpiCard 
          label="Completed Projects" 
          value={kpis.completedProjects} 
          icon={CheckCircle} 
          accent="from-emerald-400 to-emerald-600" 
          bgAccent="bg-emerald-50"
        />
        <KpiCard 
          label="Average Rating" 
          value={`${kpis.avgRating.toFixed(2)} ★`} 
          icon={Star} 
          accent="from-indigo-400 to-indigo-600" 
          bgAccent="bg-indigo-50"
        />
      </div>

      {/* Projects and Complaints Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Assigned Projects */}
        <section className="bg-white rounded-xl shadow-lg border border-slate-100 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Construction size={24} className="text-blue-600" /> Assigned Projects ({data.assignedProjects.length})
          </h2>
          <div className="space-y-4">
            {data.assignedProjects.map(p => (
              <ProjectItem key={p.id} project={p} />
            ))}
          </div>
        </section>

        {/* Related Complaints */}
        <section className="bg-white rounded-xl shadow-lg border border-slate-100 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <AlertTriangle size={24} className="text-orange-600" /> Linked Complaints ({data.relatedComplaints.length})
          </h2>
          <div className="space-y-4">
            {data.relatedComplaints.map(c => (
              <ComplaintItem key={c.id} complaint={c} />
            ))}
          </div>
        </section>
      </div>

    </main>
  );
}

// --- Helper Components (Reusable) ---

function KpiCard({ label, value, icon: Icon, accent, bgAccent }: { label: string; value: any; icon: any; accent: string; bgAccent: string; }) {
  return (
    <div className={`${bgAccent} rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition transform hover:scale-105`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-slate-600 font-medium text-sm">{label}</p>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${accent}`}>
          <Icon className="text-white" size={20} />
        </div>
      </div>
      <h3 className="text-4xl font-bold text-slate-900">{value}</h3>
    </div>
  );
}

function ProjectItem({ project }: { project: any }) {
  const statusClasses = project.status?.toLowerCase() === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700';
  return (
    <div className="p-4 border border-slate-200 rounded-lg shadow-sm hover:border-blue-400 transition">
      <div className="flex justify-between items-center mb-2">
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusClasses}`}>
          {project.status}
        </span>
        <span className="text-sm text-slate-500">Budget: ₹{project.budget.toLocaleString()}</span>
      </div>
      <h4 className="font-bold text-lg text-slate-900">{project.title}</h4>
      <div className="mt-3 flex gap-4 text-sm font-medium">
        <Link href={`/projects/${project.id}`} className="text-blue-600 hover:underline flex items-center gap-1">
          <Eye size={16} /> View Details
        </Link>
        {/* Placeholder for status update link/modal */}
        {project.status?.toLowerCase() !== 'completed' && (
          <button className="text-emerald-600 hover:underline">
            Update Status
          </button>
        )}
      </div>
    </div>
  );
}

function ComplaintItem({ complaint }: { complaint: any }) {
  const severityClasses = complaint.severity >= 4 ? 'text-red-600' : complaint.severity === 3 ? 'text-yellow-600' : 'text-emerald-600';
  const statusClasses = complaint.status?.toLowerCase() === 'resolved' ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white';

  return (
    <div className="p-4 border border-slate-200 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-bold text-md text-slate-900 line-clamp-1">{complaint.title}</h4>
        <span className={`px-2 py-0.5 text-xs font-semibold rounded ${statusClasses}`}>
          {complaint.status}
        </span>
      </div>
      <p className="text-sm text-slate-600 line-clamp-2">{complaint.description}</p>
      <div className="mt-2 text-xs font-medium text-slate-500">
        Severity: <span className={severityClasses}>{complaint.severity}/5</span>
      </div>
    </div>
  );
}