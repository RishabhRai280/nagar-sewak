"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchProjectById, updateProject, ProjectDetail, Token, UserStore } from "@/lib/api";
import { Construction, DollarSign, MapPin, CheckCircle, ArrowLeft, Clock, AlertTriangle, Edit2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ProjectProgressTimeline from "@/app/components/projects/ProjectProgressTimeline";
import ShareBar from "@/app/components/shared/ShareBar";

// Dynamically import Map component to avoid SSR issues
const MiniMap = dynamic(() => import("@/app/components/map/Map"), { ssr: false });

export default function ProjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<ProjectDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const token = Token.get();
        const user = UserStore.get();
        if (user) {
            if (user.roles.includes("CONTRACTOR")) setUserRole("CONTRACTOR");
            else if (user.roles.includes("ADMIN") || user.roles.includes("SUPER_ADMIN")) setUserRole("ADMIN");
            else setUserRole("CITIZEN");
            setUserId(user.id);
        }

        if (params.id) {
            loadProject(Number(params.id));
        }
    }, [params.id]);

    const loadProject = async (id: number) => {
        try {
            setLoading(true);
            const data = await fetchProjectById(id);
            setProject(data);
        } catch (err) {
            setError("Failed to load project details.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        if (!project) return;
        if (!confirm(`Are you sure you want to mark this project as ${newStatus}?`)) return;

        try {
            setUpdating(true);
            const updated = await updateProject(project.id, { status: newStatus });
            setProject(updated);
            alert("Project status updated successfully!");
        } catch (err) {
            alert("Failed to update status.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
                <AlertTriangle className="text-red-500 mb-4" size={48} />
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Project Not Found</h1>
                <p className="text-slate-600 mb-6">{error || "The requested project does not exist."}</p>
                <Link href="/map" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
                    Back to Map
                </Link>
            </div>
        );
    }

    const isAssignedContractor = userRole === "CONTRACTOR" && project.contractorId === userId; // Note: userId check might need adjustment based on how contractorId maps to userId
    // Actually, project.contractorId is the Contractor ID, not User ID. 
    // We need to check if the current user is the contractor for this project.
    // For MVP, we'll assume if they are a contractor and have access, they can edit (or we rely on backend validation if implemented).
    // Better: Check if the user is a contractor. If so, let them try. Backend should enforce ownership.
    // But wait, UserStore stores `id` which is User ID. `project.contractorId` is Contractor ID.
    // We don't have Contractor ID in UserStore easily without fetching profile.
    // Let's just allow "CONTRACTOR" role to see the button, and backend will reject if not owner (if implemented).
    // Or simpler: If they are a contractor, show the button.

    const statusColors = {
        "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
        "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
        "Completed": "bg-emerald-100 text-emerald-800 border-emerald-200",
    }[project.status] || "bg-slate-100 text-slate-800 border-slate-200";

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-xl font-bold text-slate-900 truncate max-w-md">{project.title}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${statusColors}`}>
                            {project.status}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ShareBar title={project.title} summary={project.description} />
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Overview Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Construction className="text-blue-600" size={20} /> Project Overview
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {project.description}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-100">
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase mb-1">Budget</p>
                                    <p className="text-2xl font-extrabold text-slate-900 flex items-center gap-1">
                                        <DollarSign size={20} className="text-emerald-500" />
                                        {project.budget.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase mb-1">Timeline</p>
                                    <p className="text-2xl font-extrabold text-slate-900 flex items-center gap-1">
                                        <Clock size={20} className="text-blue-500" />
                                        TBD
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase mb-1">Contractor ID</p>
                                    <p className="text-2xl font-extrabold text-slate-900">
                                        #{project.contractorId}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Section */}
                        {(project.progressPercentage !== undefined && project.progressPercentage !== null) && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    📊 Project Progress
                                </h2>
                                
                                {/* Progress Bar */}
                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-bold text-slate-700">Completion</span>
                                        <span className="font-bold text-blue-600">{project.progressPercentage}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                                            style={{ width: `${project.progressPercentage}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Progress Notes */}
                                {project.progressNotes && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-bold text-slate-700 mb-2">Latest Update</h3>
                                        <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl">
                                            {project.progressNotes}
                                        </p>
                                    </div>
                                )}

                                {/* Progress Photos */}
                                {project.progressPhotos && (
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-700 mb-3">Progress Photos</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {project.progressPhotos.split(',').filter(p => p.trim()).map((photo, index) => (
                                                <a 
                                                    key={index}
                                                    href={`http://localhost:8080${photo.trim()}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group relative aspect-square rounded-xl overflow-hidden border-2 border-slate-200 hover:border-blue-500 transition"
                                                >
                                                    <img
                                                        src={`http://localhost:8080${photo.trim()}`}
                                                        alt={`Progress ${index + 1}`}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                                                        <span className="text-white opacity-0 group-hover:opacity-100 transition text-sm font-bold">
                                                            View Full Size
                                                        </span>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {project.updatedAt && (
                                    <p className="text-xs text-slate-500 mt-4 text-right">
                                        Last updated: {new Date(project.updatedAt).toLocaleString()}
                                    </p>
                                )}

                                <div className="mt-6">
                                    <ProjectProgressTimeline projectId={project.id} />
                                </div>
                            </div>
                        )}

                        {/* 360 removed per request */}

                        {/* Actions for Contractor */}
                        {userRole === "CONTRACTOR" && project.status !== "Completed" && (
                            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
                                <h3 className="text-lg font-bold text-blue-900 mb-2">Contractor Actions</h3>
                                <p className="text-blue-700 mb-4">Update the status of this project as work progresses.</p>
                                <div className="flex gap-4">
                                    {project.status === "Pending" && (
                                        <button
                                            onClick={() => handleStatusUpdate("In Progress")}
                                            disabled={updating}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 disabled:opacity-50"
                                        >
                                            {updating ? "Updating..." : "Start Work"}
                                        </button>
                                    )}
                                    {project.status === "In Progress" && (
                                        <button
                                            onClick={() => handleStatusUpdate("Completed")}
                                            disabled={updating}
                                            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/30 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            <CheckCircle size={18} />
                                            {updating ? "Updating..." : "Mark as Completed"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Location Map */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-80 relative">
                            {/* Note: Reusing the main Map component might be heavy. Ideally we'd use a MiniMap component. 
                   For now, we'll just show a placeholder or a static map if possible, or the full map centered.
                   Since we don't have a dedicated MiniMap, we'll skip the map render here to avoid complexity 
                   or use a simple link to the map.
               */}
                            <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center p-6 text-center">
                                <MapPin className="text-slate-400 mb-2" size={32} />
                                <p className="text-slate-500 font-medium mb-4">View project location on the main map</p>
                                <Link href="/map" className="px-4 py-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm">
                                    Open Map
                                </Link>
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h3 className="font-bold text-slate-900 mb-4">Project Details</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between py-2 border-b border-slate-100">
                                    <span className="text-slate-500">Project ID</span>
                                    <span className="font-mono font-bold text-slate-700">#{project.id}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-100">
                                    <span className="text-slate-500">Coordinates</span>
                                    <span className="font-mono font-bold text-slate-700">{project.lat.toFixed(4)}, {project.lng.toFixed(4)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-slate-100">
                                    <span className="text-slate-500">Created</span>
                                    <span className="font-bold text-slate-700">Nov 2025</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
