'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get URL parameters
                const params = new URLSearchParams(window.location.search);
                const code = params.get('code');
                const error = params.get('error');

                if (error) {
                    console.error('Authorization error:', error);
                    router.push('/');
                    return;
                }

                if (!code) {
                    console.error('No code found in URL parameters');
                    router.push('/');
                    return;
                }

                // Get stored code verifier
                const codeVerifier = localStorage.getItem('spotify_code_verifier');
                if (!codeVerifier) {
                    console.error('No code verifier found in storage');
                    router.push('/');
                    return;
                }

                // Exchange code for access token
                const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
                        grant_type: 'authorization_code',
                        code: code,
                        redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!,
                        code_verifier: codeVerifier,
                    }),
                });

                if (!tokenResponse.ok) {
                    const errorData = await tokenResponse.json().catch(() => ({}));
                    console.error('Token exchange failed:', tokenResponse.status, errorData);
                    router.push('/');
                    return;
                }

                const tokens = await tokenResponse.json();

                // Store tokens
                localStorage.setItem('spotify_access_token', tokens.access_token);
                if (tokens.refresh_token) {
                    localStorage.setItem('spotify_refresh_token', tokens.refresh_token);
                }

                // Clear PKCE code verifier
                localStorage.removeItem('spotify_code_verifier');

                // Redirect to stats page
                router.push('/stats');
            } catch (error) {
                console.error('Callback error:', error);
                router.push('/');
            }
        };

        handleCallback();
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Connecting to Spotify...</h1>
                <p className="text-muted-foreground">Please wait while we complete the connection.</p>
            </div>
        </div>
    );
} 