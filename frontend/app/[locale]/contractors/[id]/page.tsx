"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Token, fetchContractorProfile, ContractorProfile } from "@/lib/api";
import { ArrowLeft, Building2, Award, Star, CheckCircle, Clock, AlertCircle, TrendingUp, FileText } from "lucide-react";
import Link from "next/link";

export default function ContractorProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [contractor, setContractor] = useState<ContractorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Token.get()) {
      router.push("/login");
      return;
    }

    const loadContractor = async () => {
      try {
        const data = await fetchContractorProfile(Number(id));
        setContractor(data);
      } catch (err: any) {
        setError(err.message || "Failed to load contractor profile");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadContractor();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600 font-medium">Loading contractor profile...</div>
      </div>
    );
  }

  if (error || !contractor) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
          <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error</h2>
          <p className="text-slate-600 mb-6">{error || "Contractor not found"}</p>
          <Link href="/dashboard/admin">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Contractor profile is now flat, no need to destructure

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-200 rounded-full blur-[120px] opacity-40"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-24 lg:pt-28">
        {/* Back Button */}
        <Link href="/dashboard/admin">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mb-6 flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-md rounded-xl text-slate-700 font-bold hover:bg-white transition shadow-sm text-sm"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </motion.button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/60"
            >
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg">
                  {contractor.companyName.charAt(0)}
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 mb-1">{contractor.companyName}</h1>
                <p className="text-sm text-slate-500">License: {contractor.licenseNo}</p>
                {contractor.contactEmail && (
                  <p className="text-xs text-slate-500 mt-1">{contractor.contactEmail}</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-600 flex items-center gap-2">
                    <Star size={16} className="text-yellow-500" /> Average Rating
                  </span>
                  <span className="text-lg font-bold text-slate-900 flex items-center gap-1">
                    {contractor.avgRating.toFixed(1)} <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-600 flex items-center gap-2">
                    <Award size={16} className="text-blue-500" /> Total Ratings
                  </span>
                  <span className="text-lg font-bold text-slate-900">{contractor.totalRatings}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                  <span className="text-sm text-emerald-600 flex items-center gap-2">
                    <CheckCircle size={16} /> Completed Projects
                  </span>
                  <span className="text-lg font-bold text-slate-900">{contractor.completedProjects}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <span className="text-sm text-blue-600 flex items-center gap-2">
                    <FileText size={16} /> Total Projects
                  </span>
                  <span className="text-lg font-bold text-slate-900">{contractor.totalProjects}</span>
                </div>
              </div>
            </motion.div>

            {/* Performance Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/60"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-500" />
                Performance Summary
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-600 font-bold uppercase mb-1">Active Projects</p>
                  <p className="text-2xl font-extrabold text-slate-900">{contractor.totalProjects - contractor.completedProjects}</p>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-xs text-emerald-600 font-bold uppercase mb-1">Completed</p>
                  <p className="text-2xl font-extrabold text-slate-900">{contractor.completedProjects}</p>
                </div>

                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <p className="text-xs text-purple-600 font-bold uppercase mb-1">Success Rate</p>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {contractor.totalProjects > 0 ? ((contractor.completedProjects / contractor.totalProjects) * 100).toFixed(0) : 0}%
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Projects & Ratings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/60"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-blue-500" />
                Projects ({contractor.projects.length})
              </h3>

              {contractor.projects.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No projects found</p>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                  {contractor.projects.map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-slate-900 hover:text-blue-600 transition">{project.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            project.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                            project.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                            "bg-orange-100 text-orange-700"
                          }`}>
                            {project.status}
                        </span>
                      </div>
                        <p className="text-sm text-slate-600 line-clamp-2 mb-2">{project.description}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Award size={14} /> ₹{project.budget.toLocaleString()}
                          </span>
                          {project.completedAt && (
                            <span className="flex items-center gap-1">
                              <Clock size={14} /> {new Date(project.completedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
