// frontend/app/components/CitizenDashboardLayout.tsx
// Note: This component wraps the content with the Sidebar and correct dashboard background/padding.

'use client';

import Sidebar from "./Sidebar";

export default function CitizenDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        // Matches the background of the main CitizenDashboard
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* The Sidebar component provides the navigation */}
            <Sidebar />
            
            {/* Main content area (flex-1 to take up the rest of the space) */}
            <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}