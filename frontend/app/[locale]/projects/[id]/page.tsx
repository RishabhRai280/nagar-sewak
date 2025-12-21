"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchProjectById, ProjectDetail, Token, UserStore } from "@/lib/api";
import { Construction, DollarSign, ArrowLeft, Clock, AlertTriangle, Plus } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ProjectProgressTimeline from "@/app/components/projects/ProjectProgressTimeline";
import ProjectProgressUpdateModal from "@/app/components/projects/ProjectProgressUpdateModal";
import ShareBar from "@/app/components/shared/ShareBar";

// Dynamically import Map component to avoid SSR issues
// Dynamically import Map component to avoid SSR issues
const MiniMap = dynamic(() => import("@/app/components/shared/MiniMap"), { ssr: false });

export default function ProjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<ProjectDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [showProgressModal, setShowProgressModal] = useState(false);
    const [timelineKey, setTimelineKey] = useState(0);

    useEffect(() => {
        const user = UserStore.get();
        if (user) {
            if (user.roles.includes("CONTRACTOR")) setUserRole("CONTRACTOR");
            else if (user.roles.includes("ADMIN") || user.roles.includes("SUPER_ADMIN")) setUserRole("ADMIN");
            else setUserRole("CITIZEN");
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

    const handleProgressUpdate = async (data: {
        progress: number;
        status: string;
        notes: string;
        photos: File[];
    }) => {
        if (!project) return;

        const formData = new FormData();
        formData.append('progress', data.progress.toString());
        formData.append('status', data.status);
        formData.append('notes', data.notes);
        
        data.photos.forEach((photo) => {
            formData.append('photos', photo);
        });

        try {
            const response = await fetch(`http://localhost:8080/projects/${project.id}/progress`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Token.get()}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to update progress');
            }

            const updatedProject = await response.json();
            setProject(updatedProject);
            setTimelineKey(prev => prev + 1); // Force timeline refresh
            alert("Project progress updated successfully!");
        } catch (error) {
            console.error('Error updating progress:', error);
            throw error;
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
                    Back to previous
                </Link>
            </div>
        );
    }

    const statusColors = {
        "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
        "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
        "Completed": "bg-emerald-100 text-emerald-800 border-emerald-200",
    }[project.status] || "bg-slate-100 text-slate-800 border-slate-200";

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pt-28">
                {/* Project Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-full transition text-[#1e3a8a] shadow-sm border border-slate-200">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 truncate max-w-2xl">{project.title}</h1>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${statusColors}`}>
                            {project.status}
                        </span>
                    </div>
                    <div className="flex items-center justify-end">
                        <ShareBar title={project.title} summary={project.description} />
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Overview Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#1e3a8a] to-[#f97316]"></div>
                            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Construction className="text-[#1e3a8a]" size={20} /> Project Overview
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {project.description}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-100">
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase mb-1">Budget</p>
                                    <p className="text-2xl font-extrabold text-slate-900 flex items-center gap-1">
                                        <DollarSign size={20} className="text-[#166534]" />
                                        {project.budget.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase mb-1">Timeline</p>
                                    <p className="text-2xl font-extrabold text-slate-900 flex items-center gap-1">
                                        <Clock size={20} className="text-[#f97316]" />
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
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#166534]"></div>
                                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    📊 Project Progress
                                </h2>

                                {/* Progress Bar */}
                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-bold text-slate-700">Completion</span>
                                        <span className="font-bold text-[#1e3a8a]">{project.progressPercentage}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#f97316] to-[#166534] rounded-full transition-all duration-500"
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
                                    <ProjectProgressTimeline key={timelineKey} projectId={project.id} />
                                </div>
                            </div>
                        )}

                        {/* 360 removed per request */}

                        {/* Actions for Contractor */}
                        {userRole === "CONTRACTOR" && project.status !== "Completed" && (
                            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
                                <h3 className="text-lg font-bold text-blue-900 mb-2">Contractor Actions</h3>
                                <p className="text-blue-700 mb-4">Update the progress and status of this project as work progresses.</p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowProgressModal(true)}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex items-center gap-2"
                                    >
                                        <Plus size={18} />
                                        Update Progress
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Location Map */}
                        <div
                            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-80 relative group cursor-pointer"
                            onClick={() => router.push(`/map?lat=${project.lat}&lng=${project.lng}&zoom=16`)}
                            style={{ zIndex: 1 }}
                        >
                            <MiniMap lat={project.lat} lng={project.lng} />

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors z-[10] flex items-center justify-center">
                                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm font-bold text-slate-700 text-sm transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all">
                                    Click to View on Main Map
                                </div>
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

            {/* Progress Update Modal */}
            <ProjectProgressUpdateModal
                isOpen={showProgressModal}
                onClose={() => setShowProgressModal(false)}
                onUpdate={handleProgressUpdate}
                currentProgress={project?.progressPercentage || 0}
                currentStatus={project?.status || "Pending"}
            />
        </div>
    );
}
