"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/navigation'

interface SpotifyUser {
    display_name: string
    email: string
    images?: { url: string }[]
}

export default function Dashboard() {
    const [user, setUser] = useState<SpotifyUser | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const response = await fetch('/api/auth/me')
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile')
                }
                const data = await response.json()
                setUser(data)
            } catch (error) {
                console.error('Error fetching user profile:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUserProfile()
    }, [])

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            router.push('/')
        } catch (error) {
            console.error('Error logging out:', error)
        }
    }

    if (loading) {
        return (
            <main className="container mx-auto p-4">
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold">Loading...</h2>
                    </div>
                </div>
            </main>
        )
    }

    if (!user) {
        return (
            <main className="container mx-auto p-4">
                <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>Not Logged In</CardTitle>
                            <CardDescription>
                                Please log in to view your dashboard
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={() => router.push('/')}
                            >
                                Go to Login
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        )
    }

    return (
        <main className="container mx-auto p-4">
            <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground mt-2">
                            Welcome back, {user.display_name}!
                        </p>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Profile</CardTitle>
                        <CardDescription>
                            Your Spotify account information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            {user.images?.[0]?.url && (
                                <img
                                    src={user.images[0].url}
                                    alt={user.display_name}
                                    className="w-16 h-16 rounded-full"
                                />
                            )}
                            <div>
                                <h3 className="text-lg font-semibold">{user.display_name}</h3>
                                <p className="text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
} 