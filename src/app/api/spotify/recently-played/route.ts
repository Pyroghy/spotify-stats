import { NextResponse } from 'next/server'
import { getUserRecentlyPlayed } from '@/lib/spotify-client'

export async function GET() {
    try {
        const tracks = await getUserRecentlyPlayed()
        return NextResponse.json(tracks)
    } catch (error) {
        console.error('Error fetching recently played tracks:', error)
        return NextResponse.json({ error: 'Failed to fetch recently played tracks' }, { status: 500 })
    }
} 