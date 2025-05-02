'use client';

import { useEffect, useState } from "react";
import { Track } from "@spotify/web-api-ts-sdk";
import { formatDuration } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from 'next/image';

export function TopTracks() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [timeRange, setTimeRange] = useState<'short_term' | 'medium_term' | 'long_term'>('medium_term');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                setLoading(true);
                const accessToken = localStorage.getItem('spotify_access_token');
                if (!accessToken) return;

                const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=20`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch top tracks');
                }

                const data = await response.json();
                setTracks(data.items);
            } catch (error) {
                console.error('Error fetching top tracks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTracks();
    }, [timeRange]);

    if (loading) {
        return (
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Top Tracks</CardTitle>
                    <div className="h-10 w-[180px] animate-pulse bg-muted rounded" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <div className="w-8 h-4 animate-pulse bg-muted rounded" />
                                <div className="w-12 h-12 animate-pulse bg-muted rounded" />
                                <div className="flex-1">
                                    <div className="h-4 w-48 animate-pulse bg-muted rounded mb-2" />
                                    <div className="h-3 w-32 animate-pulse bg-muted rounded" />
                                </div>
                                <div className="w-16 h-4 animate-pulse bg-muted rounded" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Top Tracks</CardTitle>
                <Select value={timeRange} onValueChange={(value: 'short_term' | 'medium_term' | 'long_term') => setTimeRange(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="short_term">Last 4 Weeks</SelectItem>
                        <SelectItem value="medium_term">Last 6 Months</SelectItem>
                        <SelectItem value="long_term">All Time</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {tracks.map((track, index) => (
                        <div key={track.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent transition-colors">
                            <span className="text-muted-foreground w-8 text-right">{index + 1}</span>
                            <Image
                                src={track.album.images[0]?.url}
                                alt={track.name}
                                width={48}
                                height={48}
                                className="rounded-md"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{track.name}</div>
                                <div className="text-sm text-muted-foreground truncate">
                                    {track.artists.map(artist => artist.name).join(', ')}
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground whitespace-nowrap">
                                {formatDuration(track.duration_ms)}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 