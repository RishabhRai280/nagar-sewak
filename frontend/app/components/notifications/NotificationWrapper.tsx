"use client";

import { useState } from "react";
import NotificationBadge from "./NotificationBadge";
import NotificationCenter from "./NotificationCenter";

export default function NotificationWrapper() {
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleNotificationRead = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <NotificationBadge
        onClick={() => setNotificationCenterOpen(true)}
        refreshTrigger={refreshTrigger}
      />
      <NotificationCenter
        isOpen={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
        onNotificationRead={handleNotificationRead}
      />
    </>
  );
}
