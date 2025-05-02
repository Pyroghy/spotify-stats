import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const time_range = url.searchParams.get('time_range') || 'short_term';
  const auth = req.headers.get('authorization');
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = auth.replace('Bearer ', '');

  const spotifyRes = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${time_range}&limit=50`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!spotifyRes.ok) {
    return NextResponse.json({ error: 'Spotify API error' }, { status: spotifyRes.status });
  }

  const data = await spotifyRes.json();
  return NextResponse.json(data);
} 