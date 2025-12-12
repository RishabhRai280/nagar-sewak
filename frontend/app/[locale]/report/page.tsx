// frontend/app/report/page.tsx
"use client";

import CitizenComplaintForm from '../../components/complaints/CitizenComplaintForm';
import { motion } from 'framer-motion';

export default function ReportPage() {
    return (
        <div className="min-h-screen w-full relative flex items-center justify-center p-4 lg:p-8 overflow-hidden bg-slate-50">
            {/* --- Official Background Pattern --- */}
            <div className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#1e3a8a 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />

            {/* The Glass Form sits here */}
            <div className="relative z-10 w-full max-w-4xl">
                <CitizenComplaintForm />
            </div>
        </div>
    );
}