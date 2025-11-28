"use client";

import { useEffect, useState } from "react";
import CitizenDashboardLayout from "@/app/components/CitizenDashboardLayout";
import { User, Mail, Phone, MapPin, Edit, Save, X, AlertCircle, CheckCircle, Shield } from "lucide-react";
import { fetchCurrentUserProfile, UserProfile } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface FullUserProfile extends UserProfile {
  phone?: string | null;
  address?: string | null;
}

const updateCitizenProfile = async (payload: Partial<FullUserProfile>): Promise<FullUserProfile> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real application, you would make an actual API call here.
  // For demonstration, we'll just return the payload as the updated profile.
  // If an error should occur, you would throw it here, e.g., throw new Error("Failed to update profile");
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
      if (formData.fullName !== userProfile?.fullName) payload.fullName = formData.fullName;
      if (formData.phone !== userProfile?.phone) payload.phone = formData.phone;
      if (formData.address !== userProfile?.address) payload.address = formData.address;

      if (Object.keys(payload).length > 0) {
        const updatedProfile = await updateCitizenProfile(payload);
        setUserProfile((prev) => ({ ...prev!, ...updatedProfile }));
        setSuccess("Profile updated successfully!");
      } else {
        setSuccess("No changes to save.");
      }
      setEditing(false);
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      fullName: userProfile?.fullName || "",
      email: userProfile?.email || "",
      phone: userProfile?.phone || "",
      address: userProfile?.address || "",
    });
    setError(null);
    setSuccess(null);
  };

  if (loading && !userProfile) return <CitizenDashboardLayout><div className="p-12 text-center text-slate-500">Loading...</div></CitizenDashboardLayout>;

  return (
    <CitizenDashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 text-white">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">My Profile</h1>
            <p className="text-slate-600 font-medium">Manage your account settings</p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 lg:p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

          <div className="flex justify-between items-center mb-8 border-b border-slate-200/60 pb-6">
            <h2 className="text-2xl font-bold text-slate-900">Personal Information</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/80 border border-white shadow-sm text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition"
              >
                <Edit size={18} /> Edit Details
              </button>
            ) : (
              <div className="flex gap-3">
                <button onClick={handleCancel} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition">Cancel</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition">
                  <Save size={18} /> Save Changes
                </button>
              </div>
            )}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 items-center text-red-700 font-bold">
                <AlertCircle size={20} /> {error}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex gap-3 items-center text-emerald-700 font-bold">
                <CheckCircle size={20} /> {success}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
              <div className="flex items-center gap-3 px-4 py-4 bg-slate-50/50 border border-slate-200/60 rounded-xl text-slate-500 cursor-not-allowed">
                <Shield size={18} />
                <span className="font-mono font-medium">{userProfile?.username}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
              <div className="flex items-center gap-3 px-4 py-4 bg-slate-50/50 border border-slate-200/60 rounded-xl text-slate-500 cursor-not-allowed">
                <Mail size={18} />
                <span className="font-medium">{userProfile?.email}</span>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
              <div className={`relative group ${editing ? "" : "opacity-80"}`}>
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                {editing ? (
                  <input name="fullName" value={formData.fullName || ""} onChange={handleChange} className="w-full pl-11 pr-4 py-4 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none font-bold text-slate-900" />
                ) : (
                  <div className="w-full pl-11 pr-4 py-4 bg-white/40 border border-slate-200 rounded-xl font-bold text-slate-800">{userProfile?.fullName || "N/A"}</div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                {editing ? (
                  <input name="phone" value={formData.phone || ""} onChange={handleChange} className="w-full pl-11 pr-4 py-4 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900" />
                ) : (
                  <div className="w-full pl-11 pr-4 py-4 bg-white/40 border border-slate-200 rounded-xl font-medium text-slate-800">{userProfile?.phone || "N/A"}</div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                {editing ? (
                  <input name="address" value={formData.address || ""} onChange={handleChange} className="w-full pl-11 pr-4 py-4 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-900" />
                ) : (
                  <div className="w-full pl-11 pr-4 py-4 bg-white/40 border border-slate-200 rounded-xl font-medium text-slate-800">{userProfile?.address || "N/A"}</div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </CitizenDashboardLayout>
  );
}