// lib/apiHelpers.ts
import { Token } from "./api";

interface RetryOptions {
    maxRetries?: number;
    retryDelay?: number;
    shouldRetry?: (error: any) => boolean;
}

/**
 * Wrapper for API calls with automatic retry logic
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const {
        maxRetries = 3,
        retryDelay = 1000,
        shouldRetry = (error) => {
            // Retry on network errors or 5xx server errors
            return (
                error.message?.includes("fetch") ||
                error.message?.includes("network") ||
                error.status >= 500
            );
        },
    } = options;

    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;

            // Don't retry on last attempt or if error shouldn't be retried
            if (attempt === maxRetries || !shouldRetry(error)) {
                throw error;
            }

            // Exponential backoff
            const delay = retryDelay * Math.pow(2, attempt);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    throw lastError;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return !!Token.get();
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: any): string {
    if (error.message) {
        return error.message;
    }

    if (error.status === 401) {
        return "Authentication required. Please log in.";
    }

    if (error.status === 403) {
        return "You don't have permission to perform this action.";
    }

    if (error.status === 404) {
        return "The requested resource was not found.";
    }

    if (error.status === 429) {
        return "Too many requests. Please try again later.";
    }

    if (error.status >= 500) {
        return "Server error. Please try again later.";
    }

    return "An unexpected error occurred. Please try again.";
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if the app is running in production
 */
export function isProduction(): boolean {
    return process.env.NODE_ENV === "production";
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
    try {
        return JSON.parse(json) as T;
    } catch {
        return fallback;
    }
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
    const d = typeof date === "string" ? new Date(date) : date;

    if (isNaN(d.getTime())) {
        return "Invalid date";
    }

    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(d);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
    const d = typeof date === "string" ? new Date(date) : date;

    if (isNaN(d.getTime())) {
        return "Invalid date";
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return formatDate(d);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + "...";
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
