"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationBadgeProps {
  onClick: () => void;
}

export default function NotificationBadge({ onClick }: NotificationBadgeProps) {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
    
    // Poll for updates every 5 seconds for demo
    const interval = setInterval(fetchUnreadCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      // le_bhai_mock_hai - Mock data for now
      const mockCount = 3;
      
      console.log("Unread count (mock):", mockCount);
      
      if (mockCount > count) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 500);
      }
      
      setCount(mockCount);
      
      /* Real API call - uncomment when backend is ready
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, skipping notification fetch");
        return;
      }

      const response = await fetch("http://localhost:8080/api/notifications/unread-count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const newCount = data.count;
        
        console.log("Unread count:", newCount);
        
        if (newCount > count) {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 500);
        }
        
        setCount(newCount);
      } else {
        console.error("Failed to fetch unread count, status:", response.status);
      }
      */
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const handleClick = () => {
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className="relative p-2 hover:bg-gray-100 rounded-full transition"
      aria-label="Notifications"
    >
      <motion.div
        animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Bell size={20} className="text-gray-700" />
      </motion.div>
      
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
          >
            {count > 99 ? "99+" : count}
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
