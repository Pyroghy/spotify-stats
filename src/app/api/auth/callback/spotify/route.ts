import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const searchParams = new URL(request.url).searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        console.error('Spotify auth error:', error);
        return NextResponse.redirect(new URL('/?error=' + error, request.url));
    }

    if (!code) {
        console.error('No authorization code received');
        return NextResponse.redirect(new URL('/?error=no_code', request.url));
    }

    try {
        // Verify environment variables
        if (!process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET || !process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI) {
            console.error('Missing required environment variables');
            return NextResponse.redirect(new URL('/?error=config_error', request.url));
        }

        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(
                    process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
                ).toString('base64')
            },
            body: new URLSearchParams({
                code,
                grant_type: 'authorization_code',
                redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
            }),
        });

        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json();
            console.error('Spotify token error:', errorData);
            return NextResponse.redirect(new URL(`/?error=token_error&details=${encodeURIComponent(JSON.stringify(errorData))}`, request.url));
        }

        const data = await tokenResponse.json();
        
        // Store the token in a secure way (e.g., session or cookie)
        // For now, we'll pass it in the URL hash
        return NextResponse.redirect(new URL(`/stats#access_token=${data.access_token}&refresh_token=${data.refresh_token}`, request.url));
    } catch (error) {
        console.error('Error exchanging code for token:', error);
        return NextResponse.redirect(new URL('/?error=token_error&details=unknown', request.url));
    }
} 