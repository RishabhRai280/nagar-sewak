'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Users, Shield, Lock, Unlock, Eye, Search, Filter, MoreVertical, AlertTriangle } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roles: string[];
  isLocked: boolean;
  lastLogin: string;
  createdAt: string;
  loginAttempts: number;
  trustedDevices: number;
  securityScore: number;
}

interface UserSecurityDetails {
  loginHistory: Array<{
    timestamp: string;
    ipAddress: string;
    success: boolean;
    deviceInfo: string;
  }>;
  devices: Array<{
    id: string;
    deviceType: string;
    browserType: string;
    lastSeen: string;
    trusted: boolean;
  }>;
  securityEvents: Array<{
    eventType: string;
    timestamp: string;
    details: string;
  }>;
}

export default function AdminUserManagement() {
  const t = useTranslations('dashboard.admin.users');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetails, setUserDetails] = useState<UserSecurityDetails | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users?includeSecurityInfo=true');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.content || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(user => user.roles.includes(roleFilter));
    }

    if (statusFilter !== 'ALL') {
      if (statusFilter === 'LOCKED') {
        filtered = filtered.filter(user => user.isLocked);
      } else if (statusFilter === 'ACTIVE') {
        filtered = filtered.filter(user => !user.isLocked);
      } else if (statusFilter === 'HIGH_RISK') {
        filtered = filtered.filter(user => user.securityScore < 50);
      }
    }

    setFilteredUsers(filtered);
  };

  const loadUserDetails = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/security-details`);
      if (response.ok) {
        const details = await response.json();
        setUserDetails(details);
      }
    } catch (error) {
      console.error('Error loading user details:', error);
    }
  };

  const handleUserAction = async (userId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        await loadUsers(); // Refresh the user list
        setShowActionMenu(null);
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    }
  };

  const openUserModal = async (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
    await loadUserDetails(user.id);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
    setUserDetails(null);
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800';
      case 'CONTRACTOR': return 'bg-blue-100 text-blue-800';
      case 'CITIZEN': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              👥 User Management
            </h1>
            <p className="text-gray-600 text-sm">Manage user accounts and security settings</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {filteredUsers.length} of {users.length} users
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by username, email, or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="CONTRACTOR">Contractor</option>
            <option value="CITIZEN">Citizen</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="LOCKED">Locked</option>
            <option value="HIGH_RISK">High Risk</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Security Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Login Attempts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <span
                          key={role}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(role)}`}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {user.isLocked ? (
                        <div className="flex items-center gap-1 text-red-600">
                          <Lock className="w-4 h-4" />
                          <span className="text-sm">Locked</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-green-600">
                          <Unlock className="w-4 h-4" />
                          <span className="text-sm">Active</span>
                        </div>
                      )}
                      {user.loginAttempts > 3 && (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSecurityScoreColor(user.securityScore)}`}>
                      {user.securityScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.loginAttempts}</div>
                    <div className="text-xs text-gray-500">{user.trustedDevices} trusted devices</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openUserModal(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {showActionMenu === user.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                            <div className="py-1">
                              <button
                                onClick={() => handleUserAction(user.id, user.isLocked ? 'UNLOCK' : 'LOCK')}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                {user.isLocked ? 'Unlock Account' : 'Lock Account'}
                              </button>
                              <button
                                onClick={() => handleUserAction(user.id, 'RESET_PASSWORD')}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                Reset Password
                              </button>
                              <button
                                onClick={() => handleUserAction(user.id, 'CLEAR_DEVICES')}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                Clear Trusted Devices
                              </button>
                              <button
                                onClick={() => handleUserAction(user.id, 'RESET_ATTEMPTS')}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                Reset Login Attempts
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{selectedUser.fullName}</h2>
                  <p className="text-gray-600">{selectedUser.email}</p>
                </div>
                <button
                  onClick={closeUserModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Account Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Username:</span> {selectedUser.username}</div>
                    <div><span className="font-medium">Created:</span> {new Date(selectedUser.createdAt).toLocaleDateString()}</div>
                    <div><span className="font-medium">Last Login:</span> {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}</div>
                    <div><span className="font-medium">Status:</span> {selectedUser.isLocked ? 'Locked' : 'Active'}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Security Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Security Score:</span> {selectedUser.securityScore}%</div>
                    <div><span className="font-medium">Login Attempts:</span> {selectedUser.loginAttempts}</div>
                    <div><span className="font-medium">Trusted Devices:</span> {selectedUser.trustedDevices}</div>
                  </div>
                </div>
              </div>

              {/* Security Details */}
              {userDetails && (
                <div className="space-y-6">
                  {/* Login History */}
                  <div>
                    <h3 className="font-medium mb-3">Recent Login History</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left">Timestamp</th>
                            <th className="px-3 py-2 text-left">IP Address</th>
                            <th className="px-3 py-2 text-left">Device</th>
                            <th className="px-3 py-2 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {userDetails.loginHistory.map((login, index) => (
                            <tr key={index}>
                              <td className="px-3 py-2">{new Date(login.timestamp).toLocaleString()}</td>
                              <td className="px-3 py-2">{login.ipAddress}</td>
                              <td className="px-3 py-2">{login.deviceInfo}</td>
                              <td className="px-3 py-2">
                                <span className={`px-2 py-1 text-xs rounded-full ${login.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {login.success ? 'Success' : 'Failed'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Trusted Devices */}
                  <div>
                    <h3 className="font-medium mb-3">Trusted Devices</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userDetails.devices.map((device) => (
                        <div key={device.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{device.deviceType}</p>
                              <p className="text-sm text-gray-600">{device.browserType}</p>
                              <p className="text-xs text-gray-500">Last seen: {new Date(device.lastSeen).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${device.trusted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {device.trusted ? 'Trusted' : 'Unverified'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}