import { SpotifyApi } from '@spotify/web-api-ts-sdk';

// Initialize the Spotify client with user authorization
// This will handle the OAuth flow and token management
export const spotifyClient = SpotifyApi.withUserAuthorization(
    process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
    process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!,
    [
        'user-read-private',
        'user-read-email',
        'user-top-read',
        'user-read-recently-played',
        'playlist-read-private',
        'playlist-read-collaborative'
    ]
);

// Helper function to get the current user's profile
export async function getCurrentUserProfile() {
    return await spotifyClient.currentUser.profile();
}

// Helper function to get user's top tracks
export async function getUserTopTracks(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term') {
    return await spotifyClient.currentUser.topItems('tracks', timeRange);
}

// Helper function to get user's top artists
export async function getUserTopArtists(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term') {
    return await spotifyClient.currentUser.topItems('artists', timeRange);
}

// Helper function to get user's recently played tracks
export async function getUserRecentlyPlayed(limit: 1 | 50 = 50) {
    return await spotifyClient.player.getRecentlyPlayedTracks(limit);
}

// Helper function to get user's playlists
export async function getUserPlaylists(limit: 1 | 50 = 50) {
    return await spotifyClient.currentUser.playlists.playlists(limit);
} 