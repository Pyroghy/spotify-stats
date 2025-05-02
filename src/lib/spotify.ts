import { SpotifyApi, AccessToken, SdkConfiguration, DefaultResponseDeserializer, DefaultResponseValidator, DocumentLocationRedirectionStrategy } from '@spotify/web-api-ts-sdk';

// Custom error handler with more detailed logging
class CustomErrorHandler {
    public async handleErrors(error: Error): Promise<boolean> {
        console.error('Spotify API Error:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        return false; // Let the error propagate
    }
}

// Custom caching strategy that extends localStorage
class CustomCachingStrategy {
    public async getOrCreate<T>(cacheKey: string, createFunction: () => Promise<T>): Promise<T> {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const result = await createFunction();
        localStorage.setItem(cacheKey, JSON.stringify(result));
        return result;
    }

    public async get<T>(cacheKey: string): Promise<T | null> {
        const cached = localStorage.getItem(cacheKey);
        return cached ? JSON.parse(cached) : null;
    }

    public async setCacheItem<T>(cacheKey: string, item: T): Promise<void> {
        localStorage.setItem(cacheKey, JSON.stringify(item));
    }

    public async remove(cacheKey: string): Promise<void> {
        localStorage.removeItem(cacheKey);
    }
}

// SDK configuration
const sdkConfig: SdkConfiguration = {
    errorHandler: new CustomErrorHandler(),
    cachingStrategy: new CustomCachingStrategy(),
    beforeRequest: (url) => {
        console.log('Making request to:', url);
    },
    afterRequest: (url, _, response) => {
        console.log('Received response from:', url, response.status);
    },
    fetch: (req, init) => fetch(req, init),
    deserializer: new DefaultResponseDeserializer(),
    responseValidator: new DefaultResponseValidator(),
    redirectionStrategy: new DocumentLocationRedirectionStrategy()
};

// Initialize Spotify API client
export const spotifyApi = SpotifyApi.withUserAuthorization(
    process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
    process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!,
    [
        'user-read-email',
        'user-read-private',
        'user-top-read',
        'user-read-recently-played',
        'user-read-playback-state',
    ],
    sdkConfig
);

// Helper function to initiate authorization
export async function initiateAuth() {
    return SpotifyApi.performUserAuthorization(
        process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
        process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!,
        [
            'user-read-email',
            'user-read-private',
            'user-top-read',
            'user-read-recently-played',
            'user-read-playback-state',
        ],
        async (token: AccessToken) => {
            // Store the access token using localStorage
            localStorage.setItem('spotify_access_token', token.access_token);
            // Redirect to stats page
            window.location.href = '/stats';
        }
    );
}

// Helper function to get user's top tracks using the SDK
export async function getTopTracks(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term') {
    try {
        const tracks = await spotifyApi.currentUser.topItems('tracks', timeRange);
        return tracks.items;
    } catch (error) {
        console.error('Error fetching top tracks:', error);
        throw error;
    }
}

// Helper function to get user's top artists using the SDK
export async function getTopArtists(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term') {
    try {
        const artists = await spotifyApi.currentUser.topItems('artists', timeRange);
        return artists.items;
    } catch (error) {
        console.error('Error fetching top artists:', error);
        throw error;
    }
}

// Helper function to get recently played tracks using the SDK
export async function getRecentlyPlayed() {
    try {
        const recentlyPlayed = await spotifyApi.player.getRecentlyPlayedTracks();
        return recentlyPlayed.items;
    } catch (error) {
        console.error('Error fetching recently played tracks:', error);
        throw error;
    }
}

// Helper function to get user profile using the SDK
export async function getUserProfile() {
    try {
        return await spotifyApi.currentUser.profile();
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
}

// Helper function to get audio features for tracks using the SDK
export async function getAudioFeatures(trackIds: string[]) {
    try {
        const features = await spotifyApi.tracks.audioFeatures(trackIds);
        return features;
    } catch (error) {
        console.error('Error fetching audio features:', error);
        throw error;
    }
} 