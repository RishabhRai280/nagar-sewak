// frontend/app/components/CitizenDashboardLayout.tsx
"use client";

import Sidebar from "./Sidebar";
import { motion } from "framer-motion";

export default function CitizenDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex bg-slate-50 pt-16 min-h-screen">
            <Sidebar />
            <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}