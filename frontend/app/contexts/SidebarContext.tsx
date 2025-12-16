"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  // Persist sidebar state in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) {
      try {
        setCollapsed(JSON.parse(saved));
      } catch (error) {
        // If there's an error parsing, reset to default
        localStorage.removeItem('sidebar-collapsed');
        setCollapsed(false);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  // Add a global function to reset sidebar state (for debugging)
  useEffect(() => {
    (window as any).resetSidebar = () => {
      localStorage.removeItem('sidebar-collapsed');
      setCollapsed(false);
      console.log('Sidebar state reset to expanded');
    };
  }, []);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggleCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}