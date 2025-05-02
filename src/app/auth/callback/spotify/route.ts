import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
        }

        if (!code) {
            return NextResponse.redirect(new URL('/?error=no_code', request.url));
        }

        const clientId = process.env.SPOTIFY_CLIENT_ID!;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
        const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;

        // Exchange the code for an access token
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
            }),
        });

        if (!tokenResponse.ok) {
            throw new Error('Failed to get access token');
        }

        const tokenData = await tokenResponse.json();

        // Store the tokens in cookies
        const response = NextResponse.redirect(new URL('/dashboard', request.url));
        
        // Set cookies with basic security flags
        response.cookies.set('spotify_access_token', tokenData.access_token, {
            httpOnly: true,
            maxAge: tokenData.expires_in,
        });

        response.cookies.set('spotify_refresh_token', tokenData.refresh_token, {
            httpOnly: true,
        });

        return response;
    } catch (error) {
        console.error('Error in Spotify callback:', error);
        return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
    }
} 