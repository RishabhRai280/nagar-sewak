import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "../globals.css";
// NOTE: Header and Footer imports moved to DynamicLayoutRenderer
// import Header from '../components/Header'; 
// import Footer from '../components/Footer'; 
import DynamicLayoutRenderer from "../components/shared/DynamicLayoutRenderer";
import { ErrorBoundary } from "../components/shared/ErrorBoundary";
import { SidebarProvider } from "../contexts/SidebarContext";
import { AccessibilityProvider } from "../contexts/AccessibilityContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nagar Sewak - Civic Engagement Platform",
  description: "Report civic issues, track projects, and engage with your local administration",
  keywords: "civic engagement, complaint management, local government, community platform",
  authors: [{ name: "Nagar Sewak Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#3b82f6",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ErrorBoundary>
            <AccessibilityProvider>
              <SidebarProvider>
                <DynamicLayoutRenderer>
                  {children}
                </DynamicLayoutRenderer>
              </SidebarProvider>
            </AccessibilityProvider>
          </ErrorBoundary>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}