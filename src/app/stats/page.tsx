'use client';

import { Header } from "@/components/layout/Header";
import { TopTracks } from "@/components/stats/TopTracks";
import { TopArtists } from "@/components/stats/TopArtists";
import { RecentlyPlayed } from "@/components/stats/RecentlyPlayed";
import { AudioFeatures } from "@/components/stats/AudioFeatures";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StatsPage() {
    const router = useRouter();

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
            router.push('/');
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
    }, [router]);

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