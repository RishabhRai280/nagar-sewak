const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

import { Token, UserStore, UserProfile, ComplaintData } from './store';
export { Token, UserStore };
export type { UserProfile, ComplaintData };

const STORAGE_KEYS = {
  token: 'jwtToken',
  user: 'ns:user',
} as const;



const buildUrl = (path: string) =>
  path.startsWith('http') ? path : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

export function buildAssetUrl(path?: string | null) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const normalized = path.startsWith('/uploads') ? path : `/uploads/complaints/${path}`;
  return `${API_BASE_URL}${normalized}`;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      try {
        const errorData = await response.json();

        // Create enhanced error with response data for security features
        const error = new Error(errorData.message || errorData.error || `Request failed with status ${response.status}`) as any;
        error.response = errorData; // Attach full response for detailed error handling
        error.status = response.status;

        throw error;
      } catch (e) {
        if (e instanceof Error) throw e;
      }
    }
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) return undefined as T;

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) return response.json() as Promise<T>;

  return (await response.text()) as unknown as T;
}

async function request<T>(path: string, options: RequestInit = {}, requireAuth = false): Promise<T> {
  const headers = new Headers(options.headers ?? {});
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (requireAuth) {
    const token = Token.get();
    if (!token) throw new Error('Authentication required. Please log in.');
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path), { ...options, headers });
  return parseResponse<T>(response);
}

// ===================== CORE DATA INTERFACES =====================

export interface ProjectData {
  id: number;
  title: string;
  description: string;
  budget: number;
  status: string;
  lat: number;
  lng: number;
  contractorId?: number;
  contractor?: {
    id: number;
    companyName: string;
    licenseNo: string;
  };
  createdAt?: string;
  updatedAt?: string;
  progressPercentage?: number;
  progressNotes?: string;
  progressPhotos?: string; // Comma-separated URLs
}

export interface ProjectDetail extends ProjectData {
  relatedComplaints?: Array<{
    id: number;
    title: string;
    description: string;
    severity: number;
    status: string;
    reportedBy?: string;
    reportedAt?: string;
  }>;
}



export interface MapData {
  projects: ProjectData[];
  complaints: ComplaintData[];
}

export interface FlaggedContractor {
  id: number;
  companyName: string;
  licenseNo: string;
  avgRating: number;
  isFlagged: boolean;
}

export interface AdminDashboardData {
  totalProjects: number;
  activeProjectsCount: number;
  pendingComplaintsCount: number;
  resolvedComplaintsCount: number;
  averageResolutionTimeHours: number;
  totalSanctionedBudget: number;
  flaggedContractors: FlaggedContractor[];
  recentComplaints: ComplaintAdminView[];
  projectStatusBreakdown: ProjectStatusAggregate[];
  wardComplaintHeatmap: WardHeatmapStat[];
}

export interface ProjectStatusAggregate {
  status: string;
  projectCount: number;
  totalBudget: number;
}

export interface WardHeatmapStat {
  wardName: string;
  zone: string;
  complaintCount: number;
  projectCount: number;
}

export interface ComplaintAdminView {
  id: number;
  title: string;
  status: string;
  severity: number;
  lat?: number;
  lng?: number;
  createdAt?: string;
  wardLabel?: string;
  photoUrl?: string | null;
}

export interface AuthResponsePayload {
  token: string;
  message: string;
  username: string;
  fullName: string;
  email: string;
  userId: number;
  roles: string[];
  // Security-related fields
  newDevice?: boolean;
  attemptCount?: number;
  remainingAttempts?: number;
  errorType?: string;
  error?: {
    error: string;
    message: string;
    attemptCount: number;
    remainingAttempts: number;
    warningMessage?: string;
  };
}



export interface ComplaintSubmitData {
  title: string;
  description: string;
  severity: number;
  lat: number;
  lng: number;
  projectId?: number;
}

export interface RatingSubmitData {
  projectId: number;
  score: number;
  comment: string;
}

export interface ContractorDashboardData {
  profile: {
    contractorId: number;
    companyName: string;
    licenseNo: string;
    avgRating: number;
    totalRatings: number;
    flagged: boolean;
    flaggedAt?: string | null;
  };
  metrics: {
    activeProjects: number;
    completedProjects: number;
    pendingComplaints: number;
    resolvedComplaints: number;
    totalBudget: number;
  };
  assignedProjects: Array<{
    id: number;
    title: string;
    status: string;
    budget: number;
    lat?: number | null;
    lng?: number | null;
    updatedAt?: string | null;
    progressPercentage?: number | null;
  }>;
  linkedComplaints: Array<{
    id: number;
    title: string;
    description?: string | null;
    status: string;
    severity: number;
    createdAt?: string | null;
    photoUrl?: string | null;
    projectId?: number | null;
  }>;
  recentRatings: Array<{
    id: number;
    score: number;
    comment?: string | null;
    createdAt?: string | null;
    citizenName?: string | null;
  }>;
}
export interface ComplaintDetail {
  id: number;
  title: string;
  description: string;
  severity: number;
  status: string;
  lat: number;
  lng: number;
  photoUrl?: string | null;
  photoUrls?: string[];
  createdAt?: string | null;
  resolvedAt?: string | null;
  userId?: number | null;
  userFullName?: string | null;
  projectId?: number | null;
}




