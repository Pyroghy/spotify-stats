'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function generateCodeVerifier(length: number) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function generateCodeChallenge(codeVerifier: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const base64Url = btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    return base64Url;
}

export default function Home() {
    const handleLogin = async () => {
        const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
        const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
        const scope = 'user-read-email user-read-private user-top-read user-read-recently-played user-library-read user-follow-read playlist-read-private playlist-read-collaborative';
        
        // Generate and store code verifier
        const codeVerifier = generateCodeVerifier(128);
        localStorage.setItem('spotify_code_verifier', codeVerifier);
        
        // Generate code challenge
        const codeChallenge = await generateCodeChallenge(codeVerifier);
        
        const params = new URLSearchParams({
            client_id: clientId!,
            response_type: 'code',
            redirect_uri: redirectUri!,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            scope: scope,
            state: codeVerifier,
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
