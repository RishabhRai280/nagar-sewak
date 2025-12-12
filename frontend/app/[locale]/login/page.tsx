// frontend/app/[locale]/login/page.tsx
"use client";

import LoginForm from '../../components/auth/LoginForm';
import { Globe, Lock, Users, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('auth.login');

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 lg:p-8 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">

      {/* --- ENHANCED ANIMATED BACKGROUND BLOBS --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <motion.div
          animate={{
            x: [0, 120, -50, 0],
            y: [0, -80, 60, 0],
            scale: [1, 1.3, 1.1, 1],
            rotate: [0, 90, 180, 360]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[700px] h-[700px] bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full blur-[140px] opacity-50"
        />
        <motion.div
          animate={{
            x: [0, -120, 80, 0],
            y: [0, 100, -60, 0],
            scale: [1, 1.2, 1.4, 1],
            rotate: [360, 270, 90, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-purple-400 to-pink-300 rounded-full blur-[140px] opacity-40"
        />
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, 80, -40, 0],
            scale: [1, 1.4, 1.2, 1]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 left-1/4 w-[650px] h-[650px] bg-gradient-to-br from-indigo-400 to-blue-300 rounded-full blur-[140px] opacity-45"
        />
      </div>

      {/* --- ULTRA-PREMIUM GLASS CARD --- */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-6xl min-h-[680px] grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/50"
        style={{
          backdropFilter: "blur(24px) saturate(180%)",
          backgroundColor: "rgba(255, 255, 255, 0.35)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)",
        }}
      >

        {/* LEFT SIDE: Info Panel with Enhanced Glassmorphism */}
        <div className="hidden lg:flex flex-col justify-between p-12 xl:p-16 relative overflow-hidden">
          {/* Gradient Overlay with Mesh Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30 backdrop-blur-md z-0" />
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,rgb(59,130,246)_1px,transparent_0)] [background-size:24px_24px]" />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-4 flex items-center gap-3"
            >
              <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg shadow-blue-500/30">
                <ShieldCheck size={28} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">Nagar Sewak</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-5xl xl:text-6xl font-black text-slate-900 leading-[1.1] mb-6"
            >
              {t('brandTitle')} <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t('brandHighlight')}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg text-slate-700 font-semibold leading-relaxed max-w-md"
            >
              {t('brandSubtitle')}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="relative z-10 space-y-4 mt-12"
          >
            {[
              { icon: Globe, title: t('liveTracking'), desc: t('liveTrackingDesc'), color: 'from-blue-500 to-cyan-500' },
              { icon: Lock, title: t('secureData'), desc: t('secureDataDesc'), color: 'from-purple-500 to-pink-500' },
              { icon: Users, title: t('communityDriven'), desc: t('communityDrivenDesc'), color: 'from-indigo-500 to-blue-500' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white/60 border border-white/80 shadow-lg hover:shadow-xl transition-all duration-300 cursor-default backdrop-blur-sm"
              >
                <div className={`bg-gradient-to-br ${item.color} p-3.5 rounded-xl text-white shadow-lg`}>
                  <item.icon size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="relative z-10 mt-8 flex items-center gap-2 text-sm font-semibold text-slate-600"
          >
            <Sparkles size={16} className="text-blue-600" />
            <span>© 2025 Nagar Sewak. All rights reserved.</span>
          </motion.div>
        </div>

        {/* RIGHT SIDE: Login Form with Enhanced Glass Effect */}
        <div className="flex items-center justify-center p-8 lg:p-12 xl:p-16 relative bg-white/70 backdrop-blur-3xl">
          {/* Subtle Dot Pattern */}
          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,rgb(99,102,241)_1px,transparent_0)] [background-size:20px_20px]" />

          {/* Decorative Gradient Orb */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="lg:hidden mb-8 text-center">
              <h1 className="text-4xl font-black text-slate-900 mb-2">Nagar Sewak</h1>
              <p className="text-slate-600 font-medium">Smart Governance Platform</p>
            </div>

            <LoginForm />

            <div className="mt-8 text-center">
              <p className="text-slate-600 font-medium">
                {t('newToPlatform')}{' '}
                <Link href="/register" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors">
                  {t('createAccount')}
                </Link>
              </p>
            </div>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}