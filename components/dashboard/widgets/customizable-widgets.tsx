"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, LayoutGrid, X } from "lucide-react"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"

interface Widget {
  id: string
  title: string
  type: string
  enabled: boolean
}

const availableWidgets: Widget[] = [
  { id: "revenue", title: "Revenue Overview", type: "chart", enabled: true },
  { id: "expenses", title: "Expense Breakdown", type: "chart", enabled: true },
  { id: "goals", title: "Goal Progress", type: "progress", enabled: true },
  { id: "tasks", title: "Recent Tasks", type: "list", enabled: false },
  { id: "time", title: "Time Tracking", type: "stats", enabled: false },
]

export function CustomizableWidgets() {
  const [widgets, setWidgets] = useState(availableWidgets)
  const [isCustomizing, setIsCustomizing] = useState(false)

  const enabledWidgets = widgets.filter(w => w.enabled)
  const disabledWidgets = widgets.filter(w => !w.enabled)

  const handleToggleWidget = (id: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === id ? { ...widget, enabled: !widget.enabled } : widget
    ))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Widgets</h2>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsCustomizing(!isCustomizing)}
        >
          {isCustomizing ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Done
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Customize
            </>
          )}
        </Button>
      </div>

      {isCustomizing ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Active Widgets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {enabledWidgets.map((widget) => (
                  <div
                    key={widget.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <span>{widget.title}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleWidget(widget.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Widgets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {disabledWidgets.map((widget) => (
                  <div
                    key={widget.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <span>{widget.title}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleWidget(widget.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  )
}