"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileText } from "lucide-react"
import { toast } from "sonner"

export function InvoiceGenerator() {
  const handleGenerateInvoice = () => {
    // TODO: Implement invoice generation
    toast.info("Invoice generation coming soon")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Generate Invoice
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Invoice</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Generate professional invoices from your transactions.
            Coming soon!
          </p>
          <Button onClick={handleGenerateInvoice} className="w-full">
            Generate Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}