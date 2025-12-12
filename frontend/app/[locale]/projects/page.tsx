"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart3, Plus, Search, Filter, MapPin, Calendar, DollarSign, Users, ArrowRight } from "lucide-react";
import { fetchAllProjects } from "@/lib/api/api";

interface Project {
  id: number;
  title: string;
  description: string;
  budget: number;
  status: string;
  lat?: number;
  lng?: number;
  contractorId?: number;
  contractor?: {
    id: number;
    companyName: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetchAllProjects({
          search: searchTerm || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          page: 1,
          limit: 50
        });
        setProjects(response.projects);
      } catch (error) {
        console.error("Failed to load projects:", error);
        // Fallback to empty array on error
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [searchTerm, statusFilter]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "in progress": return "bg-blue-100 text-blue-700 border-blue-200";
      case "planning": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 space-y-4">
                  <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e3a8a] via-[#f97316] to-[#166534]"></div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center shadow-sm">
                <BarChart3 className="text-[#1e3a8a]" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">All Projects</h1>
                <p className="text-slate-600 font-medium">Monitor and manage all ongoing development initiatives</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="relative flex-1 sm:min-w-[280px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] text-slate-900"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] bg-white text-slate-700 font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="planning">Planning</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <Link href="/projects/new">
                <button className="w-full sm:w-auto px-6 py-2.5 bg-[#1e3a8a] text-white rounded-lg font-bold hover:bg-blue-800 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                  <Plus size={20} />
                  New Project
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md border border-slate-200 p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#1e3a8a] to-[#f97316] opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex items-start justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <span className="text-xs text-slate-500 font-mono">#{project.id}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#1e3a8a] transition-colors">
                {project.title}
              </h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <DollarSign size={16} className="text-[#166534]" />
                  <span className="font-semibold text-slate-800">₹{project.budget.toLocaleString()}</span>
                </div>

                {project.contractor && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users size={16} className="text-[#1e3a8a]" />
                    <span>{project.contractor.companyName}</span>
                  </div>
                )}

                {project.lat && project.lng && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin size={16} className="text-[#f97316]" />
                    <span>{project.lat.toFixed(4)}, {project.lng.toFixed(4)}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar size={16} className="text-slate-400" />
                  <span>Updated {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/projects/${project.id}`} className="flex-1">
                  <button className="w-full px-4 py-2 bg-[#f8fafc] text-[#1e3a8a] border border-blue-100 rounded-lg font-bold hover:bg-[#1e3a8a] hover:text-white transition flex items-center justify-center gap-2">
                    View Details
                    <ArrowRight size={16} />
                  </button>
                </Link>
                {project.lat && project.lng && (
                  <Link href={`/map?projectId=${project.id}`}>
                    <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg font-medium hover:bg-[#f97316] hover:text-white transition">
                      <MapPin size={16} />
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="mx-auto mb-4 text-slate-400" size={48} />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects found</h3>
            <p className="text-slate-600 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first project"
              }
            </p>
            <Link href="/projects/new">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                Create New Project
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}