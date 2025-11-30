import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function fetchServer<T>(endpoint: string): Promise<T> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Cookie'] = `token=${token.value}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers,
        cache: 'no-store', // Always fetch fresh data for dashboard
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Unauthorized');
        }
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    return response.json();
}
