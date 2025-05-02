import { NextResponse } from 'next/server';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

export async function GET() {
    try {
        // Create a temporary instance to get the authorization URL
        const authUrl = SpotifyApi.performUserAuthorization(
            process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
            process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!,
            [
                'user-read-email',
                'user-read-private',
                'user-top-read',
                'user-read-recently-played',
                'playlist-read-private',
                'user-read-playback-state'
            ],
            process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI! // Callback URL
        );
        return NextResponse.json({ url: authUrl });
    } catch (error) {
        console.error('Error creating authorization URL:', error);
        return NextResponse.json({ error: 'Failed to create authorization URL' }, { status: 500 });
    }
} 