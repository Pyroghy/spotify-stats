'use client';

import { useEffect, useState } from "react";
import { PlayHistory } from "@spotify/web-api-ts-sdk";
import { getRecentlyPlayed } from "@/lib/spotify";
import { formatDuration } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';

export function RecentlyPlayed() {
    const [playHistory, setPlayHistory] = useState<PlayHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                setLoading(true);
                const data = await getRecentlyPlayed();
                setPlayHistory(data);
            } catch (error) {
                console.error('Error fetching recently played tracks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTracks();
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
                    {playHistory.map((item) => (
                        <div key={item.track.id} className="flex items-center space-x-4">
                            <Image
                                src={item.track.album.images[0]?.url}
                                alt={item.track.name}
                                width={48}
                                height={48}
                                className="rounded"
                            />
                            <div className="flex-1">
                                <div className="font-medium">{item.track.name}</div>
                                <div className="text-sm text-muted-foreground">
                                    {item.track.artists.map(artist => artist.name).join(', ')}
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {formatDuration(item.track.duration_ms)}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
} 