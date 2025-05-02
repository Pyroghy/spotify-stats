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

interface GenreCount {
    name: string;
    count: number;
    percentage: number;
    artists: Artist[];
}

export function TopGenres() {
    const [genres, setGenres] = useState<GenreCount[]>([]);
    const [timeRange, setTimeRange] = useState<TimeRange>('short_term');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                setLoading(true);
                const accessToken = localStorage.getItem('spotify_access_token');
                if (!accessToken) return;

                const limit = 50; // Fetch maximum artists to get better genre distribution
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
                let artists = data.items as Artist[];

                // If timeRange is 'year', filter artists with recent releases
                if (timeRange === 'year') {
                    const oneYearAgo = new Date();
                    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                    artists = artists.slice(0, 20);
                }

                // Group artists by genre
                const genreArtists = new Map<string, Artist[]>();
                artists.forEach(artist => {
                    artist.genres.forEach(genre => {
                        if (!genreArtists.has(genre)) {
                            genreArtists.set(genre, []);
                        }
                        genreArtists.get(genre)?.push(artist);
                    });
                });

                // Convert to array and sort
                const sortedGenres = Array.from(genreArtists.entries())
                    .map(([name, artistList]) => ({
                        name: name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                        count: artistList.length,
                        percentage: (artistList.length / artists.length) * 100,
                        artists: artistList.slice(0, 4) // Keep top 4 artists for each genre
                    }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 10);

                setGenres(sortedGenres);
            } catch (error) {
                console.error('Error fetching top genres:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, [timeRange]);

    if (loading) {
        return (
            <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Top Genres</CardTitle>
                    <div className="h-10 w-[180px] animate-pulse bg-muted rounded" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center space-x-4">
                                    <div className="w-8 h-4 animate-pulse bg-muted rounded" />
                                    <div className="flex-1">
                                        <div className="h-4 w-48 animate-pulse bg-muted rounded" />
                                    </div>
                                    <div className="w-16 h-4 animate-pulse bg-muted rounded" />
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {[...Array(4)].map((_, j) => (
                                        <div key={j} className="aspect-square animate-pulse bg-muted rounded" />
                                    ))}
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
                <CardTitle>Top Genres</CardTitle>
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
                <div className="space-y-6">
                    {genres.map((genre, index) => (
                        <div key={genre.name} className="space-y-2">
                            <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent transition-colors">
                                <span className="text-muted-foreground w-8 text-right">{index + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{genre.name}</div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {genre.percentage.toFixed(1)}%
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {genre.artists.map((artist) => (
                                    <div key={artist.id} className="relative aspect-square rounded-md overflow-hidden group">
                                        <Image
                                            src={artist.images[0]?.url}
                                            alt={artist.name}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                            sizes="(max-width: 768px) 25vw, 20vw"
                                            unoptimized
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-end">
                                            <span className="text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                                {artist.name}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 