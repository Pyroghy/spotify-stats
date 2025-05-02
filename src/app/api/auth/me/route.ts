import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('spotify_access_token');

        if (!accessToken) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${accessToken.value}`,
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: response.status });
        }

        const userData = await response.json();
        return NextResponse.json(userData);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 