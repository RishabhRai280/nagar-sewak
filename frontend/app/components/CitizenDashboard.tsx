// frontend/app/components/CitizenDashboard.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Link from "next/link";
import { Token, fetchCurrentUserProfile, UserProfile } from "@/lib/api";

export default function CitizenDashboardComponent() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Token.get()) {
      alert("Please log in to view your dashboard.");
      router.push("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const profile = await fetchCurrentUserProfile();
        setUserData(profile);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Unable to load your profile.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const stats = useMemo(() => {
    const complaints = userData?.complaints ?? [];
    const pending = complaints.filter(
      (c) => c.status?.toLowerCase() === "pending"
    ).length;
    return {
      total: complaints.length,
      pending,
      resolved: complaints.length - pending,
    };
  }, [userData]);

  if (loading) {
    return (
      <div className="text-center py-20 text-xl text-gray-500">
        Loading your profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-xl text-red-600">{error}</div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Welcome Back, {userData.fullName || userData.username}
        </h1>
        <p className="text-gray-500 mb-8">Citizen Dashboard</p>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-600">
            <p className="text-gray-700">Total Complaints</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500">
            <p className="text-gray-700">Pending Complaints</p>
            <p className="text-3xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-600">
            <p className="text-gray-700">Resolved Complaints</p>
            <p className="text-3xl font-bold text-green-700">
              {stats.resolved}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <Link href="/report">
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-red-700 transition w-fit mb-8">
            + Submit New Complaint
          </button>
        </Link>

        {/* Complaints List */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Complaint History
          </h2>

          {userData.complaints.length === 0 ? (
            <p className="text-gray-500">
              No complaints yet — start by clicking submit complaint.
            </p>
          ) : (
            <ul className="space-y-4">
              {userData.complaints.map((complaint) => (
                <li
                  key={complaint.id}
                  className="border-b last:border-none pb-4"
                >
                  <div className="flex justify-between items-start gap-6">
                    <div className="flex gap-4">
                      {complaint.photoUrl && (
                        <img
                          src={`http://localhost:8080/uploads/${complaint.photoUrl}`}
                          className="w-20 h-20 rounded-md object-cover border"
                          alt="proof"
                        />
                      )}

                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {complaint.title}
                        </h3>

                        <p className="text-sm text-gray-500">
                          Severity: {complaint.severity} / 5
                        </p>

                        {complaint.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {complaint.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        complaint.status?.toLowerCase() === "resolved"
                          ? "bg-green-100 text-green-700"
                          : complaint.status?.toLowerCase() === "in_progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {complaint.status}
                    </span>
                  </div>

                  <div className="flex gap-6 mt-2 text-sm font-semibold">
                    <Link
                      href={`/dashboard/citizen/complaints/${complaint.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Details
                    </Link>

                    {complaint.status?.toLowerCase() === "resolved" &&
                      !complaint.rating && (
                        <Link
                          href={`/rate?id=${complaint.id}`}
                          className="text-green-600 hover:underline"
                        >
                          Rate Work
                        </Link>
                      )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
