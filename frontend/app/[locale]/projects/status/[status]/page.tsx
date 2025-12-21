"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, Search, MapPin, Calendar, DollarSign, Users, ArrowRight } from "lucide-react";
import { fetchProjectsByStatus, ProjectData } from "@/lib/api/api";

export default function ProjectStatusPage() {
  const params = useParams();
  const router = useRouter();
  const status = params.status as string;
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const statusDisplayName = status?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProjectsByStatus(status);
        setProjects(data);
      } catch (err: any) {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (status) {
      loadProjects();
    }
  }, [status]);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "in progress": return "bg-blue-100 text-blue-700 border-blue-200";
      case "planning": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-emerald-500";
    if (percentage >= 50) return "bg-blue-500";
    if (percentage >= 25) return "bg-yellow-500";
    return "bg-red-500";
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

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-bold text-lg mb-4">{error}</p>
          <Link href="/dashboard/admin/projects">
            <button className="px-4 py-2 bg-slate-200 rounded-lg font-bold text-slate-700 hover:bg-slate-300 transition">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/projects" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4">
            <ArrowLeft size={20} />
            Back to All Projects
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{statusDisplayName} Projects</h1>
              <p className="text-slate-600">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} with {statusDisplayName.toLowerCase()} status
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className="text-xs text-slate-500">#{project.id}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Progress Bar */}
                {typeof project.progressPercentage === 'number' && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">Progress</span>
                      <span className="text-slate-900 font-bold">{project.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${getProgressColor(project.progressPercentage)}`}
                        style={{ width: `${project.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <DollarSign size={16} className="text-emerald-600" />
                    <span className="font-semibold">₹{Number(project.budget).toLocaleString()}</span>
                  </div>

                  {project.contractor && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users size={16} className="text-blue-600" />
                      <span>{project.contractor.companyName}</span>
                    </div>
                  )}

                  {project.lat && project.lng && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin size={16} className="text-red-600" />
                      <span>{project.lat.toFixed(4)}, {project.lng.toFixed(4)}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar size={16} className="text-purple-600" />
                    <span>Updated {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/projects/${project.id}`} className="flex-1">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2">
                      View Details
                      <ArrowRight size={16} />
                    </button>
                  </Link>
                  {project.lat && project.lng && (
                    <Link href={`/map?projectId=${project.id}`}>
                      <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition">
                        <MapPin size={16} />
                      </button>
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="mx-auto mb-4 text-slate-400" size={48} />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No {statusDisplayName.toLowerCase()} projects found
            </h3>
            <p className="text-slate-600 mb-4">
              {searchTerm
                ? "Try adjusting your search criteria"
                : `There are currently no projects with ${statusDisplayName.toLowerCase()} status`
              }
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/projects">
                <button className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition">
                  View All Projects
                </button>
              </Link>
              <Link href="/projects/new">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                  Create New Project
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}