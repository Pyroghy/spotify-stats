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

    useEffect(() => {
        // Get the access token from the URL hash
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const token = params.get('access_token');

        if (!token) {
            router.push('/');
            return;
        }

        setAccessToken(token);
    }, [router]);

    if (!accessToken) {
        return null;
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