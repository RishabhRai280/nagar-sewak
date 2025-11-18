import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// NOTE: Header and Footer imports moved to DynamicLayoutRenderer
// import Header from './components/Header'; 
// import Footer from './components/Footer'; 
import DynamicLayoutRenderer from './components/DynamicLayoutRenderer'; // <-- NEW IMPORT

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nagar Sewak - Citizen Governance Platform",
  description: "A civic-technology platform for transparent local development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <DynamicLayoutRenderer>
            {children}
        </DynamicLayoutRenderer>
      </body>
    </html>
  );
}