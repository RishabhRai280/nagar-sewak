"use client";

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Github, Heart, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  // Official Government Links for Footer
  const govLinks = [
    { name: 'National Portal of India', href: 'https://india.gov.in' },
    { name: 'Digital India', href: 'https://digitalindia.gov.in' },
    { name: 'MyGov', href: 'https://mygov.in' },
    { name: 'Data.gov.in', href: 'https://data.gov.in' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 text-sm border-t-4 border-orange-500 mt-auto relative z-10">
      <div className="max-w-[1400px] mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Column 1: Brand & Desc */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex flex-col gap-2 mb-4">
              <span className="text-2xl font-bold text-white tracking-tight">NagarSewak</span>
              <span className="text-xs uppercase tracking-widest text-slate-400">Citizen Engagement Portal</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Empowering citizens with direct access to local governance, reporting, and civic tracking. A step towards transparent and efficient administration.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-slate-400 hover:text-white transition"><Twitter size={18} /></a>
              <a href="#" className="text-slate-400 hover:text-white transition"><Facebook size={18} /></a>
              <a href="#" className="text-slate-400 hover:text-white transition"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs border-b border-slate-700 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-blue-400 transition">{tNav('home')}</Link></li>
              <li><Link href="/map" className="hover:text-blue-400 transition">{tNav('map')}</Link></li>
              <li><Link href="/report" className="hover:text-blue-400 transition">{tNav('report')}</Link></li>
              <li><Link href="/dashboard/citizen" className="hover:text-blue-400 transition">{tNav('dashboard')}</Link></li>
            </ul>
          </div>

          {/* Column 3: Important External Links */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs border-b border-slate-700 pb-2 inline-block">Government</h3>
            <ul className="space-y-2">
              {govLinks.map(link => (
                <li key={link.name}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-orange-400 transition">
                    {link.name} <ExternalLink size={10} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-xs border-b border-slate-700 pb-2 inline-block">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-orange-500 mt-0.5" />
                <span>Ministry of Urban Affairs,<br />Nirman Bhawan, New Delhi</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-orange-500" />
                <span>1800-11-2025 (Toll Free)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-orange-500" />
                <span>helpdesk@nagarsewak.gov.in</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {currentYear} NagarSewak. All Content Owned by Government of India.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition">Terms of Use</Link>
            <Link href="#" className="hover:text-white transition">Accessibility Statement</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}