"use client";

import { useState, useEffect } from "react";
import { X, Bell, Trash2, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Notification {
  id: number;
  type: string;
  priority: string;
  title: string;
  message: string;
  actionUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationRead: () => void;
}

export default function NotificationCenter({ isOpen, onClose, onNotificationRead }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications(0);
    }
  }, [isOpen]);

  const fetchNotifications = async (pageNum: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, skipping notification fetch");
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:8080/api/notifications?page=${pageNum}&size=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (pageNum === 0) {
          setNotifications(data.content);
        } else {
          setNotifications((prev) => [...prev, ...data.content]);
        }
        setHasMore(!data.last);
        setPage(pageNum);
      } else {
        console.error("Failed to fetch notifications, status:", response.status);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`http://localhost:8080/api/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        onNotificationRead();
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://localhost:8080/api/notifications/read-all", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        onNotificationRead();
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`http://localhost:8080/api/notifications/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        onNotificationRead();
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      onClose();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-100 text-red-700 border-red-200";
      case "HIGH":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "MEDIUM":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center gap-2">
                <Bell size={20} />
                <h2 className="text-lg font-bold">Notifications</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Actions */}
            <div className="p-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-2">
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");
                    if (!token) {
                      alert("Please login to create test notifications");
                      return;
                    }

                    const response = await fetch("http://localhost:8080/api/notifications/test", {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    });
                    
                    if (response.ok) {
                      fetchNotifications(0);
                      onNotificationRead();
                    } else {
                      console.error("Failed to create test notification");
                    }
                  } catch (error) {
                    console.error("Failed to create test notification:", error);
                  }
                }}
                className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium transition"
              >
                + Test
              </button>
              
              {notifications.some((n) => !n.isRead) && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <CheckCheck size={16} />
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {loading && page === 0 ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <Bell size={48} className="text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No notifications yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    We'll notify you when something important happens
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition cursor-pointer ${
                        !notification.isRead ? "bg-blue-50/50" : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {notification.actionUrl ? (
                        <Link href={notification.actionUrl} className="block">
                          <NotificationItem
                            notification={notification}
                            getPriorityColor={getPriorityColor}
                            formatTime={formatTime}
                            onDelete={deleteNotification}
                          />
                        </Link>
                      ) : (
                        <NotificationItem
                          notification={notification}
                          getPriorityColor={getPriorityColor}
                          formatTime={formatTime}
                          onDelete={deleteNotification}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {hasMore && !loading && notifications.length > 0 && (
                <div className="p-4 text-center">
                  <button
                    onClick={() => fetchNotifications(page + 1)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Load more
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function NotificationItem({
  notification,
  getPriorityColor,
  formatTime,
  onDelete,
}: {
  notification: Notification;
  getPriorityColor: (priority: string) => string;
  formatTime: (date: string) => string;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">
            {notification.title}
          </h3>
          {!notification.isRead && (
            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
          )}
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{notification.message}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(notification.priority)}`}>
            {notification.priority}
          </span>
          <span className="text-xs text-gray-400">{formatTime(notification.createdAt)}</span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDelete(notification.id);
        }}
        className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded transition flex-shrink-0"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
