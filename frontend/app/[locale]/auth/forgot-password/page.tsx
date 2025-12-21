"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const t = useTranslations('auth.forgotPassword');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to send reset email');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const gradient = 'from-[#f97316] via-white to-[#166534]';

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50">
        {/* Left Panel - Government Branding */}
        <div className="hidden lg:flex w-1/2 bg-[#1e3a8a] relative overflow-hidden flex-col justify-center items-center p-12 text-white">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

          <div className="relative z-10 flex flex-col items-center text-center space-y-8">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
              alt="Satyamev Jayate"
              className="w-48 h-48 invert brightness-0 opacity-95 drop-shadow-2xl"
            />
            <div className="space-y-2">
              <h1 className="font-extrabold text-4xl tracking-widest uppercase mb-1">Government of India</h1>
              <p className="text-orange-200 text-sm tracking-[0.3em] uppercase font-bold border-t border-orange-400/30 pt-4 inline-block px-8">
                Ministry of Urban Affairs
              </p>
            </div>
            <div className="mt-12 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/10 text-xs font-semibold text-white/90 tracking-wide uppercase">
              Official Citizen Portal
            </div>
          </div>

          <div className={`absolute bottom-0 w-full h-2 bg-gradient-to-r ${gradient}`}></div>
        </div>

        {/* Right Panel - Success Message */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12 bg-white">
          <div className="w-full max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="text-green-600" size={32} />
              </motion.div>

              <h2 className="text-2xl font-black text-slate-900 mb-4">
                {t('emailSent')}
              </h2>

              <p className="text-slate-600 mb-8 leading-relaxed">
                {t('checkEmail')}
              </p>

              <div className="space-y-3">
                <Link
                  href="/login"
                  className="w-full py-3 rounded-lg bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={20} />
                  {t('backToLogin')}
                </Link>

                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail("");
                  }}
                  className="w-full py-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-all duration-300"
                >
                  {t('sendAnother')}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50">
      {/* Left Panel - Government Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#1e3a8a] relative overflow-hidden flex-col justify-center items-center p-12 text-white">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
            alt="Satyamev Jayate"
            className="w-48 h-48 invert brightness-0 opacity-95 drop-shadow-2xl"
          />
          <div className="space-y-2">
            <h1 className="font-extrabold text-4xl tracking-widest uppercase mb-1">Government of India</h1>
            <p className="text-orange-200 text-sm tracking-[0.3em] uppercase font-bold border-t border-orange-400/30 pt-4 inline-block px-8">
              Ministry of Urban Affairs
            </p>
          </div>
          <div className="mt-12 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/10 text-xs font-semibold text-white/90 tracking-wide uppercase">
            Official Citizen Portal
          </div>
        </div>

        <div className={`absolute bottom-0 w-full h-2 bg-gradient-to-r ${gradient}`}></div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              {t('backToLogin')}
            </Link>

            <h2 className="text-3xl font-black text-slate-900 mb-2">{t('title')}</h2>
            <p className="text-slate-600 font-medium mb-8">{t('subtitle')}</p>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 p-4 border rounded-lg flex items-start gap-3 bg-red-50 border-red-200"
                >
                  <AlertCircle className="flex-shrink-0 mt-0.5 text-red-600" size={20} />
                  <p className="text-sm font-semibold text-red-700">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t('emailLabel')}</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-all duration-300 group-focus-within:text-blue-700" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20 transition-all duration-300 font-medium"
                    placeholder="name@example.com"
                  />
                </div>
                <p className="text-xs text-slate-500">{t('emailHint')}</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-lg bg-[#1e3a8a] hover:bg-[#172554] text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {t('sending')}
                  </>
                ) : (
                  t('sendResetLink')
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-600 font-medium">
                {t('rememberPassword')}{' '}
                <Link href="/login" className="text-blue-700 font-bold hover:underline transition-all">
                  {t('signInLink')}
                </Link>
              </p>
            </div>

            {/* Footer Links */}
            <div className="mt-12 text-center text-xs text-slate-400 flex flex-col gap-2">
              <p>© 2025 Nagar Sewak. All rights reserved.</p>
              <div className="flex justify-center gap-4">
                <Link href="/privacy" className="hover:text-blue-800 underline transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-blue-800 underline transition-colors">Terms of Service</Link>
                <Link href="/help" className="hover:text-blue-800 underline transition-colors">Help & Support</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}