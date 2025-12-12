// frontend/app/components/CitizenDashboardLayout.tsx
"use client";

import Sidebar from "./Sidebar";
import { motion } from "framer-motion";

export default function CitizenDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen relative bg-slate-50 overflow-hidden">
             {/* Global Parallax Background for all dashboard pages */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <motion.div animate={{ x: [0, 60, 0], y: [0, 40, 0] }} transition={{ duration: 18, repeat: Infinity }} className="absolute -top-20 -left-20 w-[700px] h-[700px] bg-blue-200 rounded-full blur-[100px] opacity-40" />
                <motion.div animate={{ x: [0, -40, 0], y: [0, -60, 0] }} transition={{ duration: 22, repeat: Infinity }} className="absolute top-1/2 right-[-10%] w-[600px] h-[600px] bg-indigo-200 rounded-full blur-[100px] opacity-40" />
            </div>

            <Sidebar />
            
            {/* Updated Padding: px-8 pb-12 pt-32 */}
            <main className="flex-1 px-8 pb-12 pt-32 lg:px-12 lg:pb-12 lg:pt-36 relative z-10 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}