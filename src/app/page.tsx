'use client';

import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Spotify Stats</h1>
          <p className="text-muted-foreground mb-8">View your Spotify listening statistics</p>
          <Button onClick={() => signIn("spotify")} size="lg">
            Sign in with Spotify
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Spotify Stats</h1>
        <p className="text-muted-foreground mb-8">You are signed in as {session.user?.name}</p>
        <Button onClick={() => router.push('/stats')} size="lg">
          View Your Stats
        </Button>
      </div>
    </div>
  );
}
