import { NextResponse } from 'next/server'
import { getUserTopTracks } from '@/lib/spotify-client'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('time_range') as 'short_term' | 'medium_term' | 'long_term' || 'medium_term'

    try {
        const tracks = await getUserTopTracks(timeRange)
        return NextResponse.json(tracks)
    } catch (error) {
        console.error('Error fetching top tracks:', error)
        return NextResponse.json({ error: 'Failed to fetch top tracks' }, { status: 500 })
    }
} 