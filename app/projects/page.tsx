"use client"

import { Card } from "@/components/ui/card"
import { ProjectManagement } from "@/components/projects";

if (!ProjectManagement) {
  console.error("ProjectManagement component is undefined.");
}
export default function ProjectsPage() {
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
      </div>

      <Card className="p-6">
        <ProjectManagement />
      </Card>
    </div>
  )
}