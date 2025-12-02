// frontend/app/dashboard/contractor/page.tsx
'use client';

import dynamic from 'next/dynamic';
import ContractorDashboardComponent from '@/app/components/dashboards/ContractorDashboard';

// Load client-side only 
const DynamicContractorDashboardContent = dynamic(
    () => Promise.resolve(ContractorDashboardComponent),
    { ssr: false } 
);

export default function ContractorDashboardPage() {
    return (
      <div className="flex min-h-screen bg-slate-50">
        {/* Sidebar removed as requested */}
        <DynamicContractorDashboardContent />
      </div>
    );
}