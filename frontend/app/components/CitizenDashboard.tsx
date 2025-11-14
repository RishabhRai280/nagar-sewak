// frontend/app/components/CitizenDashboard.tsx

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Token, fetchCurrentUserProfile, UserProfile } from '@/lib/api';

 export default function CitizenDashboardComponent() {
     const router = useRouter();
     const [userData, setUserData] = useState<UserProfile | null>(null);
     const [error, setError] = useState<string | null>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
         if (!Token.get()) {
             alert("Please log in to view your dashboard.");
             router.push('/login');
             return;
         }

         const loadProfile = async () => {
             try {
                 const profile = await fetchCurrentUserProfile();
                 setUserData(profile);
             } catch (err: unknown) {
                 const message = err instanceof Error ? err.message : 'Unable to load your profile.';
                 setError(message);
             } finally {
                 setLoading(false);
             }
         };

         loadProfile();
     }, [router]);

     const stats = useMemo(() => {
         const complaints = userData?.complaints ?? [];
         const pending = complaints.filter((c) => c.status?.toLowerCase() === 'pending').length;
         return {
             total: complaints.length,
             pending,
             resolved: complaints.length - pending,
         };
     }, [userData]);

     if (loading) {
         return <div className="text-center py-20 text-xl text-gray-500">Loading your profile...</div>;
     }

     if (error) {
         return <div className="text-center py-20 text-xl text-red-600">{error}</div>;
     }

     if (!userData) {
         return null;
     }

     return (
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
             <h1 className="text-4xl font-extrabold text-green-700 mb-2">
                 Welcome Back, {userData.fullName || userData.username}
             </h1>
             <p className="text-lg text-gray-500 mb-8">Citizen Dashboard</p>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-1 space-y-6">
                     <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-green-500">
                         <h2 className="text-xl font-semibold mb-3">Your Impact</h2>
                         <div className="space-y-2">
                             <p className="text-gray-700">
                                 Total Reports:{' '}
                                 <span className="font-bold text-lg">
                                     {stats.total}
                                 </span>
                             </p>
                             <p className="text-gray-700">
                                 Pending Issues:{' '}
                                 <span className="font-bold text-lg text-red-500">
                                     {stats.pending}
                                 </span>
                             </p>
                             <p className="text-gray-700">
                                 Resolved:{' '}
                                 <span className="font-bold text-lg text-green-600">
                                     {stats.resolved}
                                 </span>
                             </p>
                         </div>
                     </div>

                     <Link href="/report" passHref>
                         <button className="w-full bg-red-600 text-white py-3 rounded-xl text-lg font-semibold shadow-lg hover:bg-red-700 transition">
                             + Submit New Complaint
                         </button>
                     </Link>
                 </div>

                 <div className="lg:col-span-2 space-y-8">
                     <div className="bg-white p-6 rounded-xl shadow-xl">
                         <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Reported Issues</h2>
                         {userData.complaints.length === 0 ? (
                             <p className="text-gray-500">No complaints submitted yet. Use the button on the left to file your first report.</p>
                         ) : (
                             <ul className="space-y-4">
                                 {userData.complaints.map((complaint) => (
                                     <li key={complaint.id} className="border-b pb-4 last:border-b-0">
                                         <div className="flex justify-between items-start gap-4">
                                             <div>
                                                 <h3 className="font-bold text-gray-900">{complaint.title}</h3>
                                                 <p className="text-sm text-gray-500">
                                                     Severity: {complaint.severity}/5
                                                 </p>
                                                 {complaint.description && (
                                                     <p className="text-sm text-gray-600 mt-1">{complaint.description}</p>
                                                 )}
                                             </div>
                                             <span
                                                 className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                     complaint.status?.toLowerCase() === 'resolved'
                                                         ? 'bg-green-100 text-green-800'
                                                         : 'bg-gray-100 text-gray-800'
                                                 }`}
                                             >
                                                 {complaint.status}
                                             </span>
                                         </div>
                                     </li>
                                 ))}
                             </ul>
                         )}
                     </div>
                 </div>
             </div>
         </div>
     );
 }