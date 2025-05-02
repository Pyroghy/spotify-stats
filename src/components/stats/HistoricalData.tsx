'use client';

import { useEffect, useState } from "react";
import { Track } from "@spotify/web-api-ts-sdk";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from 'next-auth/react';
import { formatDuration } from '@/lib/utils';

const timeRanges = [
  { key: 'short_term', label: 'Last 4 Weeks' },
  { key: 'medium_term', label: 'Last 6 Months' },
  { key: 'long_term', label: 'All Time' },
];

export function HistoricalData() {
    const { data: session } = useSession();
    const [tracksByRange, setTracksByRange] = useState<Record<string, Track[]>>({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('short_term');

    useEffect(() => {
        const fetchData = async () => {
            if (!session?.accessToken || !session?.refreshToken || !session?.expiresAt) return;
            setLoading(true);
            try {
                const results: Record<string, Track[]> = {};
                for (const { key } of timeRanges) {
                    const res = await fetch(`/api/spotify/top-tracks?time_range=${key}`, {
                        headers: { 'Authorization': `Bearer ${session.accessToken}` }
                    });
                    const data = await res.json();
                    results[key] = data.items || [];
                }
                setTracksByRange(results);
            } catch (e) {
                console.error('Error fetching historical data:', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [session]);

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="h-[400px] animate-pulse bg-muted rounded" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-6">
                <div className="mb-4 text-sm text-muted-foreground">
                    <strong>Note:</strong> Spotify does not provide true historical listening data per month/year. The data below shows your top tracks for each available time range.
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                        {timeRanges.map(({ key, label }) => (
                            <TabsTrigger key={key} value={key}>{label}</TabsTrigger>
                        ))}
                    </TabsList>
                    {timeRanges.map(({ key, label }) => {
                        const tracks = tracksByRange[key] || [];
                        const totalMs = tracks.reduce((acc, t) => acc + (t.duration_ms || 0), 0);
                        return (
                            <TabsContent key={key} value={key} className="space-y-4">
                                <h3 className="text-lg font-bold mb-2">{label}</h3>
                                <div className="mb-2">Total Listening Time (Top Tracks): <span className="font-mono">{formatDuration(totalMs)}</span></div>
                                <div className="space-y-2">
                                    {tracks.map((track, idx) => (
                                        <div key={track.id} className="flex items-center gap-4 p-2 border rounded">
                                            <span className="w-6 text-right text-muted-foreground">{idx + 1}</span>
                                            <span className="flex-1 truncate">{track.name} <span className="text-xs text-muted-foreground">by {track.artists.map(a => a.name).join(', ')}</span></span>
                                            <span className="text-xs text-muted-foreground">{formatDuration(track.duration_ms)}</span>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        );
                    })}
                </Tabs>
            </CardContent>
        </Card>
    );
} 