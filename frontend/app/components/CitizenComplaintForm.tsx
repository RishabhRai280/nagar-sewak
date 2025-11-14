// frontend/app/components/CitizenComplaintForm.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { submitComplaint, Token } from '@/lib/api';

export default function CitizenComplaintForm() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [severity, setSeverity] = useState(3); // Default severity to Medium
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [locationStatus, setLocationStatus] = useState<'idle' | 'fetching' | 'success' | 'error'>('idle');

    // Effect to check authentication status and redirect if necessary
    useEffect(() => {
        if (!Token.get()) {
            alert("You must be logged in to report an issue.");
            router.push('/login');
        }
    }, [router]);


    const getLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            setLocationStatus('error');
            return;
        }

        setLocationStatus('fetching');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                setLocationStatus('success');
            },
            (err) => {
                setError(`Location access denied or failed: ${err.message}`);
                setLocationStatus('error');
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (latitude === null || longitude === null) {
            setError("Please locate your position before submitting the complaint.");
            return;
        }

        setLoading(true);
        try {
            await submitComplaint({
                title,
                description,
                severity,
                lat: latitude,
                lng: longitude,
            });

            alert('Complaint submitted successfully! An administrator will review it shortly.');
            router.push('/dashboard/citizen'); 
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to submit complaint. Ensure you are logged in.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-2xl">
            <h2 className="text-3xl font-bold text-center text-red-600 mb-6">
                Report a Civic Issue
            </h2>
            <p className="text-center text-gray-600 mb-6">
                Geo-tagged issues help us route complaints faster for resolution. (Citizen Only)
            </p>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Complaint Details */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Issue Title (e.g., Deep Pothole on Main Road)</label>
                    <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required disabled={loading} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Detailed Description</label>
                    <textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required disabled={loading} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
                
                <div>
                    <label htmlFor="severity" className="block text-sm font-medium text-gray-700">Severity Level (1=Low, 5=High)</label>
                    <input id="severity" type="range" min="1" max="5" step="1" value={severity} onChange={(e) => setSeverity(parseInt(e.target.value))} required disabled={loading} className="mt-1 block w-full" />
                    <p className="text-center text-sm font-medium text-gray-500">Current Severity: {severity}</p>
                </div>

                {/* 2. Geo-tagging */}
                <div className="border-t pt-4">
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Location Tagging (Mandatory)</h3>
                    <button
                        type="button"
                        onClick={getLocation}
                        disabled={loading || locationStatus === 'fetching'}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none disabled:opacity-50"
                    >
                        {locationStatus === 'fetching' ? 'Locating...' : 'Get Current GPS Location'}
                    </button>
                    
                    {latitude !== null && longitude !== null && (
                        <p className="mt-3 text-sm text-green-700 text-center font-semibold">
                            Location Tagged: Lat {latitude.toFixed(4)}, Lng {longitude.toFixed(4)}
                        </p>
                    )}
                </div>

                {/* 3. Submit Button */}
                <button
                    type="submit"
                    disabled={loading || latitude === null || longitude === null}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 mt-8"
                >
                    {loading ? 'Submitting...' : 'Submit Complaint'}
                </button>
            </form>
        </div>
    );
}