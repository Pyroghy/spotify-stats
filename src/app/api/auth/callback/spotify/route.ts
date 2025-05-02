import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const searchParams = new URL(request.url).searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.redirect(new URL('/?error=' + error, request.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL('/?error=no_code', request.url));
    }

    try {
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
                redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!,
            }),
        });

        if (!tokenResponse.ok) {
            throw new Error('Failed to get access token');
        }

        const data = await tokenResponse.json();
        
        // Redirect to stats page with access token
        return NextResponse.redirect(new URL(`/stats#access_token=${data.access_token}`, request.url));
    } catch (error) {
        console.error('Error exchanging code for token:', error);
        return NextResponse.redirect(new URL('/?error=token_error', request.url));
    }
} 