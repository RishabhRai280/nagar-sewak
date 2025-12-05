// frontend/app/[locale]/register/page.tsx
"use client";

import RegisterForm from '../../components/auth/RegisterForm';
import { Shield, MapPin, Users, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function RegisterPageWrapper() {
  const t = useTranslations('auth.register');

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 lg:p-8 overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40">

      {/* --- EMERALD/TEAL ANIMATED BLOBS --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, -60, 0],
            y: [0, -70, 50, 0],
            scale: [1, 1.3, 1.1, 1],
            rotate: [0, 120, 240, 360]
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -right-32 w-[700px] h-[700px] bg-gradient-to-br from-emerald-400 to-teal-300 rounded-full blur-[140px] opacity-50"
        />
        <motion.div
          animate={{
            x: [0, -90, 70, 0],
            y: [0, 90, -50, 0],
            scale: [1, 1.2, 1.4, 1],
            rotate: [360, 240, 120, 0]
          }}
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 -left-32 w-[650px] h-[650px] bg-gradient-to-br from-teal-400 to-cyan-300 rounded-full blur-[140px] opacity-45"
        />
        <motion.div
          animate={{
            x: [0, 60, -30, 0],
            y: [0, 70, -35, 0],
            scale: [1, 1.4, 1.2, 1]
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 w-[550px] h-[550px] bg-gradient-to-br from-blue-300 to-emerald-300 rounded-full blur-[130px] opacity-40"
        />
      </div>

      {/* --- ULTRA-PREMIUM GLASS CONTAINER --- */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-6xl min-h-[750px] grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/50"
        style={{
          backdropFilter: "blur(24px) saturate(180%)",
          backgroundColor: "rgba(255, 255, 255, 0.35)",
          boxShadow: "0 8px 32px 0 rgba(16, 185, 129, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)",
        }}
      >

        {/* LEFT SIDE: Register Form (Glass Background) */}
        <div className="flex items-center justify-center p-8 lg:p-12 xl:p-14 bg-white/70 backdrop-blur-3xl relative order-2 lg:order-1">
          {/* Dot Pattern Texture */}
          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,rgb(16,185,129)_1px,transparent_0)] [background-size:20px_20px]" />

          {/* Decorative Gradient Orb */}
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full max-w-md relative z-10"
          >
            {/* Mobile Header */}
            <div className="lg:hidden mb-6 text-center">
              <h1 className="text-4xl font-black text-slate-900 mb-2">Nagar Sewak</h1>
              <p className="text-slate-600 font-medium">Join the Movement</p>
            </div>

            <RegisterForm />

            <div className="mt-6 text-center">
              <p className="text-slate-600 text-sm font-medium">
                {t('haveAccount')}{' '}
                <Link href="/login" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline transition-colors">
                  {t('signIn')}
                </Link>
              </p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE: Value Proposition (Emerald Theme) */}
        <div className="hidden lg:flex flex-col justify-between p-12 xl:p-16 relative overflow-hidden order-1 lg:order-2">
          {/* Gradient Overlay with Mesh Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-teal-50/70 to-white/60 backdrop-blur-md z-0" />
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,rgb(16,185,129)_1px,transparent_0)] [background-size:24px_24px]" />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-4 flex items-center gap-3"
            >
              <div className="p-2.5 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl text-white shadow-lg shadow-emerald-500/30">
                <Users size={28} strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-black text-emerald-900 tracking-tight">{t('citizenPortal')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-5xl xl:text-6xl font-black text-slate-900 leading-[1.1] mb-6"
            >
              {t('joinMovementTitle')} <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                {t('joinMovementHighlight')}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg text-slate-700 font-semibold leading-relaxed max-w-md"
            >
              {t('becomeParticipant')}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="relative z-10 space-y-4 mt-12"
          >
            {[
              { icon: MapPin, title: t('geoTaggedReports'), desc: t('pinpointIssues'), color: 'from-emerald-500 to-teal-500' },
              { icon: Shield, title: t('fullAccountability'), desc: t('rateQuality'), color: 'from-teal-500 to-cyan-500' },
              { icon: TrendingUp, title: t('transparentData'), desc: t('viewBudgets'), color: 'from-cyan-500 to-blue-500' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, x: -4 }}
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
            <Sparkles size={16} className="text-emerald-600" />
            <span>{t('joinActiveCitizens')}</span>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}