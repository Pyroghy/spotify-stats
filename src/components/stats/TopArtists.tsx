'use client';

import { useEffect, useState } from "react";
import { Artist as SpotifyArtist } from "@spotify/web-api-ts-sdk";
import { getTopArtists } from "@/lib/spotify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from 'next/image';

interface TopArtistsProps {
    accessToken: string;
}

export function TopArtists({ accessToken }: TopArtistsProps) {
    const [artists, setArtists] = useState<SpotifyArtist[]>([]);
    const [timeRange, setTimeRange] = useState<'short_term' | 'medium_term' | 'long_term'>('medium_term');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                setLoading(true);
                const data = await getTopArtists(accessToken, timeRange);
                setArtists(data);
            } catch (error) {
                console.error('Error fetching top artists:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArtists();
    }, [accessToken, timeRange]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Top Artists</CardTitle>
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
                    {artists.map((artist, index) => (
                        <div key={artist.id} className="flex items-center space-x-4">
                            <span className="text-muted-foreground w-8">{index + 1}</span>
                            <Image
                                src={artist.images[0]?.url}
                                alt={artist.name}
                                width={48}
                                height={48}
                                className="rounded-full"
                            />
                            <div className="flex-1">
                                <div className="font-medium">{artist.name}</div>
                                <div className="text-sm text-muted-foreground">
                                    {artist.genres.slice(0, 2).join(', ')}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 