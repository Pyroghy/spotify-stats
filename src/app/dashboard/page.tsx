"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from 'next/image'

interface SpotifyUser {
    display_name: string
    email: string
    images?: { url: string }[]
}

interface SpotifyTrack {
    id: string
    name: string
    artists: { name: string }[]
    album: {
        name: string
        images: { url: string }[]
    }
}

interface SpotifyArtist {
    id: string
    name: string
    images: { url: string }[]
    genres: string[]
}

interface SpotifyPlayHistory {
    track: SpotifyTrack
    played_at: string
}

type TimeRange = 'short_term' | 'medium_term' | 'long_term' | 'one_year';

export default function Dashboard() {
    const [user, setUser] = useState<SpotifyUser | null>(null)
    const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([])
    const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([])
    const [recentlyPlayed, setRecentlyPlayed] = useState<SpotifyPlayHistory[]>([])
    const [timeRange, setTimeRange] = useState<TimeRange>('medium_term')
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function fetchData() {
            try {
                const [userResponse, tracksResponse, artistsResponse, recentResponse] = await Promise.all([
                    fetch('/api/auth/me'),
                    fetch(`/api/spotify/top-tracks?time_range=${timeRange}`),
                    fetch(`/api/spotify/top-artists?time_range=${timeRange}`),
                    fetch('/api/spotify/recently-played')
                ]);

                if (!userResponse.ok || !tracksResponse.ok || !artistsResponse.ok || !recentResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const [userData, tracksData, artistsData, recentData] = await Promise.all([
                    userResponse.json(),
                    tracksResponse.json(),
                    artistsResponse.json(),
                    recentResponse.json()
                ]);

                setUser(userData);
                setTopTracks(tracksData.items || tracksData);
                setTopArtists(artistsData.items || artistsData);
                setRecentlyPlayed(recentData.items || recentData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [timeRange]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            router.push('/')
        } catch (error) {
            console.error('Error logging out:', error)
        }
    }

    const timeRangeLabels = {
        short_term: 'Last 4 Weeks',
        medium_term: 'Last 6 Months',
        long_term: 'All Time',
        one_year: 'Last Year'
    }

    if (loading) {
        return (
            <main className="container mx-auto p-4">
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold">Loading...</h2>
                    </div>
                </div>
            </main>
        )
    }

    if (!user) {
        return (
            <main className="container mx-auto p-4">
                <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>Not Logged In</CardTitle>
                            <CardDescription>
                                Please log in to view your dashboard
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={() => router.push('/')}
                            >
                                Go to Login
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        )
    }

    return (
        <main className="container mx-auto p-4">
            <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground mt-2">
                            Welcome back, {user.display_name}!
                        </p>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Profile</CardTitle>
                        <CardDescription>
                            Your Spotify account information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            {user.images?.[0]?.url && (
                                <Image
                                    src={user.images[0].url}
                                    alt={user.display_name}
                                    width={64}
                                    height={64}
                                    className="rounded-full"
                                />
                            )}
                            <div>
                                <h3 className="text-lg font-semibold">{user.display_name}</h3>
                                <p className="text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="short_term">Last 4 Weeks</SelectItem>
                            <SelectItem value="medium_term">Last 6 Months</SelectItem>
                            <SelectItem value="one_year">Last Year</SelectItem>
                            <SelectItem value="long_term">All Time</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Tabs defaultValue="top-tracks" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="top-tracks">Top Tracks</TabsTrigger>
                        <TabsTrigger value="top-artists">Top Artists</TabsTrigger>
                        <TabsTrigger value="recently-played">Recently Played</TabsTrigger>
                    </TabsList>
                    <TabsContent value="top-tracks">
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Top Tracks</CardTitle>
                                <CardDescription>Your most listened to tracks ({timeRangeLabels[timeRange]})</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topTracks.map((track, index) => (
                                        <div key={track.id} className="flex items-center gap-4">
                                            <div className="text-muted-foreground w-6">{index + 1}</div>
                                            <Image
                                                src={track.album.images[2]?.url}
                                                alt={track.album.name}
                                                width={48}
                                                height={48}
                                                className="rounded"
                                            />
                                            <div>
                                                <div className="font-medium">{track.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {track.artists.map(a => a.name).join(', ')}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="top-artists">
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Top Artists</CardTitle>
                                <CardDescription>Your most listened to artists ({timeRangeLabels[timeRange]})</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topArtists.map((artist, index) => (
                                        <div key={artist.id} className="flex items-center gap-4">
                                            <div className="text-muted-foreground w-6">{index + 1}</div>
                                            <Image
                                                src={artist.images[2]?.url}
                                                alt={artist.name}
                                                width={48}
                                                height={48}
                                                className="rounded-full"
                                            />
                                            <div>
                                                <div className="font-medium">{artist.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {artist.genres.slice(0, 3).join(', ')}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="recently-played">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recently Played</CardTitle>
                                <CardDescription>Your recently played tracks</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentlyPlayed.map((item, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <Image
                                                src={item.track.album.images[2]?.url}
                                                alt={item.track.album.name}
                                                width={48}
                                                height={48}
                                                className="rounded"
                                            />
                                            <div>
                                                <div className="font-medium">{item.track.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {item.track.artists.map(a => a.name).join(', ')}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(item.played_at).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
} 