"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Calendar, Clock } from "lucide-react"

interface TimeTrackerStatsProps {}

export function TimeTrackerStats({}: TimeTrackerStatsProps) {
  const [stats, setStats] = useState({ today: 0, weekly: 0, monthly: 0,projectsTracked : 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = Cookies.get("token")
        if (!token) throw new Error("No authentication token found.")

        const response = await fetch("http://localhost:3000/time-entry/stats", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to fetch stats: ${errorText}`)
        }

        const data = await response.json()
        setStats(data) // Use API response directly
      } catch (error: any) {
        setError(error.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`; // Show minutes if less than 60
    } else {
      const hours = Math.floor(minutes / 60); // Convert to whole hours
      const remainingMinutes = minutes % 60; // Get remaining minutes
      return remainingMinutes === 0 
        ? `${hours} hr` // Show only hours if no minutes remain
        : `${hours} hr ${remainingMinutes} min`; // Show both if needed
    }
  };
  if (loading) return <div>Loading stats...</div>
  if (error) return <div className="text-red-500">Error: {error}</div>

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTime(stats.today)}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Week</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTime(stats.weekly)}</div>
        </CardContent>
      </Card>
      

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Projects Tracked</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.projectsTracked}</div>
        </CardContent>
      </Card>
    </div>
  );
}
