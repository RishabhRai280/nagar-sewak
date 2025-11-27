// frontend/app/report/page.tsx
"use client";

import CitizenComplaintForm from '../components/CitizenComplaintForm';
import { motion } from 'framer-motion';

export default function ReportPage() {
    return (
        <div className="min-h-screen w-full relative flex items-center justify-center p-4 lg:p-8 overflow-hidden bg-slate-50">
            {/* --- PARALLAX BACKGROUND BLOBS --- */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.div 
                    animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-blue-400 rounded-full blur-[120px] opacity-30 mix-blend-multiply" 
                />
                <motion.div 
                    animate={{ x: [0, -60, 0], y: [0, 40, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-40 -right-40 w-[500px] h-[500px] bg-purple-400 rounded-full blur-[120px] opacity-30 mix-blend-multiply" 
                />
                <motion.div 
                    animate={{ x: [0, 40, 0], y: [0, 60, 0], scale: [1, 1.3, 1] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-40 left-20 w-[600px] h-[600px] bg-indigo-400 rounded-full blur-[120px] opacity-30 mix-blend-multiply" 
                />
            </div>

            {/* The Glass Form sits here */}
            <div className="relative z-10 w-full max-w-4xl">
                <CitizenComplaintForm />
            </div>
        </div>
    );
}