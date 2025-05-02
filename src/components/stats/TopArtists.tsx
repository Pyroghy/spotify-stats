'use client';

import { useEffect, useState } from "react";
import { Artist } from "@spotify/web-api-ts-sdk";
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

export function TopArtists() {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [timeRange, setTimeRange] = useState<TimeRange>('medium_term');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                setLoading(true);
                const accessToken = localStorage.getItem('spotify_access_token');
                if (!accessToken) return;

                // If timeRange is 'year', we'll fetch more artists and filter them
                const limit = timeRange === 'year' ? 50 : 20;
                const actualTimeRange = timeRange === 'year' ? 'long_term' : timeRange;

                const response = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${actualTimeRange}&limit=${limit}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch top artists');
                }

                const data = await response.json();
                let processedArtists = data.items;

                // For year option, we'll just use the top 20 from the larger set
                if (timeRange === 'year') {
                    processedArtists = processedArtists.slice(0, 20);
                }

                setArtists(processedArtists);
            } catch (error) {
                console.error('Error fetching top artists:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArtists();
    }, [timeRange]);

    if (loading) {
        return (
            <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Top Artists</CardTitle>
                    <div className="h-10 w-[180px] animate-pulse bg-muted rounded" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <div className="w-8 h-4 animate-pulse bg-muted rounded" />
                                <div className="w-12 h-12 animate-pulse bg-muted rounded-full" />
                                <div className="flex-1">
                                    <div className="h-4 w-48 animate-pulse bg-muted rounded mb-2" />
                                    <div className="h-3 w-32 animate-pulse bg-muted rounded" />
                                </div>
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
                <CardTitle>Top Artists</CardTitle>
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
                    {artists.map((artist, index) => (
                        <div key={artist.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent transition-colors">
                            <span className="text-muted-foreground w-8 text-right">{index + 1}</span>
                            {artist.images[0]?.url ? (
                                <div className="relative w-12 h-12 flex-shrink-0">
                                    <Image
                                        src={artist.images[0].url}
                                        alt={artist.name}
                                        fill
                                        className="rounded-full object-cover"
                                        sizes="48px"
                                    />
                                </div>
                            ) : (
                                <div className="w-12 h-12 bg-black rounded-full flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{artist.name}</div>
                                <div className="text-sm text-muted-foreground truncate">
                                    {artist.genres.slice(0, 3).join(', ')}
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground whitespace-nowrap">
                                {artist.followers.total.toLocaleString()} followers
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 