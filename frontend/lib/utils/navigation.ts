import { UserStore } from '@/lib/api/store';

export function getRoleBasedDashboardUrl(): string {
  const user = UserStore.get();
  
  if (!user) {
    return '/login';
  }

  const hasAdminAccess = user.roles.some((role) => role === 'ADMIN' || role === 'SUPER_ADMIN');
  const isContractor = user.roles.includes('CONTRACTOR');
  
  if (hasAdminAccess) {
    return '/dashboard/admin';
  } else if (isContractor) {
    return '/dashboard/contractor';
  } else {
    return '/dashboard/citizen';
  }
}

export function getRoleBasedBackUrl(currentPath: string): string {
  // If we're on a specific page, determine the appropriate back URL
  if (currentPath.includes('/tenders/')) {
    return getRoleBasedDashboardUrl();
  }
  
  if (currentPath.includes('/complaints/')) {
    return getRoleBasedDashboardUrl();
  }
  
  if (currentPath.includes('/projects/')) {
    return getRoleBasedDashboardUrl();
  }
  
  if (currentPath.includes('/services/')) {
    return '/services';
  }
  
  if (currentPath.includes('/schemes/')) {
    return '/schemes';
  }
  
  // Default fallback
  return getRoleBasedDashboardUrl();
}