// ===================== AUTH API =====================

export async function login(email: string, password: string): Promise<AuthResponsePayload> {
  const response = await request<AuthResponsePayload>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
  );

  Token.set(response.token);
  return response;
}

export async function loginWithGoogle(idToken: string, email?: string, displayName?: string): Promise<AuthResponsePayload> {
  const response = await request<AuthResponsePayload>(
    '/auth/firebase',
    {
      method: 'POST',
      body: JSON.stringify({ idToken, email, displayName }),
    },
  );

  Token.set(response.token);
  return response;
}

export async function register(data: { username: string; password: string; email: string; fullName: string }): Promise<AuthResponsePayload> {
  const response = await request<AuthResponsePayload>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );

  Token.set(response.token);
  return response;
}

export async function fetchCurrentUserProfile(): Promise<UserProfile> {
  const profile = await request<UserProfile>('/auth/me', { method: 'GET' }, true);

  // Process photoUrls for all complaints
  if (profile.complaints) {
    profile.complaints = profile.complaints.map(complaint => ({
      ...complaint,
      photoUrl: buildAssetUrl(complaint.photoUrl),
      photoUrls: complaint.photoUrls?.map(url => buildAssetUrl(url) || url).filter(Boolean) as string[] || [],
    }));
  }

  UserStore.set(profile);
  return profile;
}

// ===================== PUBLIC DATA FETCHERS =====================
export async function fetchProjects(): Promise<ProjectData[]> {
  return request<ProjectData[]>('/projects', { method: 'GET' });
}


export async function fetchMapData(): Promise<MapData> {
  const [projects, complaints] = await Promise.all([
    request<ProjectData[]>('/projects'),
    request<ComplaintData[]>('/complaints'),
  ]);

  return {
    projects,
    complaints: complaints.map((complaint) => ({
      ...complaint,
      photoUrl: buildAssetUrl(complaint.photoUrl),
      photoUrls: complaint.photoUrls?.map(url => buildAssetUrl(url) || url).filter(Boolean) as string[] || [],
    })),
  };
}

// Removed - see fetchProjectById in PROJECT MANAGEMENT section below

