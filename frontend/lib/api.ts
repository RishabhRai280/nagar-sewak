const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

// ===================== TOKEN MANAGEMENT =====================
export const Token = {
  get: () => (typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null),
  set: (token: string) => {
    if (typeof window !== 'undefined') localStorage.setItem('jwtToken', token);
  },
  remove: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('jwtToken');
  },
};

const buildUrl = (path: string) =>
  path.startsWith('http') ? path : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

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
  activeProjectsCount: number;
  pendingComplaintsCount: number;
  averageResolutionTime: number;
  totalSanctionedBudget: number;
  flaggedContractors: FlaggedContractor[];
}

export interface UserProfile {
  id: number;
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
  userId?: number | null;
  userFullName?: string | null;
  projectId?: number | null;
}




// ===================== AUTH API =====================

export async function login(email: string, password: string): Promise<string> {
  const response = await request<{ token: string; message: string; username: string; fullName: string; email: string }>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
  );

  Token.set(response.token);
  return response.token;
}

export async function register(data: { username: string; password: string; email: string; fullName: string }): Promise<string> {
  const response = await request<{ token: string; message: string; username: string; fullName: string; email: string }>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );

  Token.set(response.token);
  return response.message;
}

export async function fetchCurrentUserProfile(): Promise<UserProfile> {
  return request<UserProfile>('/auth/me', { method: 'GET' }, true);
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

  return { projects, complaints };
}

export async function fetchProjectById(projectId: number): Promise<ProjectData> {
  const project = await request<ProjectData>(`/projects/${projectId}`);
  return project;
}
export async function fetchComplaintById(id: number): Promise<ComplaintDetail> {
  const token = Token.get();
  if (!token) throw new Error("Authentication required. Please log in.");

  return request<ComplaintDetail>(
    `/complaints/${id}`,
    { method: "GET" },
    true // means requireAuth = true → automatically adds Authorization header
  );
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
    activeProjectsCount: number | string;
    pendingComplaintsCount: number | string;
    averageResolutionTime: number | string;
    totalSanctionedBudget: number | string;
    flaggedContractors: Array<Omit<FlaggedContractor, 'avgRating'> & { avgRating: number | string }>;
  };

  const data = await request<AdminDashboardApiResponse>('/dashboard/admin', { method: 'GET' }, true);

  return {
    activeProjectsCount: Number(data.activeProjectsCount ?? 0),
    pendingComplaintsCount: Number(data.pendingComplaintsCount ?? 0),
    averageResolutionTime: Number(data.averageResolutionTime ?? 0),
    totalSanctionedBudget: Number(data.totalSanctionedBudget ?? 0),
    flaggedContractors: (data.flaggedContractors ?? []).map((contractor) => ({
      ...contractor,
      avgRating: Number(contractor.avgRating ?? 0),
    })),
  };
}
