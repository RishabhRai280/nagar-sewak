"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { login, fetchCurrentUserProfile, UserStore } from "@/lib/api/api";
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('auth.login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      const profile = await fetchCurrentUserProfile();
      UserStore.set(profile);

      const hasAdminAccess = profile.roles.some(role => ["ADMIN", "SUPER_ADMIN"].includes(role));
      const isContractor = profile.roles.includes("CONTRACTOR");

      if (isContractor) router.push("/dashboard/contractor");
      else if (hasAdminAccess) router.push("/dashboard/admin");
      else router.push("/dashboard/citizen");

    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">{t('title')}</h2>
        <p className="text-slate-600 mt-2">{t('pleaseSignIn')}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 backdrop-blur-sm">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-700 text-sm font-semibold">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">{t('email')}</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-600" size={20} />
            {/* Translucent Input for Glass Effect */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between ml-1">
            <label className="text-sm font-bold text-slate-700">{t('password')}</label>
            <Link href="#" className="text-xs font-bold text-blue-600 hover:underline">{t('forgot')}</Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-blue-600" size={20} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
        >
          {isLoading ? t('signingIn') : <>{t('signIn')} <ArrowRight size={20} /></>}
        </button>
      </form>

      <div className="mt-8 p-4 rounded-xl bg-white/40 border border-white/60 flex items-start gap-3 shadow-sm">
        <CheckCircle2 className="text-emerald-600 mt-0.5 flex-shrink-0" size={18} />
        <div>
          <p className="text-xs font-bold text-slate-800 mb-0.5">{t('demoAccess')}</p>
          <p className="text-xs text-slate-600">{t('demoPassword')}: <span className="font-mono font-bold text-slate-900">password</span></p>
        </div>
      </div>
    </div>
  );
}