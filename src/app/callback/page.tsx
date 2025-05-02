'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const code = params.get('code');
                const error = params.get('error');
                const errorDescription = params.get('error_description');

                if (error) {
                    console.error('Auth error:', error, errorDescription);
                    router.push('/');
                    return;
                }

                if (!code) {
                    console.error('No authorization code found');
                    router.push('/');
                    return;
                }

                // Get the stored code verifier
                const codeVerifier = localStorage.getItem('spotify_code_verifier');
                if (!codeVerifier) {
                    console.error('No code verifier found');
                    router.push('/');
                    return;
                }

                // Exchange the code for an access token
                const response = await fetch('https://accounts.spotify.com/api/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        grant_type: 'authorization_code',
                        code,
                        redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!,
                        client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
                        code_verifier: codeVerifier,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Token exchange error:', errorData);
                    router.push('/');
                    return;
                }

                const data = await response.json();
                
                // Store the tokens
                localStorage.setItem('spotify_access_token', data.access_token);
                if (data.refresh_token) {
                    localStorage.setItem('spotify_refresh_token', data.refresh_token);
                }

                // Clean up the code verifier
                localStorage.removeItem('spotify_code_verifier');

                // Redirect to the stats page
                router.push('/stats');
            } catch (error) {
                console.error('Error during callback:', error);
                router.push('/');
            }
        };

        handleCallback();
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Completing Authentication...</h1>
                <p className="text-muted-foreground">Please wait while we complete the authentication process.</p>
            </div>
        </div>
    );
} 