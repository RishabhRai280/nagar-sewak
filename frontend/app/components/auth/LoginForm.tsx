"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { login, fetchCurrentUserProfile, UserStore, loginWithGoogle } from "@/lib/api/api";
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Chrome, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { signInWithPopup } from "firebase/auth";
import { getFirebaseAuth, googleProvider } from "@/lib/firebaseClient";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('auth.login');

  const redirectByRole = (profile: Awaited<ReturnType<typeof fetchCurrentUserProfile>>) => {
    const hasAdminAccess = profile.roles.some(role => ["ADMIN", "SUPER_ADMIN"].includes(role));
    const isContractor = profile.roles.includes("CONTRACTOR");

    if (isContractor) router.push("/dashboard/contractor");
    else if (hasAdminAccess) router.push("/dashboard/admin");
    else router.push("/dashboard/citizen");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      const profile = await fetchCurrentUserProfile();
      UserStore.set(profile);
      redirectByRole(profile);
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsGoogleLoading(true);
    try {
      const auth = getFirebaseAuth();
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      await loginWithGoogle(idToken, result.user.email ?? undefined, result.user.displayName ?? undefined);
      const profile = await fetchCurrentUserProfile();
      UserStore.set(profile);
      redirectByRole(profile);
    } catch (err: any) {
      setError(err.message || "Google sign-in failed.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

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

      <form onSubmit={handleSubmit} className="space-y-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="space-y-2"
        >
          <label className="text-sm font-bold text-slate-700 ml-1">{t('email')}</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-all duration-300 group-focus-within:text-blue-600 group-focus-within:scale-110" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-slate-200/60 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
              placeholder="name@example.com"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-2"
        >
          <div className="flex justify-between ml-1">
            <label className="text-sm font-bold text-slate-700">{t('password')}</label>
            <Link href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
              {t('forgotPassword')}
            </Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-all duration-300 group-focus-within:text-blue-600 group-focus-within:scale-110" size={20} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-slate-200/60 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 shadow-sm hover:shadow-md font-medium"
              placeholder="••••••••"
            />
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-lg shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                {t('signingIn')}
              </>
            ) : (
              <>
                {t('signIn')}
                <ArrowRight size={20} />
              </>
            )}
          </span>
        </motion.button>
      </form>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-6"
      >
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/60 text-slate-500 font-semibold">{t('orContinueWith')}</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
          className="mt-4 w-full py-3.5 rounded-2xl border-2 border-slate-200 bg-white text-slate-800 font-bold shadow-md hover:shadow-lg hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Signing in...
            </>
          ) : (
            <>
              <Chrome size={20} />
              Continue with Google
            </>
          )}
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/60 flex items-start gap-3 shadow-sm"
      >
        <CheckCircle2 className="text-emerald-600 mt-0.5 flex-shrink-0" size={20} />
        <div>
          <p className="text-xs font-bold text-emerald-900 mb-1">{t('demoAccess')}</p>
          <p className="text-xs text-emerald-700 font-medium">
            Use any demo email with password: <span className="font-mono font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">{t('demoPassword')}</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}