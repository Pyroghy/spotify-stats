'use client';

import { useEffect, useState } from "react";
import { Track as SpotifyTrack } from "@spotify/web-api-ts-sdk";
import { getRecentlyPlayed } from "@/lib/spotify";
import { formatDuration } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';

export function RecentlyPlayed() {
    const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentlyPlayed = async () => {
            try {
                setLoading(true);
                const data = await getRecentlyPlayed();
                setTracks(data.map(item => item.track));
            } catch (error) {
                console.error('Error fetching recently played tracks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecentlyPlayed();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recently Played</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {tracks.map((track) => (
                        <div key={track.id} className="flex items-center space-x-4">
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