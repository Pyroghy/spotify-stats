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
export async function getTopTracks(accessToken: string, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term') {
    try {
        const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch top tracks');
        }
        
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Error fetching top tracks:', error);
        throw error;
    }
}

// Helper function to get user's top artists
export async function getTopArtists(accessToken: string, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term') {
    try {
        const response = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch top artists');
        }
        
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Error fetching top artists:', error);
        throw error;
    }
}

// Helper function to get recently played tracks
export async function getRecentlyPlayed(accessToken: string) {
    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/recently-played', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch recently played tracks');
        }
        
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Error fetching recently played tracks:', error);
        throw error;
    }
}

// Helper function to get user profile
export async function getUserProfile(accessToken: string) {
    try {
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }
        
        return response.json();
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}

// Helper function to get audio features for tracks
export async function getAudioFeatures(accessToken: string, trackIds: string[]) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch audio features');
        }
        
        const data = await response.json();
        return data.audio_features;
    } catch (error) {
        console.error('Error fetching audio features:', error);
        throw error;
    }
} 