export async function updateProject(projectId: number, data: Partial<ProjectData>): Promise<ProjectData> {
  return request<ProjectData>(`/projects/${projectId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, true);
}
export const fetchComplaintDetails = fetchComplaintById;
export async function fetchComplaintById(id: number): Promise<ComplaintDetail> {
  const token = Token.get();
  if (!token) throw new Error("Authentication required. Please log in.");

  const data = await request<ComplaintDetail>(
    `/complaints/${id}`,
    { method: "GET" },
    true // means requireAuth = true → automatically adds Authorization header
  );

  return {
    ...data,
    photoUrl: buildAssetUrl(data.photoUrl),
    photoUrls: data.photoUrls?.map(url => buildAssetUrl(url) || url).filter(Boolean) as string[] || [],
  };
}


// ===================== PROTECTED ACTIONS =====================

// ⬇⬇ UPDATED FOR MULTIPLE IMAGE UPLOAD ⬇⬇
export async function submitComplaint(data: ComplaintSubmitData, imageFiles?: File[]): Promise<string> {
  const token = Token.get();
  if (!token) throw new Error('Authentication required. Please log in.');

  const formData = new FormData();
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file) => {
      formData.append('files', file);
    });
  }

  const response = await fetch(buildUrl('/complaints'), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = 'Complaint submission failed';
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
    } catch (e) {
      // If parsing fails, use default message
    }
    throw new Error(errorMessage);
  }

  return 'Complaint submitted successfully!';
}

export async function submitRating(data: RatingSubmitData): Promise<string> {
  await request('/ratings', { method: 'POST', body: JSON.stringify(data) }, true);
  return 'Rating submitted and contractor performance updated successfully!';
}

export async function fetchAdminDashboard(): Promise<AdminDashboardData> {
  type AdminDashboardApiResponse = {
    totalProjects: number | string;
    activeProjectsCount: number | string;
    pendingComplaintsCount: number | string;
    resolvedComplaintsCount: number | string;
    averageResolutionTimeHours: number | string;
    totalSanctionedBudget: number | string;
    flaggedContractors: Array<Omit<FlaggedContractor, 'avgRating'> & { avgRating: number | string }>;
    recentComplaints: ComplaintAdminView[];
    projectStatusBreakdown: Array<Omit<ProjectStatusAggregate, 'projectCount' | 'totalBudget'> & {
      projectCount: number | string;
      totalBudget: number | string;
    }>;
    wardComplaintHeatmap: WardHeatmapStat[];
  };

  const data = await request<AdminDashboardApiResponse>('/admin/dashboard', { method: 'GET' }, true);

  return {
    totalProjects: Number(data.totalProjects ?? 0),
    activeProjectsCount: Number(data.activeProjectsCount ?? 0),
    pendingComplaintsCount: Number(data.pendingComplaintsCount ?? 0),
    resolvedComplaintsCount: Number(data.resolvedComplaintsCount ?? 0),
    averageResolutionTimeHours: Number(data.averageResolutionTimeHours ?? 0),
    totalSanctionedBudget: Number(data.totalSanctionedBudget ?? 0),
    flaggedContractors: (data.flaggedContractors ?? []).map((contractor) => ({
      ...contractor,
      avgRating: Number(contractor.avgRating ?? 0),
    })),
    recentComplaints: (data.recentComplaints ?? []).map((complaint) => ({
      ...complaint,
      photoUrl: buildAssetUrl(complaint.photoUrl),
    })),
    projectStatusBreakdown: (data.projectStatusBreakdown ?? []).map((entry) => ({
      status: entry.status,
      projectCount: Number(entry.projectCount ?? 0),
      totalBudget: Number(entry.totalBudget ?? 0),
    })),
    wardComplaintHeatmap: data.wardComplaintHeatmap ?? [],
  };
}

export async function fetchContractorDashboard(): Promise<ContractorDashboardData> {
  const data = await request<ContractorDashboardData>('/dashboard/contractor', { method: 'GET' }, true);

  return {
    ...data,
    linkedComplaints: (data.linkedComplaints ?? []).map((complaint) => ({
      ...complaint,
      photoUrl: buildAssetUrl(complaint.photoUrl),
    })),
  };
}
// ================= TENDER API =================

export interface TenderData {
  id: number;
  complaintId: number;
  complaintTitle: string;
  contractorId: number;
  contractorName: string;
  contractorCompany: string;
  contractorLicense: string;
  contractorAvgRating: number;
  quoteAmount: number;
  estimatedDays: number;
  description: string;
  documentUrls: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenderSubmitData {
  quoteAmount: number;
  estimatedDays: number;
  description: string;
}

export async function fetchAllComplaints(): Promise<ComplaintData[]> {
  return request<ComplaintData[]>('/complaints', { method: 'GET' }, true);
}

export async function fetchOpenComplaints(): Promise<ComplaintData[]> {
  // Fetch all complaints and filter for Pending ones without a project
  // In a real app, this should be a dedicated backend endpoint
  const complaints = await request<ComplaintData[]>('/complaints');
  return complaints.filter(c => c.status === 'Pending' && !c.projectId && !c.project);
}

export async function submitTender(complaintId: number, data: TenderSubmitData, documents?: File[]): Promise<TenderData> {
  const token = Token.get();
  if (!token) throw new Error('Authentication required. Please log in.');

  const formData = new FormData();
  // Append data as JSON string (Spring Boot will parse it)
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

  // Append documents if provided
  if (documents && documents.length > 0) {
    documents.forEach((file) => {
      formData.append('documents', file);
    });
  }

  // Create XMLHttpRequest to have better control over headers
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', buildUrl(`/tenders/complaints/${complaintId}/submit`));

    // Set only Authorization header - let browser handle Content-Type
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (e) {
          reject(new Error('Invalid response format'));
        }
      } else {
        let errorMessage = 'Tender submission failed';
        try {
          const errorData = JSON.parse(xhr.responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = xhr.responseText || errorMessage;
        }
        reject(new Error(errorMessage));
      }
    };

    xhr.onerror = () => reject(new Error('Network error occurred'));
    xhr.send(formData);
  });
}

export async function fetchTenderById(tenderId: number): Promise<TenderData> {
  return request<TenderData>(`/tenders/${tenderId}`, { method: 'GET' }, true);
}

export async function fetchMyTenders(): Promise<TenderData[]> {
  return request<TenderData[]>('/tenders/my', { method: 'GET' }, true);
}

export async function updateProjectProgress(projectId: number, formData: FormData): Promise<void> {
  const token = Token.get();
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/progress`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to update progress');
  }
}

export async function fetchTendersForComplaint(complaintId: number): Promise<TenderData[]> {
  return request<TenderData[]>(`/tenders/complaints/${complaintId}`, { method: 'GET' }, true);
}

export async function acceptTender(tenderId: number): Promise<void> {
  await request(`/tenders/${tenderId}/accept`, { method: 'POST' }, true);
}

