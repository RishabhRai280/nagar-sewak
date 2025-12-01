'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Wifi, WifiOff, Download, Trash2, HardDrive, RefreshCw } from 'lucide-react';
import {
  registerServiceWorker,
  unregisterServiceWorker,
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  isAppInstalled,
  getCacheSize,
  clearCache,
  syncOfflineData,
} from '@/lib/utils/pwa';

export default function PWASettings() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [swRegistered, setSwRegistered] = useState(false);
  const [cacheSize, setCacheSize] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsInstalled(isAppInstalled());
    setIsOnline(navigator.onLine);
    setNotificationPermission(Notification.permission);

    // Check if service worker is registered
    navigator.serviceWorker.getRegistration().then(reg => {
      setSwRegistered(!!reg);
    });

    // Update cache size
    updateCacheSize();

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateCacheSize = async () => {
    const size = await getCacheSize();
    setCacheSize(size);
  };

  const handleRegisterSW = async () => {
    setLoading(true);
    const registration = await registerServiceWorker();
    setSwRegistered(!!registration);
    setLoading(false);
  };

  const handleUnregisterSW = async () => {
    setLoading(true);
    const success = await unregisterServiceWorker();
    if (success) {
      setSwRegistered(false);
    }
    setLoading(false);
  };

  const handleEnableNotifications = async () => {
    setLoading(true);
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);

    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        // You'll need to replace this with your actual VAPID public key
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
        await subscribeToPushNotifications(registration, vapidKey);
      }
    }
    setLoading(false);
  };

  const handleDisableNotifications = async () => {
    setLoading(true);
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await unsubscribeFromPushNotifications(registration);
    }
    setLoading(false);
  };

  const handleClearCache = async () => {
    if (confirm('Are you sure you want to clear all cached data? This will remove offline content.')) {
      setLoading(true);
      await clearCache();
      await updateCacheSize();
      setLoading(false);
    }
  };

  const handleSyncData = async () => {
    setLoading(true);
    await syncOfflineData();
    setLoading(false);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">PWA Settings</h2>
        <p className="text-sm text-gray-600">
          Manage Progressive Web App features and offline capabilities
        </p>
      </div>

      {/* Installation Status */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isInstalled ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <Download className={`w-5 h-5 ${isInstalled ? 'text-green-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">App Installation</h3>
              <p className="text-sm text-gray-600">
                {isInstalled ? 'App is installed' : 'App is running in browser'}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isInstalled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {isInstalled ? 'Installed' : 'Not Installed'}
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isOnline ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isOnline ? (
                <Wifi className="w-5 h-5 text-green-600" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Connection Status</h3>
              <p className="text-sm text-gray-600">
                {isOnline ? 'Connected to internet' : 'Offline mode active'}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>

      {/* Service Worker */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              swRegistered ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <RefreshCw className={`w-5 h-5 ${swRegistered ? 'text-blue-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Service Worker</h3>
              <p className="text-sm text-gray-600">
                {swRegistered ? 'Offline support enabled' : 'Offline support disabled'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {!swRegistered ? (
            <button
              onClick={handleRegisterSW}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition"
            >
              Enable Offline Support
            </button>
          ) : (
            <button
              onClick={handleUnregisterSW}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:bg-red-400 transition"
            >
              Disable Offline Support
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              notificationPermission === 'granted' ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              {notificationPermission === 'granted' ? (
                <Bell className="w-5 h-5 text-blue-600" />
              ) : (
                <BellOff className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Push Notifications</h3>
              <p className="text-sm text-gray-600">
                {notificationPermission === 'granted' ? 'Notifications enabled' : 
                 notificationPermission === 'denied' ? 'Notifications blocked' : 
                 'Notifications not configured'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {notificationPermission !== 'granted' ? (
            <button
              onClick={handleEnableNotifications}
              disabled={loading || notificationPermission === 'denied'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition"
            >
              {notificationPermission === 'denied' ? 'Blocked by Browser' : 'Enable Notifications'}
            </button>
          ) : (
            <button
              onClick={handleDisableNotifications}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:bg-red-400 transition"
            >
              Disable Notifications
            </button>
          )}
        </div>
      </div>

      {/* Cache Management */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-100">
              <HardDrive className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Cached Data</h3>
              <p className="text-sm text-gray-600">
                {formatBytes(cacheSize)} stored locally
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleClearCache}
            disabled={loading || cacheSize === 0}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:bg-red-400 transition flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cache
          </button>
          <button
            onClick={handleSyncData}
            disabled={loading || !isOnline}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Sync Data
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="border-t border-gray-200 pt-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 About PWA Features</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• <strong>Offline Support:</strong> Access cached content without internet</li>
            <li>• <strong>Push Notifications:</strong> Get real-time updates on your complaints</li>
            <li>• <strong>Install App:</strong> Add to home screen for app-like experience</li>
            <li>• <strong>Background Sync:</strong> Your data syncs automatically when online</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
