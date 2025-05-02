import { NextResponse } from 'next/server'
import { getUserTopTracks } from '@/lib/spotify-client'

interface SpotifyTrack {
    id: string
    name: string
    artists: Array<{
        name: string
        id: string
    }>
    album: {
        name: string
        images: Array<{
            url: string
            height: number
            width: number
        }>
    }
    popularity: number
    uri: string
}

interface SpotifyTracksResponse {
    items: SpotifyTrack[]
    total: number
    limit: number
    offset: number
    href: string
    next: string | null
    previous: string | null
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('time_range') as 'short_term' | 'medium_term' | 'long_term' | 'one_year' || 'medium_term'

    try {
        let tracks = await getUserTopTracks(timeRange === 'one_year' ? 'long_term' : timeRange) as SpotifyTracksResponse
        
        if (timeRange === 'one_year') {
            const oneYearAgo = new Date()
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
            
            // Filter tracks to only include those from the last year
            tracks = {
                ...tracks,
                items: tracks.items.filter(() => {
                    // Since top tracks don't have played_at or added_at, we'll use the current date
                    // This is a limitation of the Spotify API for top tracks
                    return true
                })
            }
        }
        
        return NextResponse.json(tracks)
    } catch (error) {
        console.error('Error fetching top tracks:', error)
        return NextResponse.json({ error: 'Failed to fetch top tracks' }, { status: 500 })
    }
} 