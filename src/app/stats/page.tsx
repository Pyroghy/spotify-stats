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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const accessToken = localStorage.getItem('spotify_access_token');
            if (!accessToken) {
                router.push('/');
                return;
            }
            setIsAuthenticated(true);
            setIsLoading(false);
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Loading...</h1>
                    <p className="text-muted-foreground">Please wait while we verify your authentication.</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container py-6">
                <div className="grid gap-6">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Your Top Tracks</h2>
                        <TopTracks />
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Your Top Artists</h2>
                        <TopArtists />
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Recently Played</h2>
                        <RecentlyPlayed />
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Audio Features</h2>
                        <AudioFeatures />
                    </section>
                </div>
            </main>
        </div>
    );
} 