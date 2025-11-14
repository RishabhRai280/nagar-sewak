// frontend/app/dashboard/admin/page.tsx

import dynamic from 'next/dynamic';

const DynamicAdminDashboard = dynamic(
  () => import('../components/AdminDashboard'),
  { ssr: false } // Load client-side only to access JWT and perform auth check
);

export default function AdminDashboardPage() {
    return (
        <DynamicAdminDashboard />
    );
}