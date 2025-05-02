import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const clientId = process.env.SPOTIFY_CLIENT_ID!;
        const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;
        const scope = [
            'user-read-email',
            'user-read-private',
            'user-top-read',
            'user-read-recently-played',
            'playlist-read-private',
            'user-read-playback-state'
        ].join(' ');

        const authUrl = new URL('https://accounts.spotify.com/authorize');
        authUrl.searchParams.append('client_id', clientId);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('redirect_uri', redirectUri);
        authUrl.searchParams.append('scope', scope);
        authUrl.searchParams.append('show_dialog', 'true');

        return NextResponse.json({ url: authUrl.toString() });
    } catch (error) {
        console.error('Error creating authorization URL:', error);
        return NextResponse.json(
            { error: 'Failed to create authorization URL' },
            { status: 500 }
        );
    }
} 