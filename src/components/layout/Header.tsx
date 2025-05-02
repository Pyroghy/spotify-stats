'use client';

import { Button } from "@/components/ui/button";
import { spotifyApi } from "@/lib/spotify";
import Link from "next/link";
import { useState, useEffect } from "react";
import { UserProfile } from "@spotify/web-api-ts-sdk";

export function Header() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const profile = await spotifyApi.currentUser.profile();
                setUser(profile);
            } catch {
                // Not logged in or token expired
                setUser(null);
            }
        };

        checkAuth();
    }, []);

    const handleLogin = async () => {
        try {
            setIsLoading(true);
            setError(null);
            await spotifyApi.authenticate();
            // After successful authentication, fetch user profile
            const profile = await spotifyApi.currentUser.profile();
            setUser(profile);
        } catch (error) {
            console.error('Error during authentication:', error);
            setError('Failed to login. Please make sure you have set up your Spotify app correctly.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        // Clear the token from localStorage
        localStorage.removeItem('spotify-sdk:token');
        // Reset user state
        setUser(null);
        // Reset error state
        setError(null);
        // Redirect to home page
        window.location.href = '/';
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 flex">
                    <Link className="mr-6 flex items-center space-x-2" href="/">
                        <span className="font-bold">Spotify Stats</span>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    {error && (
                        <span className="text-sm text-red-500 mr-4">{error}</span>
                    )}
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm">
                                Logged in as {user.display_name}
                            </span>
                            <Button 
                                onClick={handleLogout} 
                                variant="outline"
                            >
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <Button 
                            onClick={handleLogin} 
                            variant="default"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login with Spotify'}
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
} 