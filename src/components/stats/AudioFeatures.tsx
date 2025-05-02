'use client';

import { useEffect, useState } from "react";
import { getTopTracks, getAudioFeatures } from "@/lib/spotify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AudioFeaturesProps {
    accessToken: string;
}

interface AudioFeature {
    id: string;
    danceability: number;
    energy: number;
    valence: number;
    acousticness: number;
    instrumentalness: number;
}

interface SpotifyTrack {
    id: string;
}

export function AudioFeatures({ accessToken }: AudioFeaturesProps) {
    const [features, setFeatures] = useState<AudioFeature[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                setLoading(true);
                const tracks = await getTopTracks('medium_term');
                const trackIds = tracks.slice(0, 5).map((track: SpotifyTrack) => track.id);
                const audioFeatures = await getAudioFeatures(trackIds);
                setFeatures(audioFeatures);
            } catch (error) {
                console.error('Error fetching audio features:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatures();
    }, [accessToken]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const averageFeature = (feature: keyof AudioFeature) => {
        if (feature === 'id') return 0;
        return features.reduce((acc: number, curr) => acc + (curr[feature] as number), 0) / features.length;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Audio Features</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Danceability</span>
                            <span className="text-sm text-muted-foreground">
                                {Math.round(averageFeature('danceability') * 100)}%
                            </span>
                        </div>
                        <Progress value={averageFeature('danceability') * 100} />
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Energy</span>
                            <span className="text-sm text-muted-foreground">
                                {Math.round(averageFeature('energy') * 100)}%
                            </span>
                        </div>
                        <Progress value={averageFeature('energy') * 100} />
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Valence</span>
                            <span className="text-sm text-muted-foreground">
                                {Math.round(averageFeature('valence') * 100)}%
                            </span>
                        </div>
                        <Progress value={averageFeature('valence') * 100} />
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Acousticness</span>
                            <span className="text-sm text-muted-foreground">
                                {Math.round(averageFeature('acousticness') * 100)}%
                            </span>
                        </div>
                        <Progress value={averageFeature('acousticness') * 100} />
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Instrumentalness</span>
                            <span className="text-sm text-muted-foreground">
                                {Math.round(averageFeature('instrumentalness') * 100)}%
                            </span>
                        </div>
                        <Progress value={averageFeature('instrumentalness') * 100} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 