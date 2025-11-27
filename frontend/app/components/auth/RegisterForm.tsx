"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { register, fetchCurrentUserProfile, UserStore } from "@/lib/api";
import { User, Mail, Lock, AlertCircle, ArrowRight, CheckCircle, Check } from 'lucide-react';

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      await register({ username, password, email, fullName });
      const profile = await fetchCurrentUserProfile();
      UserStore.set(profile);
      router.push("/dashboard/citizen?welcome=new");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = password ? Math.min(Math.floor(password.length / 8) * 25 + (/[A-Z]/.test(password) ? 25 : 0) + (/\d/.test(password) ? 25 : 0) + (/[^A-Za-z0-9]/.test(password) ? 25 : 0), 100) : 0;

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
        <p className="text-slate-600 mt-2">Join Nagar Sewak today.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 backdrop-blur-sm">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-700 text-sm font-semibold">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wide">Full Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600" size={18} />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
              placeholder="John Doe"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wide">Email</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Username */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wide">Username</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600" size={18} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
              placeholder="johndoe"
            />
          </div>
        </div>

        {/* Password Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wide">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wide">Confirm</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600" size={18} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        {/* Strength Meter */}
        {password && (
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
             <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-600">Strength</span>
                <span className={`text-xs font-bold ${passwordStrength < 40 ? 'text-red-500' : passwordStrength < 80 ? 'text-yellow-600' : 'text-emerald-600'}`}>
                  {passwordStrength < 40 ? "Weak" : passwordStrength < 80 ? "Good" : "Strong"}
                </span>
             </div>
             <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ${passwordStrength < 40 ? 'bg-red-500' : passwordStrength < 80 ? 'bg-yellow-500' : 'bg-emerald-500'}`} style={{ width: `${passwordStrength}%` }} />
             </div>
          </div>
        )}

        <label className="flex items-start gap-3 cursor-pointer pt-2">
          <div className="relative flex items-center">
            <input type="checkbox" required className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white transition-all checked:border-emerald-500 checked:bg-emerald-500 hover:border-emerald-400" />
            <Check size={14} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
          </div>
          <span className="text-sm text-slate-600 select-none">
            I agree to the <a href="#" className="text-emerald-600 font-bold hover:underline">Terms</a> and <a href="#" className="text-emerald-600 font-bold hover:underline">Privacy Policy</a>
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
        >
          {isLoading ? "Creating..." : <>Create Account <ArrowRight size={20} /></>}
        </button>
      </form>
    </div>
  );
}