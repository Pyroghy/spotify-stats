'use client';

import { Header } from "@/components/layout/Header";
import { TopTracks } from "@/components/stats/TopTracks";
import { TopArtists } from "@/components/stats/TopArtists";
import { RecentlyPlayed } from "@/components/stats/RecentlyPlayed";
import { AudioFeatures } from "@/components/stats/AudioFeatures";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StatsPage() {
    const router = useRouter();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Get the access token from the URL hash
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const token = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const error = params.get('error');
        const errorDetails = params.get('details');

        if (error) {
            console.error('Auth error:', error, errorDetails);
            setError(error);
            return;
        }

        if (!token) {
            console.error('No access token found');
            router.push('/');
            return;
        }

        // Store tokens in localStorage (temporary solution)
        if (refreshToken) {
            localStorage.setItem('spotify_refresh_token', refreshToken);
        }
        localStorage.setItem('spotify_access_token', token);

        setAccessToken(token);
    }, [router]);

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Authentication Error</h1>
                    <p className="text-muted-foreground">{error}</p>
                    <button 
                        onClick={() => router.push('/')}
                        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!accessToken) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Loading...</h1>
                    <p className="text-muted-foreground">Please wait while we authenticate your session.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container py-6">
                <div className="grid gap-6">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Your Top Tracks</h2>
                        <TopTracks accessToken={accessToken} />
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Your Top Artists</h2>
                        <TopArtists accessToken={accessToken} />
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Recently Played</h2>
                        <RecentlyPlayed accessToken={accessToken} />
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Audio Features</h2>
                        <AudioFeatures accessToken={accessToken} />
                    </section>
                </div>
            </main>
        </div>
    );
} 