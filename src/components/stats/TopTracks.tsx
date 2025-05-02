'use client';

import { useEffect, useState } from "react";
import { Track } from "@spotify/web-api-ts-sdk";
import { formatDuration } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from 'next/image';

const timeRangeOptions = {
    'short_term': 'Last 4 Weeks',
    'medium_term': 'Last 6 Months',
    'year': 'Last Year',
    'long_term': 'All Time',
} as const;

type TimeRange = keyof typeof timeRangeOptions;

export function TopTracks() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [timeRange, setTimeRange] = useState<TimeRange>('medium_term');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                setLoading(true);
                const accessToken = localStorage.getItem('spotify_access_token');
                if (!accessToken) return;

                // If timeRange is 'year', we'll fetch more tracks and filter them
                const limit = timeRange === 'year' ? 50 : 20;
                const actualTimeRange = timeRange === 'year' ? 'long_term' : timeRange;

                const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${actualTimeRange}&limit=${limit}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch top tracks');
                }

                const data = await response.json();
                let processedTracks = data.items;

                // For year option, filter tracks released in the last year
                if (timeRange === 'year') {
                    const oneYearAgo = new Date();
                    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                    processedTracks = processedTracks.filter((track: Track) => {
                        const releaseDate = new Date(track.album.release_date);
                        return releaseDate >= oneYearAgo;
                    }).slice(0, 20);
                }

                setTracks(processedTracks);
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
            <Card className="w-full">
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
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Top Tracks</CardTitle>
                <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(timeRangeOptions).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {tracks.map((track, index) => (
                        <div key={track.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent transition-colors">
                            <span className="text-muted-foreground w-8 text-right">{index + 1}</span>
                            {track.album.images[0]?.url ? (
                                <div className="relative w-12 h-12 flex-shrink-0">
                                    <Image
                                        src={track.album.images[0].url}
                                        alt={track.name}
                                        fill
                                        className="rounded-md object-cover"
                                        sizes="48px"
                                    />
                                </div>
                            ) : (
                                <div className="w-12 h-12 bg-black rounded-md flex-shrink-0" />
                            )}
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