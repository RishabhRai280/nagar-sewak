// frontend/app/register/page.tsx
"use client";

import RegisterForm from '../../components/auth/RegisterForm';
import { Shield, MapPin, Users, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function RegisterPageWrapper() {
  const t = useTranslations('auth.register');

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 lg:p-8 overflow-hidden bg-slate-50">

      {/* --- EMERALD/TEAL THEMED BLOBS --- */}
      <div className="absolute inset-0 w-full h-full">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-emerald-300 rounded-full blur-[120px] opacity-40 mix-blend-multiply"
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 -left-20 w-[500px] h-[500px] bg-teal-300 rounded-full blur-[120px] opacity-40 mix-blend-multiply"
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 30, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 w-[400px] h-[400px] bg-blue-200 rounded-full blur-[100px] opacity-40 mix-blend-multiply"
        />
      </div>

      {/* --- ULTRA-GLASS CONTAINER --- */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-6xl min-h-[700px] grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/40"
        style={{
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(255, 255, 255, 0.25)",
          boxShadow: "0 8px 32px 0 rgba(16, 185, 129, 0.1)", // Emerald tinted shadow
        }}
      >

        {/* LEFT SIDE: Register Form (Glass Background) */}
        <div className="flex items-center justify-center p-8 lg:p-12 bg-white/60 backdrop-blur-3xl relative order-2 lg:order-1">
          {/* Dot Pattern Texture */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="w-full max-w-md relative z-10">
            {/* Mobile Header */}
            <div className="lg:hidden mb-6">
              <h1 className="text-2xl font-extrabold text-slate-900">Nagar Sewak</h1>
            </div>

            <RegisterForm />

            <div className="mt-6 text-center">
              <p className="text-slate-600 text-sm">
                {t('haveAccount')} <Link href="/login" className="text-emerald-600 font-bold hover:underline">{t('loginHere')}</Link>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Value Proposition (Emerald Gradient) */}
        <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden order-1 lg:order-2">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 backdrop-blur-sm z-0" />

          <div className="relative z-10">
            <div className="mb-2 flex items-center gap-2">
              <div className="p-2 bg-emerald-600 rounded-lg text-white">
                <Users size={24} />
              </div>
              <span className="text-xl font-bold text-emerald-900 tracking-wide">{t('citizenPortal')}</span>
            </div>

            <h1 className="text-5xl font-extrabold text-slate-900 leading-[1.15] mb-6">
              {t('joinMovementTitle')} <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {t('joinMovementHighlight')}
              </span>
            </h1>
            <p className="text-lg text-slate-700 font-medium leading-relaxed">
              {t('becomeParticipant')}
            </p>
          </div>

          <div className="relative z-10 space-y-6 mt-12">
            {[
              { icon: MapPin, title: t('geoTaggedReports'), desc: t('pinpointIssues') },
              { icon: Shield, title: t('fullAccountability'), desc: t('rateQuality') },
              { icon: Users, title: t('transparentData'), desc: t('viewBudgets') },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 border border-white/60 shadow-sm hover:bg-white/70 transition-colors cursor-default">
                <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                  <item.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-8 flex items-center gap-2 text-sm font-semibold text-slate-600">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{t('joinActiveCitizens')}</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
}