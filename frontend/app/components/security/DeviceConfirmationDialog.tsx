'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Monitor, Smartphone, Tablet, Globe, MapPin, Clock, Shield, AlertTriangle } from 'lucide-react';

interface DeviceInfo {
  id: string;
  deviceType: string;
  browserType: string;
  operatingSystem: string;
  ipAddress: string;
  location?: string;
  firstSeen: string;
  lastSeen: string;
  trusted: boolean;
}

interface DeviceConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  device: DeviceInfo;
  onConfirm: (deviceId: string, trustDevice: boolean) => Promise<void>;
  onDeny: (deviceId: string) => Promise<void>;
}

export default function DeviceConfirmationDialog({
  isOpen,
  onClose,
  device,
  onConfirm,
  onDeny
}: DeviceConfirmationDialogProps) {
  const t = useTranslations('security.deviceConfirmation');
  const [isLoading, setIsLoading] = useState(false);
  const [trustDevice, setTrustDevice] = useState(false);

  if (!isOpen) return null;

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-8 h-8 text-blue-500" />;
      case 'tablet':
        return <Tablet className="w-8 h-8 text-blue-500" />;
      case 'desktop':
      default:
        return <Monitor className="w-8 h-8 text-blue-500" />;
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(device.id, trustDevice);
      onClose();
    } catch (error) {
      console.error('Failed to confirm device:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeny = async () => {
    setIsLoading(true);
    try {
      await onDeny(device.id);
      onClose();
    } catch (error) {
      console.error('Failed to deny device:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="device-confirmation-title"
      aria-describedby="device-confirmation-description"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-100 rounded-full">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h2 
              id="device-confirmation-title"
              className="text-xl font-semibold text-gray-900"
            >
              {t('title')}
            </h2>
            <p className="text-sm text-gray-600">
              {t('subtitle')}
            </p>
          </div>
        </div>

        {/* Device Information */}
        <div 
          id="device-confirmation-description"
          className="bg-gray-50 rounded-lg p-4 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {getDeviceIcon(device.deviceType)}
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  {t('deviceDetails')}
                </h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('deviceType')}:</span>
                    <span className="font-medium">{device.deviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('browser')}:</span>
                    <span className="font-medium">{device.browserType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('operatingSystem')}:</span>
                    <span className="font-medium">{device.operatingSystem}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-3">
                <h4 className="font-medium text-gray-900 mb-2">
                  {t('locationInfo')}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{t('ipAddress')}:</span>
                    <span className="font-medium">{device.ipAddress}</span>
                  </div>
                  {device.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{t('location')}:</span>
                      <span className="font-medium">{device.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-3">
                <h4 className="font-medium text-gray-900 mb-2">
                  {t('timeInfo')}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{t('firstSeen')}:</span>
                    <span className="font-medium">{formatDateTime(device.firstSeen)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{t('lastSeen')}:</span>
                    <span className="font-medium">{formatDateTime(device.lastSeen)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">
                {t('securityNotice')}
              </h4>
              <p className="text-sm text-blue-800">
                {t('securityMessage')}
              </p>
            </div>
          </div>
        </div>

        {/* Trust Device Option */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={trustDevice}
              onChange={(e) => setTrustDevice(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={isLoading}
            />
            <div>
              <span className="text-sm font-medium text-gray-900">
                {t('trustDevice')}
              </span>
              <p className="text-xs text-gray-600">
                {t('trustDeviceDescription')}
              </p>
            </div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleDeny}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={t('denyAccess')}
          >
            {isLoading ? t('processing') : t('denyAccess')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={t('confirmAccess')}
          >
            {isLoading ? t('processing') : t('confirmAccess')}
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-gray-500 text-center">
            {t('helpText')}{' '}
            <a 
              href="/security-help" 
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('learnMore')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}