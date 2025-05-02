"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type TimeRange = "short_term" | "medium_term" | "long_term"

interface TimeRangeTabsProps {
    value: TimeRange
    onChange: (value: TimeRange) => void
}

const timeRangeLabels = {
    short_term: "Last 4 Weeks",
    medium_term: "Last 6 Months",
    long_term: "All Time"
}

export function TimeRangeTabs({ value, onChange }: TimeRangeTabsProps) {
    return (
        <Tabs value={value} onValueChange={onChange as (value: string) => void} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                {Object.entries(timeRangeLabels).map(([key, label]) => (
                    <TabsTrigger key={key} value={key} className="text-sm">
                        {label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    )
} 