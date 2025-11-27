// frontend/app/dashboard/admin/page.tsx

'use client';

import dynamic from 'next/dynamic';
import AdminDashboardComponent from '@/app/components/AdminDashboard';

const DynamicAdminDashboard = dynamic(
    () => Promise.resolve(AdminDashboardComponent),
    { ssr: false } // Client-side only because it needs the JWT (Token.get())
);

export default function AdminDashboardPage() {
    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar removed as requested */}
            <DynamicAdminDashboard />
        </div>
    );
}