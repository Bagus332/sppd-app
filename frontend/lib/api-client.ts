// lib/api-client.ts
// Centralized API client for consistent API calls across the application

// Use empty string to support relative paths (proxy via Next.js Rewrites)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface RequestOptions extends RequestInit {
    data?: any;
}

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<T> {
        const { data, headers, ...restOptions } = options;

        const config: RequestInit = {
            ...restOptions,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            credentials: 'include',
        };

        if (data) {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, config);

            // Handle non-JSON responses (like file downloads)
            const contentType = response.headers.get('content-type');
            if (contentType && !contentType.includes('application/json')) {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response as any;
            }

            // Parse JSON response
            const result = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                }
                throw new Error(result.message || `HTTP error! status: ${response.status}`);
            }

            return result;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unexpected error occurred');
        }
    }

    async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'POST', data });
    }

    async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'PUT', data });
    }

    async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }

    // Special method for file downloads
    async downloadFile(endpoint: string): Promise<Blob> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            if (response.status === 401) {
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            }
            throw new Error(`Download failed! status: ${response.status}`);
        }

        return response.blob();
    }

    // Helper to get filename from Content-Disposition header
    getFilenameFromResponse(response: Response): string {
        const contentDisposition = response.headers.get('Content-Disposition');
        if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(contentDisposition);
            if (matches != null && matches[1]) {
                return matches[1].replace(/['"]/g, '');
            }
        }
        return 'download';
    }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export API endpoints as constants
export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    CHECK_AUTH: '/api/auth/check',

    // Surat
    SURAT: '/api/surat',
    SURAT_BY_ID: (id: number) => `/api/surat/${id}`,
    DOWNLOAD_SURAT_TUGAS: (id: number) => `/api/surat/${id}/download/tugas`,
    DOWNLOAD_SPD: (id: number) => `/api/surat/${id}/download/spd`,

    // Pegawai
    PEGAWAI: '/api/pegawai',
    PEGAWAI_BY_ID: (id: number) => `/api/pegawai/${id}`,

    // Dashboard Stats
    DASHBOARD_STATS: '/api/dashboard/stats',
} as const;
