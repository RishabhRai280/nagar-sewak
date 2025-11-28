// frontend/app/[locale]/login/page.tsx
"use client";

import LoginForm from '../../components/auth/LoginForm';
import { Globe, Lock, Users, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('auth.login');

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 lg:p-8 overflow-hidden bg-slate-50">

      {/* --- VIBRANT ANIMATED BACKGROUND BLOBS --- */}
      <div className="absolute inset-0 w-full h-full">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-blue-400 rounded-full blur-[120px] opacity-40 mix-blend-multiply"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-0 w-[500px] h-[500px] bg-purple-400 rounded-full blur-[120px] opacity-40 mix-blend-multiply"
        />
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 50, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 left-20 w-[600px] h-[600px] bg-indigo-400 rounded-full blur-[120px] opacity-40 mix-blend-multiply"
        />
      </div>

      {/* --- THE ULTRA-GLASS CARD --- */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-6xl min-h-[650px] grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/40"
        style={{
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(255, 255, 255, 0.25)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        }}
      >

        {/* LEFT SIDE: Info Panel (Semi-Transparent White) */}
        <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden">
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0" />

          <div className="relative z-10">
            <div className="mb-2 flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <ShieldCheck size={24} />
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-wide">{t('brandTitle')}</span>
            </div>

            <h1 className="text-5xl font-extrabold text-slate-900 leading-[1.15] mb-6">
              {t('brandTitle')} <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {t('brandHighlight')}
              </span>
            </h1>
            <p className="text-lg text-slate-700 font-medium leading-relaxed max-w-sm">
              {t('brandSubtitle')}
            </p>
          </div>

          <div className="relative z-10 space-y-6 mt-12">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 border border-white/60 shadow-sm hover:bg-white/70 transition-colors cursor-default">
              <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{t('liveTracking')}</h3>
                <p className="text-xs text-slate-600 font-medium">{t('liveTrackingDesc')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 border border-white/60 shadow-sm hover:bg-white/70 transition-colors cursor-default">
              <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                <Lock size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{t('secureData')}</h3>
                <p className="text-xs text-slate-600 font-medium">{t('secureDataDesc')}</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 text-sm font-semibold text-slate-600">
            {t('copyright')}
          </div>
        </div>

        {/* RIGHT SIDE: Login Form (Cleaner Glass) */}
        <div className="flex items-center justify-center p-8 lg:p-16 relative bg-white/60 backdrop-blur-3xl">
          {/* Subtle pattern to add texture to the form side */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#444cf7_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="w-full max-w-md relative z-10">
            <div className="lg:hidden mb-8 text-center">
              <h1 className="text-3xl font-extrabold text-slate-900">{t('brandTitle')}</h1>
            </div>

            <LoginForm />

            <div className="mt-8 text-center lg:hidden">
              <p className="text-slate-600">{t('noAccount')} <Link href="/register" className="text-blue-600 font-bold hover:underline">{t('signUp')}</Link></p>
            </div>
            <div className="hidden lg:block mt-8 text-center">
              <p className="text-slate-600">
                {t('newToPlatform')} <Link href="/register" className="text-blue-600 font-bold hover:underline">{t('createAccount')}</Link>
              </p>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}