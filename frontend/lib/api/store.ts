export interface ComplaintData {
    id: number;
    title: string;
    description: string;
    severity: number;
    status: string;
    lat: number;
    lng: number;
    projectId?: number;
    project?: any | null; // Avoid circular dependency with ProjectData for now if not needed here
    photoUrl?: string | null;
    photoUrls?: string[];
    createdAt?: string | null;
    resolvedAt?: string | null;
}

export interface UserProfile {
    id: number;
    userId?: number;
    username: string;
    fullName: string;
    email: string;
    roles: string[];
    complaints: ComplaintData[];
}

const STORAGE_KEYS = {
    token: 'jwtToken',
    user: 'ns:user',
} as const;

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
