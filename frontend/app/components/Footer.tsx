"use client";

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Github, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  const footerLinks = {
    platform: [
      { name: tNav('map'), href: '/map' },
      { name: tNav('report'), href: '/report' },
      { name: tNav('dashboard'), href: '/dashboard/citizen' },
      { name: t('features'), href: '/#features' },
    ],
    resources: [
      { name: t('documentation'), href: '#' },
      { name: t('apiGuide'), href: '#' },
      { name: t('helpCenter'), href: '#' },
      { name: t('community'), href: '#' },
    ],
    company: [
      { name: t('about'), href: '#' },
      { name: t('contact'), href: '#' },
      { name: t('privacy'), href: '#' },
      { name: t('terms'), href: '#' },
    ],
  };

  return (
    <footer className="relative bg-slate-950 text-slate-300 overflow-hidden mt-auto border-t border-slate-800/50">

      {/* --- ANIMATED BACKGROUND BLOBS (Dark Mode) --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[100px] opacity-10"
        />
        <motion.div
          animate={{ x: [0, 50, 0], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px] opacity-10"
        />
        <motion.div
          animate={{ y: [0, -30, 0], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900 rounded-full blur-[120px] opacity-5"
        />
      </div>

      {/* --- GLASS OVERLAY --- */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl z-0" />

      {/* --- CONTENT --- */}
      <div className="relative z-10">

        {/* Newsletter Section */}
        <div className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2 text-white">{t('stayUpdated')}</h3>
                <p className="text-slate-400">{t('stayUpdatedDesc')}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  className="flex-1 px-5 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all backdrop-blur-md"
                />
                <button className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-600/20 transition transform hover:scale-[1.02] flex items-center justify-center gap-2">
                  {t('subscribe')} <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-12">

            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent group-hover:brightness-110 transition-all">
                  NagarSewak
                </div>
              </Link>
              <p className="text-slate-400 leading-relaxed max-w-sm">
                {t('description')}
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Facebook, label: "Facebook" },
                  { icon: Twitter, label: "Twitter" },
                  { icon: Linkedin, label: "LinkedIn" },
                  { icon: Github, label: "GitHub" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300 group"
                    aria-label={social.label}
                  >
                    <social.icon size={18} className="text-slate-400 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            {[
              { title: "Platform", links: footerLinks.platform },
              { title: "Resources", links: footerLinks.resources },
              { title: "Company", links: footerLinks.company },
            ].map((column, idx) => (
              <div key={idx}>
                <h3 className="text-lg font-bold mb-6 text-white">{column.title}</h3>
                <ul className="space-y-4">
                  {column.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-slate-400 hover:text-blue-400 transition-colors text-sm font-medium flex items-center gap-1 group"
                      >
                        <span className="w-0 group-hover:w-2 h-[1px] bg-blue-400 transition-all duration-300"></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="border-t border-white/10 pt-8 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center gap-3 text-slate-400 group cursor-default">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition">
                  <Mail size={16} className="text-blue-400" />
                </div>
                <span>support@nagarsewak.gov.in</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 group cursor-default">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition">
                  <Phone size={16} className="text-blue-400" />
                </div>
                <span>+91 1800-NAGAR-1</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 group cursor-default">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition">
                  <MapPin size={16} className="text-blue-400" />
                </div>
                <span>Across India</span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-sm text-slate-500">
              {t('copyright')}
            </p>
            <p className="mt-3 text-xs text-slate-600 flex items-center justify-center gap-1.5">
              {t('builtWith')} <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" /> {t('forGovernance')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}