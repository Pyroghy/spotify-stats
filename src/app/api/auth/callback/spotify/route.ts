import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Handle Spotify errors
    if (error) {
        return NextResponse.redirect(new URL(`/?error=${error}`, request.url));
    }

    // Check for required parameters
    if (!code) {
        return NextResponse.redirect(new URL('/?error=no_code', request.url));
    }

    try {
        const clientId = process.env.SPOTIFY_CLIENT_ID!;
        const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
        const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;

        // Exchange the authorization code for access and refresh tokens
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
            const errorData = await tokenResponse.json();
            console.error('Spotify token error:', errorData);
            return NextResponse.redirect(new URL('/?error=token_exchange_failed', request.url));
        }

        const tokens = await tokenResponse.json();

        // Create response with redirect
        const response = NextResponse.redirect(new URL('/dashboard', request.url));
        
        // Set the access token in an HTTP-only cookie
        response.cookies.set('spotify_access_token', tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: tokens.expires_in // Spotify's token expiration time
        });

        // Set the refresh token in an HTTP-only cookie
        if (tokens.refresh_token) {
            response.cookies.set('spotify_refresh_token', tokens.refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
            });
        }

        return response;
    } catch (error) {
        console.error('Error getting Spotify tokens:', error);
        return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
    }
} 