import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('spotify_refresh_token');

        if (!refreshToken) {
            return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
        }

        const clientId = process.env.SPOTIFY_CLIENT_ID!;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken.value,
            }),
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to refresh token' }, { status: response.status });
        }

        const tokens = await response.json();
        
        // Create response
        const newResponse = NextResponse.json({ success: true });
        
        // Set the new access token
        newResponse.cookies.set('spotify_access_token', tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: tokens.expires_in
        });

        // Update refresh token if a new one was provided
        if (tokens.refresh_token) {
            newResponse.cookies.set('spotify_refresh_token', tokens.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            });
        }

        return newResponse;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 