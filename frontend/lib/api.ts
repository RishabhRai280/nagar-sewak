const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

const STORAGE_KEYS = {
  token: 'jwtToken',
  user: 'ns:user',
} as const;

// ===================== TOKEN MANAGEMENT =====================
export const Token = {
  get: () => (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.token) : null),
  set: (token: string) => {
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEYS.token, token);
  },
  remove: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem('token');
    }
  },
};

export const UserStore = {
  get: (): UserProfile | null => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEYS.user) ?? localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  },
  set: (profile: UserProfile) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(profile));
      localStorage.removeItem('user');
    }
  },
  remove: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.user);
      localStorage.removeItem('user');
    }
  },
};

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
        const errorMessage = errorData.message || errorData.error || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
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
}

export interface ComplaintData {
  id: number;
  title: string;
  description: string;
  severity: number;
  status: string;
  lat: number;
  lng: number;
  projectId?: number;
  project?: ProjectData | null;
  photoUrl?: string | null;
  createdAt?: string | null;
  resolvedAt?: string | null;
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
}

export interface UserProfile {
  id: number;
  userId?: number; // backwards compat with AuthResponse
  username: string;
  fullName: string;
  email: string;
  roles: string[];
  complaints: ComplaintData[];
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
    })),
  };
}

export async function fetchProjectById(projectId: number): Promise<ProjectData> {
  const project = await request<ProjectData>(`/projects/${projectId}`);
  return project;
}

export async function updateProject(projectId: number, data: Partial<ProjectData>): Promise<ProjectData> {
  return request<ProjectData>(`/projects/${projectId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }, true);
}
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
  };
}


// ===================== PROTECTED ACTIONS =====================

// ⬇⬇ UPDATED FOR IMAGE UPLOAD ⬇⬇
export async function submitComplaint(data: ComplaintSubmitData, imageFile?: File): Promise<string> {
  const token = Token.get();
  if (!token) throw new Error('Authentication required. Please log in.');

  const formData = new FormData();
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

  if (imageFile) {
    formData.append('file', imageFile);
  }

  const response = await fetch(buildUrl('/complaints'), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Complaint submission failed');
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
  quoteAmount: number;
  estimatedDays: number;
  description: string;
  status: string;
  createdAt: string;
}

export interface TenderSubmitData {
  quoteAmount: number;
  estimatedDays: number;
  description: string;
}

export async function fetchOpenComplaints(): Promise<ComplaintData[]> {
  // Fetch all complaints and filter for Pending ones without a project
  // In a real app, this should be a dedicated backend endpoint
  const complaints = await request<ComplaintData[]>('/complaints');
  return complaints.filter(c => c.status === 'Pending' && !c.projectId && !c.project);
}

export async function submitTender(complaintId: number, data: TenderSubmitData): Promise<TenderData> {
  return request<TenderData>(`/tenders/complaints/${complaintId}/submit`, {
    method: 'POST',
    body: JSON.stringify(data)
  }, true);
}

export async function fetchMyTenders(): Promise<TenderData[]> {
  return request<TenderData[]>('/tenders/my', { method: 'GET' }, true);
}

export async function fetchTendersForComplaint(complaintId: number): Promise<TenderData[]> {
  return request<TenderData[]>(`/tenders/complaints/${complaintId}`, { method: 'GET' }, true);
}

export async function acceptTender(tenderId: number): Promise<void> {
  await request(`/tenders/${tenderId}/accept`, { method: 'POST' }, true);
}
