"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { register, fetchCurrentUserProfile, UserStore } from "@/lib/api/api";
import { User, Mail, Lock, AlertCircle, ArrowRight, CheckCircle, Check, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('auth.register');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
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
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-black text-slate-900 mb-2">{t('title')}</h2>
        <p className="text-slate-600 font-medium">{t('subtitle')}</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3 backdrop-blur-sm overflow-hidden"
          >
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-700 text-sm font-semibold">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="space-y-1.5"
        >
          <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wide">{t('fullName')}</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-all duration-300 group-focus-within:text-emerald-600 group-focus-within:scale-110" size={18} />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 bg-white/60 border-2 border-slate-200/60 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
              placeholder="John Doe"
            />
          </div>
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="space-y-1.5"
        >
          <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wide">{t('email')}</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-all duration-300 group-focus-within:text-emerald-600 group-focus-within:scale-110" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 bg-white/60 border-2 border-slate-200/60 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
              placeholder="you@example.com"
            />
          </div>
        </motion.div>

        {/* Username */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-1.5"
        >
          <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wide">{t('username')}</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-all duration-300 group-focus-within:text-emerald-600 group-focus-within:scale-110" size={18} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 bg-white/60 border-2 border-slate-200/60 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
              placeholder="johndoe"
            />
          </div>
        </motion.div>

        {/* Password Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="space-y-1.5"
          >
            <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wide">{t('password')}</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-all duration-300 group-focus-within:text-emerald-600 group-focus-within:scale-110" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 bg-white/60 border-2 border-slate-200/60 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
                placeholder="••••••••"
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-1.5"
          >
            <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wide">{t('confirm')}</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-all duration-300 group-focus-within:text-emerald-600 group-focus-within:scale-110" size={18} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 bg-white/60 border-2 border-slate-200/60 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
                placeholder="••••••••"
              />
            </div>
          </motion.div>
        </div>

        {/* Strength Meter */}
        <AnimatePresence>
          {password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-slate-50 to-emerald-50/30 p-4 rounded-xl border border-slate-200/60 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{t('strength')}</span>
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${passwordStrength < 40 ? 'bg-red-100 text-red-700' : passwordStrength < 80 ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'}`}
                >
                  {passwordStrength < 40 ? t('weak') : passwordStrength < 80 ? t('good') : t('strong')}
                </motion.span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${passwordStrength}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-full transition-colors duration-500 ${passwordStrength < 40 ? 'bg-gradient-to-r from-red-500 to-red-600' : passwordStrength < 80 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.label
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="flex items-start gap-3 cursor-pointer pt-2"
        >
          <div className="relative flex items-center mt-0.5">
            <input type="checkbox" required className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 bg-white transition-all checked:border-emerald-500 checked:bg-emerald-500 hover:border-emerald-400 shadow-sm" />
            <Check size={14} strokeWidth={3} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
          </div>
          <span className="text-sm text-slate-600 select-none font-medium">
            {t('agreeTerms')}{' '}
            <a href="#" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline transition-colors">
              {t('terms')}
            </a>
            {' '}and{' '}
            <a href="#" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline transition-colors">
              {t('privacyPolicy')}
            </a>
          </span>
        </motion.label>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white font-bold text-lg shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:shadow-emerald-600/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                {t('creating')}
              </>
            ) : (
              <>
                {t('createAccountButton')}
                <ArrowRight size={20} />
              </>
            )}
          </span>
        </motion.button>
      </form>
    </div>
  );
}