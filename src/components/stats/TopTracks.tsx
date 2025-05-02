'use client';

import { useEffect, useState } from "react";
import { Track as SpotifyTrack } from "@spotify/web-api-ts-sdk";
import { getTopTracks } from "@/lib/spotify";
import { formatDuration } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from 'next/image';

interface TopTracksProps {
    accessToken: string;
}

export function TopTracks({ accessToken }: TopTracksProps) {
    const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
    const [timeRange, setTimeRange] = useState<'short_term' | 'medium_term' | 'long_term'>('medium_term');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                setLoading(true);
                const data = await getTopTracks(accessToken, timeRange);
                setTracks(data);
            } catch (error) {
                console.error('Error fetching top tracks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTracks();
    }, [accessToken, timeRange]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Card>
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
                        <div key={track.id} className="flex items-center space-x-4">
                            <span className="text-muted-foreground w-8">{index + 1}</span>
                            <Image
                                src={track.album.images[0]?.url}
                                alt={track.name}
                                width={48}
                                height={48}
                                className="rounded"
                            />
                            <div className="flex-1">
                                <div className="font-medium">{track.name}</div>
                                <div className="text-sm text-muted-foreground">
                                    {track.artists.map(artist => artist.name).join(', ')}
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {formatDuration(track.duration_ms)}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 