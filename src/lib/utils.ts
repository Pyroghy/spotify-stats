import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Track, Artist, TimeRange } from '@/types/spotify';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Format duration in milliseconds to MM:SS
export function formatDuration(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Format time range for display
export function formatTimeRange(timeRange: TimeRange): string {
    switch (timeRange) {
        case 'short_term':
            return 'Last 4 Weeks';
        case 'medium_term':
            return 'Last 6 Months';
        case 'long_term':
            return 'All Time';
        default:
            return 'Unknown';
    }
}

// Get artist names from track
export function getArtistNames(track: Track): string {
    return track.artists.map(artist => artist.name).join(', ');
}

// Get album image URL
export function getAlbumImageUrl(track: Track, size: 'small' | 'medium' | 'large' = 'medium'): string {
    const images = track.album.images;
    switch (size) {
        case 'small':
            return images[2]?.url || images[0]?.url || '';
        case 'medium':
            return images[1]?.url || images[0]?.url || '';
        case 'large':
            return images[0]?.url || '';
        default:
            return '';
    }
}

// Get artist image URL
export function getArtistImageUrl(artist: Artist, size: 'small' | 'medium' | 'large' = 'medium'): string {
    const images = artist.images;
    switch (size) {
        case 'small':
            return images[2]?.url || images[0]?.url || '';
        case 'medium':
            return images[1]?.url || images[0]?.url || '';
        case 'large':
            return images[0]?.url || '';
        default:
            return '';
    }
}
