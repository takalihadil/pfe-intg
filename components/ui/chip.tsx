"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const chipVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-6",
        sm: "h-5",
        lg: "h-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  onDelete?: () => void
  disabled?: boolean
  icon?: React.ReactNode
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      className,
      variant,
      size,
      onDelete,
      disabled = false,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          chipVariants({ variant, size }),
          disabled && "opacity-50 cursor-default pointer-events-none",
          onDelete && "pr-1.5",
          className
        )}
        {...props}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
        {onDelete && (
          <button
            type="button"
            className={cn(
              "ml-1 rounded-full p-0.5 hover:bg-background/20",
              disabled && "pointer-events-none"
            )}
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove</span>
          </button>
        )}
      </div>
    )
  }
)
Chip.displayName = "Chip"

export { Chip, chipVariants }