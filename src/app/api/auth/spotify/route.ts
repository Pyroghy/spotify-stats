import { NextResponse } from 'next/server';

export async function GET() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

    if (!clientId || !redirectUri) {
        return NextResponse.json(
            { error: 'Missing required environment variables' },
            { status: 500 }
        );
    }

    const scopes = [
        'user-read-private',
        'user-read-email',
        'user-top-read',
        'user-read-recently-played'
    ];

    const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
        client_id: clientId,
        response_type: 'code',
        redirect_uri: redirectUri,
        scope: scopes.join(' '),
        state: 'state'
    }).toString()}`;

    return NextResponse.json({ url: authUrl });
} 