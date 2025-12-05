'use client';

import { usePathname } from '@/navigation';
import Header from './Header';
import Footer from './Footer';

export default function DynamicLayoutRenderer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMapPage = pathname === '/map';
  const isDashboardPage = pathname.includes('/dashboard');

  return (
    <>
      <Header />

      {/* No padding for dashboard pages (they have their own layout with sidebar) or map page (full-screen) */}
      <main className={isDashboardPage || isMapPage ? '' : 'pt-16'}>
        {children}
      </main>

      {!isMapPage && <Footer />}
    </>
  );
}