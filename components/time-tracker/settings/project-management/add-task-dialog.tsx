"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TaskForm } from "./task-form"
import Cookies from "js-cookie"

interface AddTaskDialogProps {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskCreated: (task: any) => void // Callback to update the UI after task creation
}

export function AddTaskDialog({ projectId, open, onOpenChange, onTaskCreated }: AddTaskDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: any) => {
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("No authentication token found.");
  
      const response = await fetch("http://localhost:3000/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          type: data.type,
          visibility: data.visibility,
          status: data.status,
          vision: data.vision,
          impact: data.impact,
          revenueModel: data.revenueModel,
          budgetRange: data.budgetRange, // Adjusted field name to match DTO
          timeline: data.timeline,
          fundingSource: data.fundingSource,
          teamId: data.teamId,
          teamMembers: data.teamMembers,
          location: data.location,
          media: data.media,
          collaborations: data.collaborations,
          projectMilestones: data.projectMilestones,
          aiInsights: data.aiInsights,
          planType: data.planType,
          aiUnlocked: data.aiUnlocked,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add project: ${errorText}`);
      }
  
      onOpenChange(false); // Close the dialog
      refreshProjects(); // Fetch the updated projects list
    } catch (error: any) {
      console.error("Error adding project:", error.message || "Something went wrong");
    }
  };
  
}
