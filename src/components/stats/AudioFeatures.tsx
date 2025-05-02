'use client';

import { useEffect, useState } from "react";
import { AudioFeatures as SpotifyAudioFeatures } from "@spotify/web-api-ts-sdk";
import { getTopTracks, getAudioFeatures } from "@/lib/spotify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AudioFeatures() {
    const [features, setFeatures] = useState<SpotifyAudioFeatures[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAudioFeatures = async () => {
            try {
                setLoading(true);
                const tracks = await getTopTracks('medium_term');
                const trackIds = tracks.map(track => track.id);
                const data = await getAudioFeatures(trackIds);
                setFeatures(data);
            } catch (error) {
                console.error('Error fetching audio features:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAudioFeatures();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Calculate average values for each feature
    const averages = features.reduce((acc, feature) => ({
        danceability: acc.danceability + feature.danceability,
        energy: acc.energy + feature.energy,
        valence: acc.valence + feature.valence,
        acousticness: acc.acousticness + feature.acousticness,
        instrumentalness: acc.instrumentalness + feature.instrumentalness,
        liveness: acc.liveness + feature.liveness,
        speechiness: acc.speechiness + feature.speechiness,
    }), {
        danceability: 0,
        energy: 0,
        valence: 0,
        acousticness: 0,
        instrumentalness: 0,
        liveness: 0,
        speechiness: 0,
    });

    const count = features.length;
    const averageFeatures = {
        danceability: averages.danceability / count,
        energy: averages.energy / count,
        valence: averages.valence / count,
        acousticness: averages.acousticness / count,
        instrumentalness: averages.instrumentalness / count,
        liveness: averages.liveness / count,
        speechiness: averages.speechiness / count,
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Audio Features</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">Danceability</span>
                            <span className="text-sm text-muted-foreground">
                                {Math.round(averageFeatures.danceability * 100)}%
                            </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${averageFeatures.danceability * 100}%` }}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">Energy</span>
                            <span className="text-sm text-muted-foreground">
                                {Math.round(averageFeatures.energy * 100)}%
                            </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${averageFeatures.energy * 100}%` }}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">Valence (Happiness)</span>
                            <span className="text-sm text-muted-foreground">
                                {Math.round(averageFeatures.valence * 100)}%
                            </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${averageFeatures.valence * 100}%` }}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">Acousticness</span>
                            <span className="text-sm text-muted-foreground">
                                {Math.round(averageFeatures.acousticness * 100)}%
                            </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${averageFeatures.acousticness * 100}%` }}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">Instrumentalness</span>
                            <span className="text-sm text-muted-foreground">
                                {Math.round(averageFeatures.instrumentalness * 100)}%
                            </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${averageFeatures.instrumentalness * 100}%` }}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">Liveness</span>
                            <span className="text-sm text-muted-foreground">
                                {Math.round(averageFeatures.liveness * 100)}%
                            </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${averageFeatures.liveness * 100}%` }}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-medium">Speechiness</span>
                            <span className="text-sm text-muted-foreground">
                                {Math.round(averageFeatures.speechiness * 100)}%
                            </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${averageFeatures.speechiness * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 