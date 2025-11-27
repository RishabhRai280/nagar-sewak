// frontend/app/rate/[projectId]/page.tsx
"use client";

import RatingForm from '../../components/RatingForm';
import { motion } from 'framer-motion';

export default function RateProjectPage({ params }: { params: { projectId: string }}) {
    const projectId = Number(params.projectId);
    const isInvalid = Number.isNaN(projectId);

    return (
        <div className="flex min-h-screen relative items-center justify-center py-12 px-4 bg-slate-50 overflow-hidden">
            
            {/* --- PARALLAX BACKGROUND --- */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.div animate={{ x: [0, 40, 0], y: [0, -40, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-yellow-200 rounded-full blur-[100px] opacity-40 mix-blend-multiply" />
                <motion.div animate={{ x: [0, -40, 0], y: [0, 40, 0] }} transition={{ duration: 25, repeat: Infinity }} className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-200 rounded-full blur-[100px] opacity-40 mix-blend-multiply" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-xl">
                {isInvalid ? (
                    <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-center border border-white/50">
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Invalid Project</h2>
                        <p className="text-slate-600">Please select a valid project from the map.</p>
                    </div>
                ) : (
                    <RatingForm projectId={projectId} />
                )}
            </div>
        </div>
    );
}