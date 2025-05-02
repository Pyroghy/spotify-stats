export type TimeRange = 'short_term' | 'medium_term' | 'long_term';

export interface Track {
    id: string;
    name: string;
    artists: Artist[];
    album: Album;
    duration_ms: number;
    popularity: number;
    uri: string;
}

export interface Artist {
    id: string;
    name: string;
    images: Image[];
    popularity: number;
    genres: string[];
    uri: string;
}

export interface Album {
    id: string;
    name: string;
    images: Image[];
    uri: string;
}

export interface Image {
    url: string;
    height: number;
    width: number;
}

export interface AudioFeatures {
    danceability: number;
    energy: number;
    key: number;
    loudness: number;
    mode: number;
    speechiness: number;
    acousticness: number;
    instrumentalness: number;
    liveness: number;
    valence: number;
    tempo: number;
    type: string;
    id: string;
    uri: string;
    track_href: string;
    analysis_url: string;
    duration_ms: number;
    time_signature: number;
}

export interface UserProfile {
    id: string;
    display_name: string;
    email: string;
    images: Image[];
    uri: string;
} 