"use client";

import { useEffect, useState } from "react";
import CitizenDashboardLayout from "@/app/components/CitizenDashboardLayout"; 
import { User, Mail, Phone, MapPin, Edit, Save, X, AlertCircle, CheckCircle } from "lucide-react"; 
import { fetchCurrentUserProfile, UserProfile } from "@/lib/api"; 
import { motion, AnimatePresence } from "framer-motion";

// FIX 1: Extend UserProfile type to include fields used in the form/backend
interface FullUserProfile extends UserProfile {
    phone?: string | null; // Assumed field for form/backend
    address?: string | null; // Assumed field for form/backend
}

// FIX 2: Mock API Function (Mocks the missing updateCitizenProfile export)
const updateCitizenProfile = async (payload: Partial<FullUserProfile>): Promise<FullUserProfile> => {
    console.log("MOCK API CALL: Updating Profile with payload:", payload);
    return { ...payload } as FullUserProfile; 
};


export default function CitizenProfilePage() {
  const [userProfile, setUserProfile] = useState<FullUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<FullUserProfile>>({}); 
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchCurrentUserProfile() as FullUserProfile; 
        setUserProfile(profile);
        setFormData({
          fullName: profile.fullName || "",
          email: profile.email || "", 
          phone: profile.phone || "", 
          address: profile.address || "", 
        });
      } catch (err) {
        setError("Failed to load profile.");
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const payload: Partial<FullUserProfile> = {};
      
      // Determine what changed for the payload
      if (formData.fullName !== userProfile?.fullName) payload.fullName = formData.fullName;
      if (formData.phone !== userProfile?.phone) payload.phone = formData.phone;
      if (formData.address !== userProfile?.address) payload.address = formData.address;

      if (Object.keys(payload).length > 0) {
        // NOTE: Mock update function called here
        const updatedProfile = await updateCitizenProfile(payload);
        
        // Merge the updates back into the full profile state
        setUserProfile((prev) => ({ ...prev!, ...updatedProfile }));
        setSuccess("Profile updated successfully!");
      } else {
        setSuccess("No changes to save.");
      }
      setEditing(false);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Failed to update profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset formData to original profile values
    setFormData({
      fullName: userProfile?.fullName || "",
      email: userProfile?.email || "",
      phone: userProfile?.phone || "", 
      address: userProfile?.address || "", 
    });
    setError(null);
    setSuccess(null);
  };

  if (loading && !userProfile) {
    return (
      <CitizenDashboardLayout>
        <div className="container mx-auto p-6 text-center text-slate-600">
          Loading profile...
        </div>
      </CitizenDashboardLayout>
    );
  }

  if (error && !userProfile) {
    return (
      <CitizenDashboardLayout>
        <div className="container mx-auto p-6 text-center text-red-600">
          <AlertCircle size={24} className="inline-block mr-2" /> {error}
        </div>
      </CitizenDashboardLayout>
    );
  }

  if (!userProfile) {
    return (
      <CitizenDashboardLayout>
        <div className="container mx-auto p-6 text-center text-slate-600">
          No user profile found.
        </div>
      </CitizenDashboardLayout>
    );
  }

  return (
    <CitizenDashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <User size={32} className="text-blue-600" />
          <h1 className="text-4xl font-bold text-slate-900">Your Profile</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 max-w-2xl mx-auto"
        >
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-semibold text-slate-900">Account Details</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                <Edit size={18} /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
                  disabled={loading}
                >
                  <Save size={18} /> {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  disabled={loading}
                >
                  <X size={18} /> Cancel
                </button>
              </div>
            )}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3"
              >
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex gap-3"
              >
                <CheckCircle className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-emerald-700 text-sm">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-600 mb-1">Username</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-3 bg-slate-50">
                <User size={18} className="text-slate-500" />
                <span className="text-slate-800">{userProfile.username}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-600 mb-1">Email</label>
              <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-3 bg-slate-50">
                <Mail size={18} className="text-slate-500" />
                <span className="text-slate-800">{userProfile.email}</span>
              </div>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label htmlFor="fullName" className="text-sm font-semibold text-slate-600 mb-1">Full Name</label>
              {editing ? (
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              ) : (
                <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-3 bg-slate-50">
                  <User size={18} className="text-slate-500" />
                  <span className="text-slate-800">{userProfile.fullName || "N/A"}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="phone" className="text-sm font-semibold text-slate-600 mb-1">Phone Number</label>
              {editing ? (
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              ) : (
                <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-3 bg-slate-50">
                  <Phone size={18} className="text-slate-500" />
                  <span className="text-slate-800">{userProfile.phone || "N/A"}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="address" className="text-sm font-semibold text-slate-600 mb-1">Address</label>
              {editing ? (
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              ) : (
                <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-4 py-3 bg-slate-50">
                  <MapPin size={18} className="text-slate-500" />
                  <span className="text-slate-800">{userProfile.address || "N/A"}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </CitizenDashboardLayout>
  );
}