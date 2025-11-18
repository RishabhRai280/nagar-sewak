// frontend/app/dashboard/contractor/page.tsx
'use client';

import dynamic from 'next/dynamic';
import Sidebar from '@/app/components/Sidebar'; 
import ContractorDashboardComponent from '@/app/components/ContractorDashboard';

// Load client-side only 
const DynamicContractorDashboardContent = dynamic(
    () => Promise.resolve(ContractorDashboardComponent),
    { ssr: false } 
);

export default function ContractorDashboardPage() {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <Sidebar />
        <DynamicContractorDashboardContent />
      </div>
    );
}