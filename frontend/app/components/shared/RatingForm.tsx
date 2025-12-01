// frontend/app/components/RatingForm.tsx

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchProjectById, ProjectData, submitRating, Token } from '@/lib/api/api';
import { motion } from "framer-motion";
import { Star, Loader, AlertCircle, CheckCircle } from 'lucide-react';

interface RatingFormProps {
    projectId: number;
}

export default function RatingForm({ projectId }: RatingFormProps) {
    const router = useRouter();
    const [score, setScore] = useState(5);
    const [comment, setComment] = useState('');
    const [project, setProject] = useState<ProjectData | null>(null);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [loadingProject, setLoadingProject] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    // 1. New dedicated error state
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        if (!Token.get()) {
            router.push('/login');
            return;
        }

        if (!projectId || Number.isNaN(projectId)) {
            setStatusMessage({ type: 'error', text: 'Invalid project selected.' });
            setLoadingProject(false);
            return;
        }

        const loadProject = async () => {
            setFetchError(null); // Reset error
            try {
                const fetchedProject = await fetchProjectById(projectId);
                setProject(fetchedProject);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Unable to load the selected project.';
                setFetchError(message); // Set fetch error
            } finally {
                setLoadingProject(false);
            }
        };

        loadProject();
    }, [projectId, router]);

    const heading = useMemo(() => {
        if (project) {
            return `Rate Project: ${project.title}`;
        }
        if (loadingProject) {
            return 'Loading project...';
        }
        return 'Project not found';
    }, [project, loadingProject]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatusMessage(null);

        if (!project) {
            setStatusMessage({ type: 'error', text: 'No project loaded.' });
            return;
        }

        setSubmitting(true);
        try {
            const result = await submitRating({
                projectId: project.id,
                score,
                comment,
            });

            // Use success message and redirect
            setStatusMessage({ type: 'success', text: result || 'Rating submitted successfully!' });
            // Redirect slightly faster after submission
            setTimeout(() => router.push('/dashboard/citizen'), 1500); 
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to submit rating.';
            setStatusMessage({ type: 'error', text: message });
        } finally {
            setSubmitting(false);
        }
    };

    const percentage = ((score - 1) / 4) * 100;

    // 2. Use fetchError for the loading state block
    if (loadingProject && !fetchError) {
        return (
            <div className="w-full max-w-lg bg-white p-10 rounded-2xl shadow-xl text-center border border-slate-100">
                <Loader className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-slate-800">Loading project details...</h2>
            </div>
        );
    }

    // 3. Use fetchError for the dedicated error block
    if (fetchError && !project) {
        return (
            <div className="w-full max-w-lg bg-white p-10 rounded-2xl shadow-xl text-center border border-red-200 bg-red-50">
                <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-red-700">Error Loading Project</h2>
                <p className="text-red-600 text-sm mt-2">{fetchError}</p>
            </div>
        );
    }
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-2xl border border-slate-100"
        >
            <h2 className="text-3xl font-bold text-center text-slate-900 mb-3">
                {heading}
            </h2>
            {project && (
                <p className="text-center text-slate-600 mb-6 border-b border-slate-100 pb-4">
                    <span className="font-medium text-slate-800">Status: {project.status}</span> • <span className="text-sm">Budget: ₹{project.budget !== undefined ? project.budget.toLocaleString() : 'N/A'}</span>
                </p>
            )}

            {statusMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
                        statusMessage.type === 'success' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-red-100 text-red-700 border border-red-300'
                    }`}
                >
                    {statusMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span className="text-sm font-medium">{statusMessage.text}</span>
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="score" className="block text-lg font-semibold text-slate-900 mb-4 text-center">
                        Your Rating: 
                        <span className="ml-3 text-3xl font-extrabold text-amber-500 flex items-center justify-center gap-1">
                            {score} <Star size={24} fill="currentColor" />
                        </span>
                    </label>
                    
                    <input
                        id="score"
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={score}
                        onChange={(e) => setScore(parseInt(e.target.value))}
                        required
                        disabled={submitting || loadingProject || !project}
                        className="mt-1 block w-full h-3 appearance-none rounded-lg focus:outline-none custom-range-slider"
                        // Custom style for the gradient fill of the range input track
                        style={{
                            background: `linear-gradient(to right, #2563eb 0%, #2563eb ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`,
                        }}
                    />
                    <div className="flex justify-between text-sm text-slate-500 mt-2">
                        <span className="font-medium">1 Star (Poor)</span>
                        <span className="font-medium">5 Stars (Excellent)</span>
                    </div>
                </div>

                <div>
                    <label htmlFor="comment" className="block text-sm font-semibold text-slate-900 mb-2">
                        Comments (Optional)
                    </label>
                    <textarea
                        id="comment"
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        disabled={submitting || loadingProject || !project}
                        placeholder="Share your feedback on the quality, timeliness, or transparency of the project..."
                        className="mt-1 block w-full px-4 py-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none disabled:opacity-50"
                    />
                </div>

                <motion.button
                    type="submit"
                    disabled={submitting || loadingProject || !project}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex justify-center py-3 px-4 rounded-lg shadow-lg text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? (
                        <div className='flex items-center gap-2'>
                             <Loader className="animate-spin" size={20} /> Submitting...
                        </div>
                    ) : (
                        'Submit Rating'
                    )}
                </motion.button>
            </form>
        </motion.div>
    );
}