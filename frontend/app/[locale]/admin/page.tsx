'use client';

import dynamic from 'next/dynamic';
import Sidebar from '@/app/components/Sidebar'; // Import Sidebar
import AdminDashboardComponent from '@/app/components/AdminDashboard'; // Import Dashboard component

// Dynamic loading is preserved, but we wrap the content with the Sidebar here
const DynamicAdminDashboardContent = dynamic(
    () => Promise.resolve(AdminDashboardComponent),
    { ssr: false } // Client-side only because it needs the JWT (Token.get())
);

export default function AdminDashboardPage() {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        {/* Sidebar is included here for the main dashboard view */}
        <Sidebar />
        <DynamicAdminDashboardContent />
      </div>
    );
}