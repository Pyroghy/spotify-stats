'use client';

import { Header } from "@/components/layout/Header";
import { TopTracks } from "@/components/stats/TopTracks";
import { TopArtists } from "@/components/stats/TopArtists";
import { TopGenres } from "@/components/stats/TopGenres";
import { RecentlyPlayed } from "@/components/stats/RecentlyPlayed";
import { AudioFeatures } from "@/components/stats/AudioFeatures";
import { HistoricalData } from "@/components/stats/HistoricalData";
import { LifetimeStats } from "@/components/stats/LifetimeStats";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StatsPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            console.log('Checking auth...');
            console.log('Current URL:', window.location.href);
            
            // Get the hash parameters from the URL
            const hash = window.location.hash.substring(1);
            console.log('Hash:', hash);
            
            const params = new URLSearchParams(hash);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            
            console.log('Access token:', accessToken ? 'Present' : 'Missing');
            console.log('Refresh token:', refreshToken ? 'Present' : 'Missing');

            if (!accessToken) {
                console.log('No access token found, redirecting to home...');
                window.location.href = '/';
                return;
            }

            // Store the tokens in localStorage
            localStorage.setItem('spotify_access_token', accessToken);
            if (refreshToken) {
                localStorage.setItem('spotify_refresh_token', refreshToken);
            }

            console.log('Tokens stored in localStorage');

            // Clear the hash from the URL
            window.history.replaceState({}, document.title, window.location.pathname);
            console.log('Hash cleared from URL');

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
        console.log('Not authenticated, rendering null');
        return null;
    }

    console.log('Rendering stats page');
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto py-8 px-4 max-w-7xl">
                <div className="space-y-8">
                    {/* Lifetime Stats Section */}
                    <section>
                        <h2 className="text-3xl font-bold mb-6">Lifetime Overview</h2>
                        <LifetimeStats />
                    </section>

                    {/* Two-column layout for top tracks and artists */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <section>
                            <h2 className="text-3xl font-bold mb-6">Your Top Tracks</h2>
                            <TopTracks />
                        </section>
                        
                        <section>
                            <h2 className="text-3xl font-bold mb-6">Your Top Artists</h2>
                            <TopArtists />
                        </section>
                    </div>

                    {/* Full-width genres section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <section className="md:col-span-2">
                            <h2 className="text-3xl font-bold mb-6">Your Top Genres</h2>
                            <TopGenres />
                        </section>
                    </div>
                    
                    {/* Historical Data Section */}
                    <section>
                        <h2 className="text-3xl font-bold mb-6">Historical Data</h2>
                        <HistoricalData />
                    </section>

                    {/* Other sections */}
                    <section>
                        <h2 className="text-3xl font-bold mb-6">Recently Played</h2>
                        <RecentlyPlayed />
                    </section>
                    
                    <section>
                        <h2 className="text-3xl font-bold mb-6">Audio Features</h2>
                        <AudioFeatures />
                    </section>
                </div>
            </main>
        </div>
    );
} 