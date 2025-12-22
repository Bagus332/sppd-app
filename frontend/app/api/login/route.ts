
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';

        // Call the external backend
        const res = await fetch(`${backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { message: data.message || 'Login failed' },
                { status: res.status }
            );
        }

        // Create response with Next.js cookie
        const response = NextResponse.json({
            success: true,
            user: data.user
        });

        // Set cookie on the Frontend domain
        response.cookies.set('token', data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60, // 1 hour
            sameSite: 'lax'
        });

        return response;

    } catch (error) {
        console.error('Login Proxy Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
