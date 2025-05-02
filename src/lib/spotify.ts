import { SpotifyApi } from '@spotify/web-api-ts-sdk';

// Initialize Spotify API client
export const spotifyApi = SpotifyApi.withUserAuthorization(
    process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
    process.env.NEXT_PUBLIC_REDIRECT_URI!,
    [
        'user-read-email',
        'user-read-private',
        'user-top-read',
        'user-read-recently-played',
        'user-read-playback-state',
    ]
);

// Helper function to get user's top tracks
export async function getTopTracks(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term') {
    try {
        const response = await spotifyApi.currentUser.topItems('tracks', timeRange);
        return response.items;
    } catch (error) {
        console.error('Error fetching top tracks:', error);
        throw error;
    }
}

// Helper function to get user's top artists
export async function getTopArtists(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term') {
    try {
        const response = await spotifyApi.currentUser.topItems('artists', timeRange);
        return response.items;
    } catch (error) {
        console.error('Error fetching top artists:', error);
        throw error;
    }
}

// Helper function to get recently played tracks
export async function getRecentlyPlayed() {
    try {
        const response = await spotifyApi.player.getRecentlyPlayedTracks();
        return response.items;
    } catch (error) {
        console.error('Error fetching recently played tracks:', error);
        throw error;
    }
}

// Helper function to get user profile
export async function getUserProfile() {
    try {
        const response = await spotifyApi.currentUser.profile();
        return response;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}

// Helper function to get audio features for tracks
export async function getAudioFeatures(trackIds: string[]) {
    try {
        const response = await spotifyApi.tracks.audioFeatures(trackIds);
        return response;
    } catch (error) {
        console.error('Error fetching audio features:', error);
        throw error;
    }
} 