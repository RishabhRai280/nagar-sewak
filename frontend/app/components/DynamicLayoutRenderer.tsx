'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function DynamicLayoutRenderer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Check if the current page is the full-screen map
  const isMapPage = pathname === '/map';

  return (
    <>
      {/* Header is always rendered */}
      <Header />
      
      {/* Main content wrapper */}
      <main className={`flex-grow ${isMapPage ? 'p-0 m-0' : ''}`}>
        {children}
      </main>
      
      {/* Footer is conditionally rendered */}
      {!isMapPage && <Footer />}
    </>
  );
}