'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Music2, Mic2, ListMusic, Star, Headphones } from "lucide-react";

interface LifetimeStats {
    totalMinutesListened: number;
    uniqueArtists: number;
    uniqueTracks: number;
    totalPlaylists: number;
    savedTracks: number;
    followedArtists: number;
}

export function LifetimeStats() {
    const [stats, setStats] = useState<LifetimeStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLifetimeStats = async () => {
            try {
                setLoading(true);
                const accessToken = localStorage.getItem('spotify_access_token');
                if (!accessToken) return;

                // Fetch various stats in parallel
                const [
                    playlistsResponse,
                    savedTracksResponse,
                    followedArtistsResponse,
                    topArtistsResponse,
                    topTracksResponse
                ] = await Promise.all([
                    // Get user's playlists
                    fetch('https://api.spotify.com/v1/me/playlists', {
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    }).then(res => res.json()),
                    // Get user's saved tracks
                    fetch('https://api.spotify.com/v1/me/tracks?limit=1', {
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    }).then(res => res.json()),
                    // Get user's followed artists
                    fetch('https://api.spotify.com/v1/me/following?type=artist', {
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    }).then(res => res.json()),
                    // Get top artists (all time)
                    fetch('https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50', {
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    }).then(res => res.json()),
                    // Get top tracks (all time)
                    fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50', {
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    }).then(res => res.json())
                ]);

                // Calculate estimated listening time (this is a rough estimation)
                // Average song length is about 3.5 minutes
                const avgSongLength = 3.5;
                const estimatedTotalSongs = savedTracksResponse.total + 
                    (topTracksResponse.items?.length || 0) * 20; // Multiply by 20 to account for repeated listens
                const estimatedTotalMinutes = estimatedTotalSongs * avgSongLength;

                setStats({
                    totalMinutesListened: estimatedTotalMinutes,
                    uniqueArtists: topArtistsResponse.items?.length || 0,
                    uniqueTracks: topTracksResponse.items?.length || 0,
                    totalPlaylists: playlistsResponse.total || 0,
                    savedTracks: savedTracksResponse.total || 0,
                    followedArtists: followedArtistsResponse.artists?.total || 0
                });
            } catch (error) {
                console.error('Error fetching lifetime stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLifetimeStats();
    }, []);

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) {
            const remainingHours = hours % 24;
            return `${days} days, ${remainingHours} hours`;
        }
        return `${hours} hours`;
    };

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}k`;
        }
        return num.toString();
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Lifetime Stats</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center p-4 rounded-lg border animate-pulse">
                                <div className="w-12 h-12 rounded-full bg-muted mb-2" />
                                <div className="h-4 w-20 bg-muted rounded mb-1" />
                                <div className="h-3 w-16 bg-muted rounded" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!stats) return null;

    const statItems = [
        {
            icon: Clock,
            label: 'Estimated Time',
            value: formatTime(stats.totalMinutesListened),
            description: 'Total listening time'
        },
        {
            icon: Music2,
            label: 'Saved Tracks',
            value: formatNumber(stats.savedTracks),
            description: 'Songs in your library'
        },
        {
            icon: Mic2,
            label: 'Artists',
            value: formatNumber(stats.followedArtists),
            description: 'Artists you follow'
        },
        {
            icon: ListMusic,
            label: 'Playlists',
            value: formatNumber(stats.totalPlaylists),
            description: 'Created & followed'
        },
        {
            icon: Star,
            label: 'Top Artists',
            value: formatNumber(stats.uniqueArtists),
            description: 'In your top charts'
        },
        {
            icon: Headphones,
            label: 'Top Tracks',
            value: formatNumber(stats.uniqueTracks),
            description: 'Most played songs'
        }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Lifetime Stats</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {statItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center p-4 rounded-lg border hover:bg-accent transition-colors"
                        >
                            <item.icon className="w-8 h-8 mb-2 text-muted-foreground" />
                            <span className="text-xl font-bold mb-1">{item.value}</span>
                            <span className="text-sm font-medium">{item.label}</span>
                            <span className="text-xs text-muted-foreground text-center">
                                {item.description}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 