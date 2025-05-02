'use client';

import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Header() {
    const { data: session } = useSession();

    return (
        <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Spotify Stats</h1>
                <div className="flex items-center gap-4">
                    {session?.user?.image && (
                        <Image
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            className="w-8 h-8 rounded-full"
                            width={32}
                            height={32}
                        />
                    )}
                    <Button variant="outline" onClick={() => signOut()}>
                        Sign Out
                    </Button>
                </div>
            </div>
        </header>
    );
} 