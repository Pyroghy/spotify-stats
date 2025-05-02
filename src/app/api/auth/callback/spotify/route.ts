import { NextResponse } from 'next/server';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.redirect(new URL('/?error=no_code', request.url));
    }

    try {
        // Create a new instance with the authorization code
        const spotifyClient = SpotifyApi.withUserAuthorization(
            process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
            process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!,
            [
                'user-read-email',
                'user-read-private',
                'user-top-read',
                'user-read-recently-played',
                'playlist-read-private',
                'user-read-playback-state'
            ]
        );

        // The SDK will automatically handle the authorization code exchange
        // and store the tokens internally
        await spotifyClient.authenticate();

        // Get the access token
        const accessToken = await spotifyClient.getAccessToken();
        if (!accessToken) {
            throw new Error('Failed to get access token');
        }

        // Create response with redirect
        const response = NextResponse.redirect(new URL('/dashboard', request.url));
        response.cookies.set('spotify_session', accessToken.toString());
        return response;
    } catch (error) {
        console.error('Error getting Spotify tokens:', error);
        return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
    }
} 