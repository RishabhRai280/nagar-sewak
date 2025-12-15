'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface LoginAttemptInfo {
  attemptCount: number;
  isLocked: boolean;
  lockoutTime?: string;
  remainingAttempts: number;
}

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

interface SecurityNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
}

interface SecurityPreferences {
  emailNotifications: boolean;
  securityAlerts: boolean;
  accountActivity: boolean;
  newDeviceLogins: boolean;
}

export function useSecurity() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<SecurityNotification[]>([]);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [securityModalData, setSecurityModalData] = useState<any>(null);
  const [securityModalType, setSecurityModalType] = useState<string>('');

  // Check login attempt status
  const checkLoginAttempts = useCallback(async (email: string): Promise<LoginAttemptInfo> => {
    try {
      const response = await fetch(`/api/auth/login-attempts?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check login attempts');
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking login attempts:', error);
      return {
        attemptCount: 0,
        isLocked: false,
        remainingAttempts: 5
      };
    }
  }, []);

  // Enhanced login with security checks
  const secureLogin = useCallback(async (email: string, password: string) => {
    try {
      // Check login attempts before attempting login
      const attemptInfo = await checkLoginAttempts(email);
      
      if (attemptInfo.isLocked) {
        showSecurityAlert('account_locked', {
          lockoutTime: attemptInfo.lockoutTime,
          attempts: attemptInfo.attemptCount
        });
        return { success: false, locked: true };
      }

      // Show warning if approaching lockout
      if (attemptInfo.attemptCount >= 2) {
        showSecurityAlert('login_attempts', {
          attemptCount: attemptInfo.attemptCount,
          remainingAttempts: attemptInfo.remainingAttempts
        });
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Check for new device login
        if (result.newDevice) {
          showDeviceConfirmation(result.deviceInfo);
          return { success: true, newDevice: true, deviceInfo: result.deviceInfo };
        }

        addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: 'Login Successful',
          message: 'Welcome back!',
          autoClose: true,
          duration: 3000
        });

        return { success: true };
      } else {
        // Handle failed login with specific messages
        const attemptCount = result.attemptCount || 0;
        const remainingAttempts = Math.max(0, 5 - attemptCount);
        
        if (result.error === 'ACCOUNT_LOCKED') {
          showSecurityAlert('account_locked', {
            lockoutTime: result.lockoutTime || '15 minutes',
            attempts: attemptCount
          });
        } else if (result.error === 'INVALID_CREDENTIALS') {
          // Simple message based on remaining attempts
          const message = remainingAttempts > 1 
            ? `Invalid email or password. ${remainingAttempts} attempts remaining.`
            : 'Invalid email or password. Final attempt before lockout.';
          
          addNotification({
            id: Date.now().toString(),
            type: remainingAttempts <= 1 ? 'error' : 'warning',
            title: remainingAttempts <= 1 ? 'Final Warning' : 'Login Failed',
            message,
            autoClose: false,
            actions: remainingAttempts <= 2 ? [
              {
                label: 'Reset Password',
                onClick: () => router.push('/reset-password'),
                variant: 'primary'
              }
            ] : undefined
          });
        }

        return { success: false, error: result.error, attemptCount, remainingAttempts };
      }
    } catch (error) {
      console.error('Login error:', error);
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Connection Error',
        message: 'Unable to connect. Please check your internet connection.',
        autoClose: false,
        actions: [
          {
            label: 'Retry',
            onClick: () => window.location.reload(),
            variant: 'primary'
          }
        ]
      });
      return { success: false, error: 'NETWORK_ERROR' };
    }
  }, [checkLoginAttempts, router]);

  // Confirm device
  const confirmDevice = useCallback(async (deviceId: string, trustDevice: boolean = false) => {
    try {
      const response = await fetch('/api/auth/confirm-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deviceId, trustDevice }),
      });

      if (!response.ok) {
        throw new Error('Failed to confirm device');
      }

      const result = await response.json();

      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Device Confirmed',
        message: trustDevice ? 'Device has been added to your trusted devices.' : 'Device access confirmed.',
        autoClose: true,
        duration: 3000
      });

      return result;
    } catch (error) {
      console.error('Error confirming device:', error);
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Confirmation Failed',
        message: 'Failed to confirm device. Please try again.',
        autoClose: true,
        duration: 5000
      });
      throw error;
    }
  }, []);

  // Deny device access
  const denyDevice = useCallback(async (deviceId: string) => {
    try {
      const response = await fetch('/api/auth/deny-device', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deviceId }),
      });

      if (!response.ok) {
        throw new Error('Failed to deny device');
      }

      addNotification({
        id: Date.now().toString(),
        type: 'warning',
        title: 'Device Access Denied',
        message: 'The device has been denied access and the session has been revoked.',
        autoClose: true,
        duration: 5000,
        actions: [
          {
            label: 'Change Password',
            onClick: () => router.push('/reset-password'),
            variant: 'primary'
          }
        ]
      });

      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Error denying device:', error);
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Action Failed',
        message: 'Failed to deny device access. Please contact support.',
        autoClose: true,
        duration: 5000
      });
      throw error;
    }
  }, [router]);

  // Get security preferences
  const getSecurityPreferences = useCallback(async (): Promise<SecurityPreferences> => {
    try {
      const response = await fetch('/api/user/security-preferences', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get security preferences');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting security preferences:', error);
      // Return default preferences
      return {
        emailNotifications: true,
        securityAlerts: true,
        accountActivity: true,
        newDeviceLogins: true
      };
    }
  }, []);

  // Update security preferences
  const updateSecurityPreferences = useCallback(async (preferences: Partial<SecurityPreferences>) => {
    try {
      const response = await fetch('/api/user/security-preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to update security preferences');
      }

      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Preferences Updated',
        message: 'Your security preferences have been updated successfully.',
        autoClose: true,
        duration: 3000
      });

      return await response.json();
    } catch (error) {
      console.error('Error updating security preferences:', error);
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update security preferences. Please try again.',
        autoClose: true,
        duration: 5000
      });
      throw error;
    }
  }, []);

  // Get security audit log
  const getSecurityAuditLog = useCallback(async (page: number = 0, size: number = 20) => {
    try {
      const response = await fetch(`/api/user/security-audit?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get security audit log');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting security audit log:', error);
      return { content: [], totalElements: 0, totalPages: 0 };
    }
  }, []);

  // Show security alert modal
  const showSecurityAlert = useCallback((alertType: string, data: any = {}) => {
    setSecurityModalType(alertType);
    setSecurityModalData(data);
    setIsSecurityModalOpen(true);
  }, []);

  // Show device confirmation dialog
  const showDeviceConfirmation = useCallback((deviceInfo: DeviceInfo) => {
    setSecurityModalType('device_confirmation');
    setSecurityModalData(deviceInfo);
    setIsSecurityModalOpen(true);
  }, []);

  // Close security modal
  const closeSecurityModal = useCallback(() => {
    setIsSecurityModalOpen(false);
    setSecurityModalData(null);
    setSecurityModalType('');
  }, []);

  // Add notification
  const addNotification = useCallback((notification: SecurityNotification) => {
    setNotifications(prev => [...prev, notification]);
  }, []);

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Listen for security events (WebSocket or polling)
  useEffect(() => {
    // This would typically connect to a WebSocket or set up polling
    // for real-time security notifications
    const checkSecurityEvents = async () => {
      try {
        const response = await fetch('/api/user/security-events', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const events = await response.json();
          events.forEach((event: any) => {
            if (event.type === 'NEW_DEVICE_LOGIN') {
              showDeviceConfirmation(event.deviceInfo);
            } else if (event.type === 'SUSPICIOUS_ACTIVITY') {
              showSecurityAlert('security_breach', event.data);
            }
          });
        }
      } catch (error) {
        console.error('Error checking security events:', error);
      }
    };

    // Check for security events every 30 seconds
    const interval = setInterval(checkSecurityEvents, 30000);

    return () => clearInterval(interval);
  }, [showSecurityAlert, showDeviceConfirmation]);

  return {
    // State
    notifications,
    isSecurityModalOpen,
    securityModalData,
    securityModalType,

    // Actions
    secureLogin,
    confirmDevice,
    denyDevice,
    checkLoginAttempts,
    getSecurityPreferences,
    updateSecurityPreferences,
    getSecurityAuditLog,
    showSecurityAlert,
    showDeviceConfirmation,
    closeSecurityModal,
    addNotification,
    removeNotification,
    clearNotifications,
  };
}