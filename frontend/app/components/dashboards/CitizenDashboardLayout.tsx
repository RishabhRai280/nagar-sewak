// frontend/app/components/CitizenDashboardLayout.tsx
"use client";

import Sidebar from "../shared/Sidebar";
import { motion } from "framer-motion";

export default function CitizenDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex bg-slate-50 min-h-screen relative overflow-hidden">
            {/* Background effects matching CitizenDashboard */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <motion.div 
                    animate={{ x: [0, 50, 0], y: [0, 30, 0] }} 
                    transition={{ duration: 20, repeat: Infinity }} 
                    className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-200 rounded-full blur-[120px] opacity-40" 
                />
                <motion.div 
                    animate={{ x: [0, -50, 0], y: [0, -50, 0] }} 
                    transition={{ duration: 25, repeat: Infinity }} 
                    className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-200 rounded-full blur-[120px] opacity-40" 
                />
            </div>

            <Sidebar />
            
            <main className="flex-1 px-6 pb-12 pt-24 lg:px-10 lg:pb-16 lg:pt-28 relative z-10 overflow-y-auto max-w-7xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}