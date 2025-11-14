// frontend/app/components/AdminDashboard.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAdminDashboard, AdminDashboardData, Token, FlaggedContractor } from '@/lib/api'; 

export default function AdminDashboardComponent() {
    const router = useRouter();
    const [data, setData] = useState<AdminDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!Token.get()) {
            // User is not logged in, redirect to login
            router.push('/login');
            return;
        }

        const loadData = async () => {
            try {
                const dashboardData = await fetchAdminDashboard();
                setData(dashboardData);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Error fetching dashboard data.';
                setError(message);
                if (message.includes("Access Denied")) {
                    // Specific redirect for unauthorized users
                    router.push('/');
                }
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [router]);

    const metrics = useMemo(() => ({
        activeProjects: data?.activeProjectsCount ?? 0,
        pendingComplaints: data?.pendingComplaintsCount ?? 0,
        averageResolution: data?.averageResolutionTime ?? null,
        totalBudget: data?.totalSanctionedBudget ?? 0,
        contractors: data?.flaggedContractors ?? [],
    }), [data]);

    if (loading) {
        return <div className="text-center py-20 text-xl text-gray-500">Loading Admin Dashboard...</div>;
    }

    if (error && !data) {
        return <div className="text-center py-20 text-xl text-red-600">Error: {error}</div>;
    }

    // Function to render KPI cards
    const KPICard = ({ title, value, unit }: { title: string, value: string | number, unit: string }) => (
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-600">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-4xl font-extrabold text-gray-900 mt-1">
                {value}
                <span className="text-lg font-semibold ml-1 text-blue-600">{unit}</span>
            </p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
                Administrator Dashboard
            </h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <KPICard title="Active Development Projects" value={metrics.activeProjects} unit="Projects" />
                <KPICard title="Pending Citizen Complaints" value={metrics.pendingComplaints} unit="Complaints" />
                <KPICard
                    title="Avg. Resolution Time"
                    value={metrics.averageResolution !== null ? metrics.averageResolution.toFixed(1) : 'N/A'}
                    unit={metrics.averageResolution !== null ? 'Hours' : ''}
                />
                <KPICard
                    title="Total Sanctioned Budget"
                    value={`₹${metrics.totalBudget.toLocaleString()}`}
                    unit="INR"
                />
            </div>

            {/* Flagged Contractors Table */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold text-red-600 mb-4">
                    Flagged Contractors for Review ({metrics.contractors.length})
                </h2>
                
                {metrics.contractors.length === 0 ? (
                    <p className="text-gray-500">No contractors currently meet the automatic flagging criteria.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License No.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Rating</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {metrics.contractors.map((c: FlaggedContractor) => (
                                    <tr key={c.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.companyName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.licenseNo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 font-semibold">{c.avgRating.toFixed(2)} ⭐</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                FLAGGED
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}