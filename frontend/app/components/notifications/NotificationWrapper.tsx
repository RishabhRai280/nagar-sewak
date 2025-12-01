"use client";

import { useState } from "react";
import NotificationBadge from "./NotificationBadge";
import NotificationCenter from "./NotificationCenter";

export default function NotificationWrapper() {
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);

  return (
    <>
      <NotificationBadge onClick={() => setNotificationCenterOpen(true)} />
      <NotificationCenter 
        isOpen={notificationCenterOpen} 
        onClose={() => setNotificationCenterOpen(false)}
        onNotificationRead={() => {
          // This will trigger the badge to refresh
        }}
      />
    </>
  );
}
