'use client';

import { Header } from "@/components/layout/Header";
import { TopTracks } from "@/components/stats/TopTracks";
import { TopArtists } from "@/components/stats/TopArtists";
import { TopGenres } from "@/components/stats/TopGenres";
import { RecentlyPlayed } from "@/components/stats/RecentlyPlayed";
import { LifetimeStats } from "@/components/stats/LifetimeStats";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-muted-foreground">Please wait while we load your data.</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

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
          
          {/* Other sections */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Recently Played</h2>
            <RecentlyPlayed />
          </section>
        </div>
      </main>
    </div>
  );
} 