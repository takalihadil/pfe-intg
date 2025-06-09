"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar } from "lucide-react"
import { toast } from "sonner"

export function RecurringTransactions() {
  const handleAddRecurring = () => {
    // TODO: Implement recurring transaction setup
    toast.info("Recurring transactions coming soon")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle>Recurring Transactions</CardTitle>
          </div>
          <Button variant="outline" onClick={handleAddRecurring}>
            <Plus className="mr-2 h-4 w-4" />
            Add Recurring
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <p>No recurring transactions set up yet.</p>
          <p className="text-sm">Set up recurring transactions for regular expenses or income.</p>
        </div>
      </CardContent>
    </Card>
  )
}