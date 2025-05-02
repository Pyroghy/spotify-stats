'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
    const handleLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
        const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
        const scope = 'user-read-email user-read-private user-top-read user-read-recently-played user-read-playback-state';
        const state = crypto.getRandomValues(new Uint8Array(16)).join('');
        
        const params = new URLSearchParams({
            client_id: clientId!,
            response_type: 'code',
            redirect_uri: redirectUri!,
            scope: scope,
            state: state,
        });

        window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
            <Card className="w-full max-w-2xl mx-4">
                <CardHeader>
                    <CardTitle className="text-4xl font-bold text-center">Spotify Stats</CardTitle>
                    <CardDescription className="text-center text-lg">
                        Discover your listening habits and favorite tracks
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <p className="text-center text-muted-foreground">
                        Connect your Spotify account to see your top tracks, artists, and listening statistics.
                        Get insights into your music preferences and discover new music based on your taste.
                    </p>
                    <Button 
                        size="lg"
                        onClick={handleLogin}
                        className="w-full max-w-xs"
                    >
                        Connect with Spotify
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
