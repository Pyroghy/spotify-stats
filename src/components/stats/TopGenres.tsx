'use client';

import { useEffect, useState } from "react";
import { Artist } from "@spotify/web-api-ts-sdk";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from 'next/image';
import { getTopArtists } from '../../lib/spotify';
import { useSession } from 'next-auth/react';
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

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
    const { data: session } = useSession();

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                setLoading(true);
                if (!session?.accessToken || !session?.refreshToken || !session?.expiresAt) return;
                const actualTimeRange = timeRange === 'year' ? 'long_term' : timeRange;
                const artists = await getTopArtists({
                    accessToken: session.accessToken,
                    refreshToken: session.refreshToken,
                    expiresAt: session.expiresAt,
                }, actualTimeRange);

                // Count genres and collect top artists for each genre
                const genreMap = new Map<string, { count: number; artists: Artist[] }>();
                let totalGenreOccurrences = 0;
                artists.forEach((artist: Artist) => {
                    if (!artist.genres || artist.genres.length === 0) return;
                    artist.genres.forEach((genre: string) => {
                        totalGenreOccurrences++;
                        if (!genreMap.has(genre)) {
                            genreMap.set(genre, { count: 0, artists: [] });
                        }
                        const genreData = genreMap.get(genre)!;
                        genreData.count++;
                        if (!genreData.artists.some(a => a.id === artist.id)) {
                            genreData.artists.push(artist);
                        }
                    });
                });

                // Convert to array and sort
                const sortedGenres = Array.from(genreMap.entries())
                    .map(([name, data]) => ({
                        name: name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                        count: data.count,
                        percentage: (data.count / totalGenreOccurrences) * 100,
                        artists: data.artists.slice(0, 4), // Top 4 artists for the genre
                    }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5); // Show top 5 genres

                setGenres(sortedGenres);
            } catch (error) {
                console.error('Error fetching top genres:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchGenres();
    }, [timeRange, session]);

    if (loading) {
        return (
            <Card className="w-full col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Top Genres</CardTitle>
                    <div className="h-8 w-[120px] animate-pulse bg-muted rounded" />
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 justify-center items-center min-h-[140px]">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-32 h-32 animate-pulse bg-muted rounded" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Top Genres</CardTitle>
                <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
                    <SelectTrigger className="w-[120px] text-xs h-8">
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
                <div className="flex justify-center items-center min-h-[200px] w-full">
                    <div className="flex flex-row justify-center items-center gap-6 w-full max-w-4xl">
                        <TooltipProvider>
                            {genres.map((genre, index) => (
                                <Tooltip key={genre.name}>
                                    <TooltipTrigger asChild>
                                        <div
                                            className="flex flex-col items-center bg-accent/40 rounded-xl p-5 shadow-md border border-border/30 transition-transform hover:scale-[1.03] hover:shadow-lg group cursor-pointer min-w-[160px] max-w-[220px] w-full relative animate-fade-in"
                                        >
                                            <div className="flex gap-2 mb-3 justify-center w-full overflow-hidden flex-nowrap">
                                                {[0, 1, 2, 3].map(i => {
                                                    const artist = genre.artists[i];
                                                    return (
                                                        <div key={artist?.id ?? i} className="relative w-11 h-11 rounded-md overflow-hidden bg-muted flex items-center justify-center border-2 border-border/60 shadow-sm">
                                                            {artist && artist.images?.[0]?.url ? (
                                                                <Image
                                                                    src={artist.images[0].url}
                                                                    alt={artist.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <span className="text-xs text-muted-foreground">-</span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="text-base font-bold text-center leading-tight mb-1 truncate w-full" title={genre.name}>{index + 1}. {genre.name}</div>
                                            <div className="w-full flex items-center gap-2 mt-1">
                                                <Progress value={genre.percentage} className="flex-1 h-2 bg-muted/60" />
                                                <span className="text-xs text-muted-foreground font-mono w-10 text-right">{genre.percentage.toFixed(1)}%</span>
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-xs text-center">
                                        <div>
                                            <div className="font-semibold mb-1">Top Artists for {genre.name}</div>
                                            <div className="flex flex-wrap gap-2 justify-center">
                                                {genre.artists.map(artist => (
                                                    <span key={artist.id} className="text-xs bg-muted px-2 py-1 rounded-full truncate max-w-[100px]">{artist.name}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </TooltipProvider>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 