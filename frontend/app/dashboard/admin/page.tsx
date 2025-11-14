// frontend/app/dashboard/admin/page.tsx

'use client';

import dynamic from 'next/dynamic';

const DynamicAdminDashboard = dynamic(
    () => import('../../components/AdminDashboard'),
    { ssr: false } // Client-side only because it needs the JWT (Token.get())
);

export default function AdminDashboardPage() {
    return <DynamicAdminDashboard />;
}