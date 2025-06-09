"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { CheckSquare, Folder, Download, Trash } from "lucide-react"

interface BulkActionsMenuProps {
  selectedCount: number
  onAction: (action: string) => void
}

export function BulkActionsMenu({ selectedCount, onAction }: BulkActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <CheckSquare className="mr-2 h-4 w-4" />
          {selectedCount} Selected
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onAction('categorize')}>
          <Folder className="mr-2 h-4 w-4" />
          Categorize
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction('export')}>
          <Download className="mr-2 h-4 w-4" />
          Export Selected
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onAction('delete')}
          className="text-red-600 dark:text-red-400"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Selected
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}