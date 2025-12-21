'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { X, AlertTriangle, Shield, Clock } from 'lucide-react';

interface SecurityAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertType: 'login_attempts' | 'account_locked' | 'new_device' | 'security_breach';
  data?: {
    attemptCount?: number;
    lockoutTime?: string;
    deviceInfo?: string;
    ipAddress?: string;
    location?: string;
  };
}

export default function SecurityAlertModal({ 
  isOpen, 
  onClose, 
  alertType, 
  data = {} 
}: SecurityAlertModalProps) {
  const t = useTranslations('security');

  if (!isOpen) return null;

  const getAlertIcon = () => {
    switch (alertType) {
      case 'login_attempts':
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      case 'account_locked':
        return <Shield className="w-8 h-8 text-red-500" />;
      case 'new_device':
        return <AlertTriangle className="w-8 h-8 text-blue-500" />;
      case 'security_breach':
        return <AlertTriangle className="w-8 h-8 text-red-600" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-gray-500" />;
    }
  };

  const getAlertTitle = () => {
    switch (alertType) {
      case 'login_attempts':
        return t('alerts.loginAttempts.title');
      case 'account_locked':
        return t('alerts.accountLocked.title');
      case 'new_device':
        return t('alerts.newDevice.title');
      case 'security_breach':
        return t('alerts.securityBreach.title');
      default:
        return t('alerts.general.title');
    }
  };

  const getAlertMessage = () => {
    switch (alertType) {
      case 'login_attempts':
        return t('alerts.loginAttempts.message', { 
          count: data.attemptCount || 0,
          remaining: 5 - (data.attemptCount || 0)
        });
      case 'account_locked':
        return t('alerts.accountLocked.message', { 
          lockoutTime: data.lockoutTime || '15 minutes'
        });
      case 'new_device':
        return t('alerts.newDevice.message', {
          device: data.deviceInfo || 'Unknown Device',
          location: data.location || 'Unknown Location'
        });
      case 'security_breach':
        return t('alerts.securityBreach.message');
      default:
        return t('alerts.general.message');
    }
  };

  const getActionButtons = () => {
    switch (alertType) {
      case 'login_attempts':
        return (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={t('alerts.actions.understood')}
            >
              {t('alerts.actions.understood')}
            </button>
            <button
              onClick={() => {
                // Reset password action
                window.location.href = '/reset-password';
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label={t('alerts.actions.resetPassword')}
            >
              {t('alerts.actions.resetPassword')}
            </button>
          </div>
        );
      case 'account_locked':
        return (
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label={t('alerts.actions.understood')}
            >
              {t('alerts.actions.understood')}
            </button>
            <button
              onClick={() => {
                window.location.href = '/contact-support';
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label={t('alerts.actions.contactSupport')}
            >
              {t('alerts.actions.contactSupport')}
            </button>
          </div>
        );
      case 'new_device':
        return (
          <div className="flex gap-3">
            <button
              onClick={() => {
                // Confirm device action
                // This would call an API to mark the device as trusted
                onClose();
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label={t('alerts.actions.confirmDevice')}
            >
              {t('alerts.actions.confirmDevice')}
            </button>
            <button
              onClick={() => {
                // Deny device action
                // This would call an API to revoke the session
                onClose();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label={t('alerts.actions.denyDevice')}
            >
              {t('alerts.actions.denyDevice')}
            </button>
          </div>
        );
      default:
        return (
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={t('alerts.actions.close')}
          >
            {t('alerts.actions.close')}
          </button>
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="security-alert-title"
      aria-describedby="security-alert-description"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getAlertIcon()}
            <h2 
              id="security-alert-title"
              className="text-xl font-semibold text-gray-900"
            >
              {getAlertTitle()}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
            aria-label={t('alerts.actions.close')}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p 
            id="security-alert-description"
            className="text-gray-700 leading-relaxed"
          >
            {getAlertMessage()}
          </p>
          
          {/* Additional details */}
          {data.ipAddress && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>{t('alerts.details.ipAddress')}:</strong> {data.ipAddress}
              </p>
              {data.location && (
                <p className="text-sm text-gray-600 mt-1">
                  <strong>{t('alerts.details.location')}:</strong> {data.location}
                </p>
              )}
            </div>
          )}

          {/* Lockout timer for account locked */}
          {alertType === 'account_locked' && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{t('alerts.accountLocked.timer', { time: data.lockoutTime || '15:00' })}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          {getActionButtons()}
        </div>
      </div>
    </div>
  );
}