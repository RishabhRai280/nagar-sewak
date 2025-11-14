// frontend/app/components/RatingForm.tsx

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchProjectById, ProjectData, submitRating, Token } from '@/lib/api';

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

    useEffect(() => {
        if (!Token.get()) {
            alert('Please log in to rate a project.');
            router.push('/login');
            return;
        }

        if (!projectId || Number.isNaN(projectId)) {
            setStatusMessage({ type: 'error', text: 'Invalid project selected.' });
            setLoadingProject(false);
            return;
        }

        const loadProject = async () => {
            try {
                const fetchedProject = await fetchProjectById(projectId);
                setProject(fetchedProject);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Unable to load the selected project.';
                setStatusMessage({ type: 'error', text: message });
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

            setStatusMessage({ type: 'success', text: result });
            setTimeout(() => router.push('/map'), 2000);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to submit rating.';
            setStatusMessage({ type: 'error', text: message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-2xl">
            <h2 className="text-3xl font-bold text-center text-purple-700 mb-3">
                {heading}
            </h2>
            {project && (
                <p className="text-center text-gray-600 mb-6">
                    Status: {project.status} • Budget: ₹{project.budget !== undefined ? project.budget.toLocaleString() : 'N/A'}
                </p>
            )}

            {statusMessage && (
                <div
                    className={`p-4 rounded mb-4 ${
                        statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                >
                    {statusMessage.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="score" className="block text-xl font-medium text-gray-700 mb-2">
                        Score: {score} Stars
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
                        disabled={submitting || loadingProject}
                        className="mt-1 block w-full h-8 appearance-none bg-gray-200 rounded-lg focus:outline-none"
                        style={{
                            background: `linear-gradient(to right, #4F46E5 0%, #4F46E5 ${((score - 1) / 4) * 100}%, #E5E7EB ${((score - 1) / 4) * 100}%, #E5E7EB 100%)`,
                        }}
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>1 Star (Bad)</span>
                        <span>5 Stars (Excellent)</span>
                    </div>
                </div>

                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                        Comments (Optional)
                    </label>
                    <textarea
                        id="comment"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        disabled={submitting || loadingProject}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting || loadingProject || !project}
                    className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                    {submitting ? 'Submitting...' : 'Submit Rating'}
                </button>
            </form>
        </div>
    );
}
