import { NextResponse } from 'next/server'
import { getUserTopArtists } from '@/lib/spotify-client'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('time_range') as 'short_term' | 'medium_term' | 'long_term' || 'medium_term'

    try {
        const artists = await getUserTopArtists(timeRange)
        return NextResponse.json(artists)
    } catch (error) {
        console.error('Error fetching top artists:', error)
        return NextResponse.json({ error: 'Failed to fetch top artists' }, { status: 500 })
    }
} 