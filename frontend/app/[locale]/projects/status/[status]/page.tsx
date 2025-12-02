"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Token, fetchProjectsByStatus, ProjectData } from "@/lib/api";
import { ArrowLeft, Building2, DollarSign, MapPin, Clock, User, AlertCircle, CheckCircle, FileText } from "lucide-react";
import Link from "next/link";

const statusConfig = {
  "in-progress": {
    title: "In Progress Projects",
    description: "Projects currently being worked on",
    color: "blue",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200"
  },
  "completed": {
    title: "Completed Projects",
    description: "Successfully finished projects",
    color: "emerald",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200"
  },
  "pending": {
    title: "Pending Projects",
    description: "Projects waiting to be started",
    color: "orange",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    borderColor: "border-orange-200"
  },
  "issues": {
    title: "Projects with Issues",
    description: "Projects requiring attention",
    color: "red",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200"
  }
};

export default function ProjectStatusPage() {
  const router = useRouter();
  const params = useParams();
  const status = params?.status as string;

  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const config = statusConfig[status as keyof typeof statusConfig];

  useEffect(() => {
    if (!Token.get()) {
      router.push("/login");
      return;
    }

    if (!config) {
      setError("Invalid project status");
      setLoading(false);
      return;
    }

    const loadProjects = async () => {
      try {
        const data = await fetchProjectsByStatus(status);
        setProjects(data);
      } catch (err: any) {
        setError(err.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [status, router, config]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600 font-medium">Loading projects...</div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
          <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error</h2>
          <p className="text-slate-600 mb-6">{error || "Invalid project status"}</p>
          <Link href="/dashboard/admin">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

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

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2">
            {config.title}
          </h1>
          <p className="text-slate-600">{config.description}</p>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 shadow-xl border border-white/60 text-center"
          >
            <Building2 className="mx-auto text-slate-400 mb-4" size={64} />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Projects Found</h3>
            <p className="text-slate-600">No projects match the selected status criteria.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/60 hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
                    {project.status}
                  </span>
                  {project.contractor && (
                    <div className="flex items-center gap-1 text-xs text-slate-600">
                      <User size={12} />
                      Assigned
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{project.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-3">
                    {project.description}
                  </p>
                </div>

                {/* Project Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 flex items-center gap-1">
                      <DollarSign size={14} /> Budget
                    </span>
                    <span className="font-bold text-slate-900">₹{project.budget.toLocaleString()}</span>
                  </div>

                  {project.contractor && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 flex items-center gap-1">
                        <User size={14} /> Contractor
                      </span>
                      <span className="font-bold text-slate-900 truncate ml-2">{project.contractor.companyName}</span>
                    </div>
                  )}

                  {project.lat && project.lng && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 flex items-center gap-1">
                        <MapPin size={14} /> Location
                      </span>
                      <span className="font-mono text-xs text-slate-900">
                        {project.lat.toFixed(4)}, {project.lng.toFixed(4)}
                      </span>
                    </div>
                  )}

                  {project.updatedAt && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 flex items-center gap-1">
                        <Clock size={14} /> Updated
                      </span>
                      <span className="text-slate-900">{new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <Link href={`/projects/${project.id}`}>
                  <button className="w-full py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                    <FileText size={18} />
                    View Details
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
