'use client';

import { useEffect, useState } from "react";
import { Artist, Track } from "@spotify/web-api-ts-sdk";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyData {
    month: string;
    tracks: Track[];
    artists: Artist[];
    totalMinutes: number;
}

interface YearlyData {
    year: string;
    topArtists: Artist[];
    topTracks: Track[];
    totalMinutes: number;
    genres: { name: string; count: number }[];
}

export function HistoricalData() {
    const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
    const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('yearly');

    useEffect(() => {
        const fetchHistoricalData = async () => {
            try {
                setLoading(true);
                const accessToken = localStorage.getItem('spotify_access_token');
                if (!accessToken) return;

                // Fetch data for different time ranges to simulate historical data
                const timeRanges = ['short_term', 'medium_term', 'long_term'];
                const responses = await Promise.all(
                    timeRanges.map(range =>
                        fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${range}&limit=50`, {
                            headers: { 'Authorization': `Bearer ${accessToken}` }
                        }).then(res => res.json())
                    )
                );

                // Process the data to create historical view
                // Note: This is a simulation since Spotify API doesn't provide actual historical data
                const currentDate = new Date();
                const monthlyDataSimulated = Array.from({ length: 12 }, (_, i) => {
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                    // Generate a more realistic monthly listening time (between 20-100 hours)
                    const hours = Math.floor(Math.random() * 80) + 20;
                    return {
                        month: date.toLocaleString('default', { month: 'long', year: 'numeric' }),
                        tracks: responses[Math.floor(i / 4)]?.items || [],
                        artists: [],
                        totalMinutes: hours * 60 // Convert hours to minutes
                    };
                }).reverse();

                const yearlyDataSimulated = Array.from({ length: 3 }, (_, i) => {
                    // Generate a more realistic yearly listening time (between 300-1200 hours)
                    const hours = Math.floor(Math.random() * 900) + 300;
                    return {
                        year: String(currentDate.getFullYear() - i),
                        topArtists: [],
                        topTracks: responses[i]?.items || [],
                        totalMinutes: hours * 60, // Convert hours to minutes
                        genres: [
                            { name: 'Pop', count: Math.floor(Math.random() * 100) },
                            { name: 'Rock', count: Math.floor(Math.random() * 100) },
                            { name: 'Hip Hop', count: Math.floor(Math.random() * 100) }
                        ]
                    };
                }).reverse();

                setMonthlyData(monthlyDataSimulated);
                setYearlyData(yearlyDataSimulated);
            } catch (error) {
                console.error('Error fetching historical data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistoricalData();
    }, []);

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
            return `${hours} hours`;
        }
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        return `${days}d ${remainingHours}h`;
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="h-[400px] animate-pulse bg-muted rounded" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                        <TabsTrigger value="yearly">Year over Year</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
                    </TabsList>

                    <TabsContent value="yearly" className="space-y-4">
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={yearlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="year" />
                                    <YAxis 
                                        label={{ value: 'Time Listened', angle: -90, position: 'insideLeft' }}
                                        tickFormatter={(value) => formatTime(value)}
                                    />
                                    <Tooltip 
                                        formatter={(value: number) => [formatTime(value), 'Time Listened']}
                                    />
                                    <Bar dataKey="totalMinutes" fill="#8884d8" name="Time Listened" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            {yearlyData.map((year) => (
                                <div key={year.year} className="p-4 rounded-lg border">
                                    <h3 className="font-bold text-lg mb-2">{year.year}</h3>
                                    <div className="space-y-2">
                                        <p>Total Listening Time: {formatTime(year.totalMinutes)}</p>
                                        <p>Top Genres:</p>
                                        <ul className="list-disc list-inside">
                                            {year.genres.map((genre) => (
                                                <li key={genre.name}>{genre.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="monthly" className="space-y-4">
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="month" 
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis 
                                        label={{ value: 'Time Listened', angle: -90, position: 'insideLeft' }}
                                        tickFormatter={(value) => formatTime(value)}
                                    />
                                    <Tooltip 
                                        formatter={(value: number) => [formatTime(value), 'Time Listened']}
                                    />
                                    <Bar dataKey="totalMinutes" fill="#82ca9d" name="Time Listened" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {monthlyData.slice(-3).reverse().map((month) => (
                                <div key={month.month} className="p-4 rounded-lg border">
                                    <h3 className="font-bold text-lg mb-2">{month.month}</h3>
                                    <div className="space-y-2">
                                        <p>Total Listening Time: {formatTime(month.totalMinutes)}</p>
                                        <p>Top Tracks: {month.tracks.slice(0, 3).map(track => track.name).join(', ')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
} 