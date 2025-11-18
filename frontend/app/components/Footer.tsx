import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Github, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Live Map', href: '/map' },
      { name: 'Report Issue', href: '/report' },
      { name: 'Dashboard', href: '/dashboard/citizen' },
      { name: 'Features', href: '/#features' },
    ],
    resources: [
      { name: 'Documentation', href: '#' },
      { name: 'API Guide', href: '#' },
      { name: 'Help Center', href: '#' },
      { name: 'Community', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Contact', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
    ],
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-auto">
      {/* Newsletter Section */}
      <div className="border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-slate-400">Get the latest news about projects and community governance</p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-[1.02]">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                NagarSewak
              </div>
            </Link>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Empowering citizens and improving governance through transparent, real-time civic engagement and accountability.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-blue-400 transition text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-blue-400 transition text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-blue-400 transition text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-slate-700 pt-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-3 text-slate-400 hover:text-blue-400 transition">
              <Mail size={18} className="text-blue-400 flex-shrink-0" />
              <span>support@nagarsewak.gov.in</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 hover:text-blue-400 transition">
              <Phone size={18} className="text-blue-400 flex-shrink-0" />
              <span>+91 1800-NAGAR-1</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400 hover:text-blue-400 transition">
              <MapPin size={18} className="text-blue-400 flex-shrink-0" />
              <span>Across India</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
          <p>&copy; {currentYear} Nagar Sewak. All rights reserved.</p>
          <p className="mt-2 text-xs flex items-center justify-center gap-1">
            Built with <Heart size={14} className="text-red-500 fill-red-500" /> for transparent governance and citizen empowerment.
          </p>
        </div>
      </div>
    </footer>
  );
}