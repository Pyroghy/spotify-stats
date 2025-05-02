"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TimeRangeTabs, TimeRange } from "@/components/time-range-tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Track {
    name: string
    artists: { name: string }[]
    album: { name: string }
    popularity: number
}

interface Artist {
    name: string
    genres: string[]
    images: { url: string }[]
    popularity: number
}

interface RecentTrack {
    track: Track
    played_at: string
}

type SortOption = "name" | "popularity"

export default function Dashboard() {
    const [timeRange, setTimeRange] = useState<TimeRange>("medium_term")
    const [topTracks, setTopTracks] = useState<Track[]>([])
    const [topArtists, setTopArtists] = useState<Artist[]>([])
    const [recentTracks, setRecentTracks] = useState<RecentTrack[]>([])
    const [loading, setLoading] = useState(true)
    const [trackSort, setTrackSort] = useState<SortOption>("popularity")
    const [artistSort, setArtistSort] = useState<SortOption>("popularity")

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [tracksRes, artistsRes, recentRes] = await Promise.all([
                    fetch(`/api/spotify/top-tracks?time_range=${timeRange}`),
                    fetch(`/api/spotify/top-artists?time_range=${timeRange}`),
                    fetch('/api/spotify/recently-played')
                ])

                if (!tracksRes.ok || !artistsRes.ok || !recentRes.ok) {
                    throw new Error('Failed to fetch data')
                }

                const tracks = await tracksRes.json()
                const artists = await artistsRes.json()
                const recent = await recentRes.json()

                setTopTracks(tracks)
                setTopArtists(artists)
                setRecentTracks(recent)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [timeRange])

    const sortItems = <T extends Track | Artist>(items: T[], sortBy: SortOption): T[] => {
        return [...items].sort((a, b) => {
            if (sortBy === "name") {
                return a.name.localeCompare(b.name)
            }
            return b.popularity - a.popularity
        })
    }

    const sortedTracks = sortItems(topTracks, trackSort)
    const sortedArtists = sortItems(topArtists, artistSort)

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    return (
        <main className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-8">Your Spotify Stats</h1>
            
            <div className="mb-8">
                <TimeRangeTabs value={timeRange} onChange={setTimeRange} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Top Tracks</CardTitle>
                        <Select value={trackSort} onValueChange={(value: SortOption) => setTrackSort(value)}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Sort by..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="popularity">Popularity</SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {sortedTracks.slice(0, 10).map((track, index) => (
                                <li key={index} className="flex items-center gap-4">
                                    <span className="text-muted-foreground">{index + 1}</span>
                                    <div>
                                        <p className="font-medium">{track.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {track.artists.map(a => a.name).join(', ')}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Top Artists</CardTitle>
                        <Select value={artistSort} onValueChange={(value: SortOption) => setArtistSort(value)}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Sort by..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="popularity">Popularity</SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {sortedArtists.slice(0, 10).map((artist, index) => (
                                <li key={index} className="flex items-center gap-4">
                                    <span className="text-muted-foreground">{index + 1}</span>
                                    <div>
                                        <p className="font-medium">{artist.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {artist.genres.slice(0, 2).join(', ')}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recently Played</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            {recentTracks.slice(0, 10).map((item, index) => (
                                <li key={index} className="flex items-center gap-4">
                                    <span className="text-muted-foreground">
                                        {new Date(item.played_at).toLocaleTimeString([], { 
                                            hour: '2-digit', 
                                            minute: '2-digit'
                                        })}
                                    </span>
                                    <div>
                                        <p className="font-medium">{item.track.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.track.artists.map(a => a.name).join(', ')}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
} 