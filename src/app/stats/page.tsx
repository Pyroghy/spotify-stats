import { Header } from "@/components/layout/Header";
import { TopTracks } from "@/components/stats/TopTracks";
import { TopArtists } from "@/components/stats/TopArtists";
import { RecentlyPlayed } from "@/components/stats/RecentlyPlayed";
import { AudioFeatures } from "@/components/stats/AudioFeatures";

export default function StatsPage() {
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