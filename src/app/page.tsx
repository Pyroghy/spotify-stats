"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
    const searchParams = useSearchParams()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const errorParam = searchParams.get('error')
        if (errorParam) {
            setError('Authentication failed. Please try again.')
        }
    }, [searchParams])

    const handleSpotifyLogin = async () => {
        try {
            const response = await fetch('/api/auth/spotify');
            if (!response.ok) {
                throw new Error('Failed to get authorization URL');
            }
            
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                setError('No authorization URL received. Please try again.');
            }
        } catch (error) {
            console.error('Error getting Spotify authorization URL:', error);
            setError('Failed to start authentication. Please try again.');
        }
    }

    return (
        <main className="container mx-auto p-4">
            <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">Spotify Stats</h1>
                    <p className="text-muted-foreground">
                        View your Spotify listening statistics and insights
                    </p>
                </div>

                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Get Started</CardTitle>
                        <CardDescription>
                            Connect your Spotify account to view your listening statistics
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="text-sm text-red-500">
                                {error}
                            </div>
                        )}
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleSpotifyLogin}
                        >
                            Connect with Spotify
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
