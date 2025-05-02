import { SpotifyApi, PlayHistory, Track } from '@spotify/web-api-ts-sdk';

export function getSpotifyClient(session: { accessToken: string, refreshToken: string, expiresAt: number }) {
  return SpotifyApi.withAccessToken(
    process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
    {
      access_token: session.accessToken,
      refresh_token: session.refreshToken,
      token_type: 'Bearer',
      expires_in: session.expiresAt ? Math.floor(session.expiresAt - Date.now() / 1000) : 3600,
    }
  );
}

export async function getRecentlyPlayed(session: { accessToken: string, refreshToken: string, expiresAt: number }): Promise<PlayHistory[]> {
  const sdk = getSpotifyClient(session);
  const response = await sdk.player.getRecentlyPlayedTracks(50);
  return response.items;
}

export async function getTopTracks(session: { accessToken: string, refreshToken: string, expiresAt: number }, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term'): Promise<Track[]> {
  const sdk = getSpotifyClient(session);
  const response = await sdk.currentUser.topItems('tracks', timeRange, 20);
  return response.items;
}

export async function getTopArtists(session: { accessToken: string, refreshToken: string, expiresAt: number }, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term') {
  const sdk = getSpotifyClient(session);
  const response = await sdk.currentUser.topItems('artists', timeRange, 50);
  return response.items;
}

export interface AudioFeature {
  id: string;
  danceability: number;
  energy: number;
  valence: number;
  acousticness: number;
  instrumentalness: number;
}

export async function getAudioFeatures(session: { accessToken: string, refreshToken: string, expiresAt: number }, trackIds: string[]): Promise<AudioFeature[]> {
  // The SDK may not have a direct method, so use fetch as fallback
  const response = await fetch('https://api.spotify.com/v1/audio-features?ids=' + trackIds.join(','), {
    headers: { 'Authorization': `Bearer ${session.accessToken}` }
  });
  const data = await response.json();
  return data.audio_features;
}

export type { Track }; 