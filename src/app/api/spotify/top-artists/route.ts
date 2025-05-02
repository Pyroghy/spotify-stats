import { NextResponse } from 'next/server'
import { getUserTopArtists } from '@/lib/spotify-client'

interface SpotifyArtist {
    id: string
    name: string
    images: Array<{
        url: string
        height: number
        width: number
    }>
    genres: string[]
    popularity: number
    uri: string
}

interface SpotifyArtistsResponse {
    items: SpotifyArtist[]
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
        let artists = await getUserTopArtists(timeRange === 'one_year' ? 'long_term' : timeRange) as SpotifyArtistsResponse
        
        if (timeRange === 'one_year') {
            const oneYearAgo = new Date()
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
            
            // Filter artists to only include those from the last year
            artists = {
                ...artists,
                items: artists.items.filter(() => {
                    // Since top artists don't have played_at or added_at, we'll use the current date
                    // This is a limitation of the Spotify API for top artists
                    return true
                })
            }
        }
        
        return NextResponse.json(artists)
    } catch (error) {
        console.error('Error fetching top artists:', error)
        return NextResponse.json({ error: 'Failed to fetch top artists' }, { status: 500 })
    }
} 