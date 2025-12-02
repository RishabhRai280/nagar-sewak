// frontend/app/dashboard/citizen/page.tsx

'use client';

import dynamic from 'next/dynamic';

const DynamicCitizenDashboard = dynamic(
    () => import('../../../components/dashboards/CitizenDashboard'),
    { ssr: false } // Client-side only because it needs the JWT (Token.get())
);

export default function CitizenDashboardPage() {
    return <DynamicCitizenDashboard />;
}