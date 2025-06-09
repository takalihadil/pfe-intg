"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Cookies from "js-cookie";

interface TimeEntry {
  id: string;
  userId: string;
  projectId: string;
  taskId: string;
  description: string;
  startTime: string;
  endTime: string | null;
  totalTime: number | null;
  project: {
    id: string;
    name: string;
    description: string;
    userId: string;
  };
  task: {
    id: string;
    title: string;
    description: string;
    status: string;
    userId: string;
    projectId: string;
    estimatedHours: number;
    createdAt: string;
    updatedAt: string;
  };
}

export function TimeTrackerEntries() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) throw new Error("No authentication token found");

        const response = await fetch("http://localhost:3000/time-entry", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch time entries");
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setEntries(data);
        } else {
          console.error("Unexpected data format:", data);
          setEntries([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  // Function to format date string to HH:mm
  const formatTime = (isoString: string | null) => {
    if (!isoString) return "Ongoing";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Function to convert totalTime (milliseconds) into HH:mm format
 // Function to convert totalTime (minutes) into HH:mm format correctly
const formatTotalTime = (totalTime: number | null) => {
  if (totalTime === null || totalTime < 0) return "N/A";

  if (totalTime < 60) {
    return `${totalTime} min`; // Show minutes if under 60
  } else {
    const hours = Math.floor(totalTime / 60); // Convert to hours
    const minutes = totalTime % 60; // Get remaining minutes
    return minutes === 0 ? `${hours} hr` : `${hours} hr ${minutes} min`;
  }
};


  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Time Entries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <p>Loading...</p>
          ) : entries.length > 0 ? (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="flex justify-between items-center p-4 rounded-lg bg-muted/50"
              >
                {/* Left Side: Project Name, Task Title, Description */}
                <div>
                  <div className="font-medium"><p>{entry.project.name}</p></div>
                  
                  <div className="text-sm text-muted-foreground"><p>{entry.task.title} - {entry.task.description}</p>
                </div></div>

                {/* Right Side: Start - End Time & Time Spent */}

                <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                </div>
                <div className="font-mono">{formatTotalTime(entry.totalTime)}</div>
              </div>
               
              </div>
            ))
          ) : (
            <p>No time entries found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
