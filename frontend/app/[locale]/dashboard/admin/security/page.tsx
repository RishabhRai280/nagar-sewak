'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Shield, Users, AlertTriangle, Activity, Eye, Download, Filter, Search, Calendar } from 'lucide-react';

interface SecurityMetrics {
  totalUsers: number;
  activeUsers: number;
  lockedAccounts: number;
  suspiciousActivities: number;
  newDeviceLogins: number;
  failedLoginAttempts: number;
}

interface SecurityEvent {
  id: string;
  eventType: string;
  userId: string;
  username: string;
  timestamp: string;
  ipAddress: string;
  details: any;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface EmailMetrics {
  totalSent: number;
  delivered: number;
  failed: number;
  pending: number;
  securityAlerts: number;
  deviceConfirmations: number;
}

export default function AdminSecurityDashboard() {
  const t = useTranslations('dashboard.admin.security');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [emailMetrics, setEmailMetrics] = useState<EmailMetrics | null>(null);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<SecurityEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState<string>('7d');

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  useEffect(() => {
    filterEvents();
  }, [securityEvents, searchTerm, severityFilter, eventTypeFilter]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsRes, emailRes, eventsRes] = await Promise.all([
        fetch(`/api/admin/security/metrics?range=${dateRange}`),
        fetch(`/api/admin/security/email-metrics?range=${dateRange}`),
        fetch(`/api/admin/security/events?range=${dateRange}&limit=100`)
      ]);

      if (metricsRes.ok) {
        setMetrics(await metricsRes.json());
      }

      if (emailRes.ok) {
        setEmailMetrics(await emailRes.json());
      }

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setSecurityEvents(eventsData.content || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = securityEvents;

    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.ipAddress.includes(searchTerm) ||
        event.eventType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (severityFilter !== 'ALL') {
      filtered = filtered.filter(event => event.severity === severityFilter);
    }

    if (eventTypeFilter !== 'ALL') {
      filtered = filtered.filter(event => event.eventType === eventTypeFilter);
    }

    setFilteredEvents(filtered);
  };

  const exportSecurityReport = async () => {
    try {
      const response = await fetch(`/api/admin/security/export?range=${dateRange}`, {
        method: 'GET',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `security-report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600 bg-red-100';
      case 'HIGH': return 'text-orange-600 bg-orange-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'LOGIN_ATTEMPT': return <Activity className="w-4 h-4" />;
      case 'ACCOUNT_LOCKED': return <Shield className="w-4 h-4" />;
      case 'NEW_DEVICE_LOGIN': return <AlertTriangle className="w-4 h-4" />;
      case 'SUSPICIOUS_ACTIVITY': return <Eye className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              🔒 Security Dashboard
            </h1>
            <p className="text-gray-600 text-sm">Monitor security events and user activity</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button
            onClick={exportSecurityReport}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Security Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-xl font-semibold">{metrics.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-xl font-semibold">{metrics.activeUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Locked Accounts</p>
                <p className="text-xl font-semibold">{metrics.lockedAccounts.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Suspicious Activities</p>
                <p className="text-xl font-semibold">{metrics.suspiciousActivities.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">New Device Logins</p>
                <p className="text-xl font-semibold">{metrics.newDeviceLogins.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Failed Logins</p>
                <p className="text-xl font-semibold">{metrics.failedLoginAttempts.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Metrics */}
      {emailMetrics && (
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-lg font-semibold mb-4">Email Delivery Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{emailMetrics.totalSent.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Sent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{emailMetrics.delivered.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Delivered</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{emailMetrics.failed.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Failed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{emailMetrics.pending.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{emailMetrics.securityAlerts.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Security Alerts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">{emailMetrics.deviceConfirmations.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Device Confirmations</p>
            </div>
          </div>
        </div>
      )}

      {/* Security Events */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Security Events</h2>
            <span className="text-sm text-gray-600">
              {filteredEvents.length} of {securityEvents.length} events
            </span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by username, IP, or event type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">All Event Types</option>
              <option value="LOGIN_ATTEMPT">Login Attempts</option>
              <option value="ACCOUNT_LOCKED">Account Locked</option>
              <option value="NEW_DEVICE_LOGIN">New Device Login</option>
              <option value="SUSPICIOUS_ACTIVITY">Suspicious Activity</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getEventTypeIcon(event.eventType)}
                      <span className="text-sm font-medium text-gray-900">
                        {event.eventType.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{event.username}</div>
                    <div className="text-sm text-gray-500">{event.userId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.ipAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(event.severity)}`}>
                      {event.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredEvents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No security events found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}