// ===================== PROJECT MANAGEMENT =====================

export async function fetchProjectsByStatus(status: string): Promise<ProjectData[]> {
  return request<ProjectData[]>(`/projects/status/${status}`, { method: 'GET' }, true);
}

export async function fetchProjectById(projectId: number): Promise<ProjectDetail> {
  return request<ProjectDetail>(`/projects/${projectId}`, { method: 'GET' }, true);
}

// ===================== CONTRACTOR MANAGEMENT =====================

export interface ContractorProfile {
  id: number;
  companyName: string;
  licenseNo: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  specialization?: string;
  avgRating: number;
  totalRatings: number;
  totalProjects: number;
  completedProjects: number;
  projects: Array<{
    id: number;
    title: string;
    description: string;
    budget: number;
    status: string;
    completedAt?: string;
  }>;
}

export async function fetchContractorProfile(contractorId: number): Promise<ContractorProfile> {
  return request<ContractorProfile>(`/contractors/${contractorId}`, { method: 'GET' }, true);
}

// ===================== PROJECT CREATION & MANAGEMENT =====================

export interface ProjectCreateData {
  title: string;
  description: string;
  budget: number;
  expectedDuration?: number;
  priority: string;
  category: string;
  location?: string;
  lat?: number;
  lng?: number;
  headerImage?: File;
  headerVideo?: File;
  documents?: File[];
}

export async function createProject(data: ProjectCreateData, files?: { headerImage?: File; headerVideo?: File; documents?: File[] }): Promise<ProjectData> {
  // For now, create project with JSON data only (files will be handled separately if needed)
  const projectData = {
    title: data.title,
    description: data.description,
    budget: data.budget,
    priority: data.priority,
    category: data.category,
    expectedDuration: data.expectedDuration,
    location: data.location,
    lat: data.lat,
    lng: data.lng,
    status: 'Pending'
  };

  return request<ProjectData>('/projects', {
    method: 'POST',
    body: JSON.stringify(projectData),
  }, true);
}

export async function fetchAllProjects(params?: {
  search?: string;
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
}): Promise<{ projects: ProjectData[]; total: number; page: number; totalPages: number }> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.append('search', params.search);
  if (params?.status) searchParams.append('status', params.status);
  if (params?.category) searchParams.append('category', params.category);
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());

  const url = `/projects${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  return request<{ projects: ProjectData[]; total: number; page: number; totalPages: number }>(url, { method: 'GET' }, true);
}

// ===================== TENDER CREATION & BIDDING =====================

export interface TenderCreateData {
  complaintId: number;
  description: string;
  quoteAmount: number;
  estimatedDays: number;
  materials?: string;
  methodology?: string;
  timeline?: string;
  documents?: File[];
}

export async function createTender(data: TenderCreateData): Promise<TenderData> {
  const formData = new FormData();

  formData.append('complaintId', data.complaintId.toString());
  formData.append('description', data.description);
  formData.append('quoteAmount', data.quoteAmount.toString());
  formData.append('estimatedDays', data.estimatedDays.toString());

  if (data.materials) formData.append('materials', data.materials);
  if (data.methodology) formData.append('methodology', data.methodology);
  if (data.timeline) formData.append('timeline', data.timeline);

  if (data.documents) {
    data.documents.forEach((doc) => {
      formData.append('documents', doc);
    });
  }

  const token = Token.get();
  if (!token) throw new Error('Authentication required. Please log in.');

  const response = await fetch(`${API_BASE_URL}/tenders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  return parseResponse<TenderData>(response);
}

export async function fetchAllTenders(params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ tenders: TenderData[]; total: number; page: number; totalPages: number }> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.append('search', params.search);
  if (params?.status) searchParams.append('status', params.status);
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());

  const url = `/tenders${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  // Backend currently returns a simple List<TenderDTO>
  const data = await request<TenderData[]>(url, { method: 'GET' }, true);

  return {
    tenders: data,
    total: data.length,
    page: params?.page || 1,
    totalPages: 1
  };
}



// ===================== CONTRACTOR MANAGEMENT =====================

export async function fetchAllContractors(params?: {
  search?: string;
  status?: string;
  specialization?: string;
  page?: number;
  limit?: number;
}): Promise<{ contractors: ContractorProfile[]; total: number; page: number; totalPages: number }> {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.append('search', params.search);
  if (params?.status) searchParams.append('status', params.status);
  if (params?.specialization) searchParams.append('specialization', params.specialization);
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());

  const url = `/contractors${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  // Backend currently returns a simple List<ContractorProfileDTO>
  const data = await request<ContractorProfile[]>(url, { method: 'GET' }, true);

  return {
    contractors: data,
    total: data.length,
    page: params?.page || 1,
    totalPages: 1
  };
}
