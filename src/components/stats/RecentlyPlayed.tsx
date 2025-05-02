'use client';

import { useEffect, useState } from "react";
import { PlayHistory, Track } from "@spotify/web-api-ts-sdk";
import { getRecentlyPlayed } from "@/lib/spotify";
import { formatDuration } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { useSession } from "next-auth/react";

export function RecentlyPlayed() {
    const { data: session } = useSession();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.accessToken || !session?.refreshToken || !session?.expiresAt) return;
        const fetchTracks = async () => {
            try {
                setLoading(true);
                const data = await getRecentlyPlayed({
                    accessToken: session.accessToken ?? '',
                    refreshToken: session.refreshToken ?? '',
                    expiresAt: session.expiresAt ?? 0,
                });
                setTracks(data.map((item: PlayHistory) => item.track));
            } catch (error) {
                console.error('Error fetching recently played tracks:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTracks();
    }, [session]);

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
                    {tracks.map((track, idx) => (
                        <div key={`${track.id}-${idx}`} className="flex items-center space-x-4">
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
                                    {track.artists.map((artist: { name: string }) => artist.name).join(', ')}
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