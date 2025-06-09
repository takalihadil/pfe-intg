"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface Step {
  title: string
  description?: string
  optional?: boolean
}

export interface StepperProps {
  steps: Step[]
  activeStep: number
  orientation?: "horizontal" | "vertical"
  onStepClick?: (step: number) => void
  className?: string
}

export function Stepper({
  steps,
  activeStep,
  orientation = "horizontal",
  onStepClick,
  className,
}: StepperProps) {
  const isVertical = orientation === "vertical"

  return (
    <div
      className={cn(
        "w-full",
        isVertical ? "flex flex-col gap-2" : "flex items-center justify-center gap-4",
        className
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = index < activeStep
        const isCurrent = index === activeStep
        const isClickable = onStepClick && index <= activeStep

        return (
          <React.Fragment key={index}>
            <div
              className={cn(
                "flex",
                isVertical ? "items-start gap-4" : "flex-col items-center gap-2",
                isClickable && "cursor-pointer"
              )}
              onClick={() => isClickable && onStepClick(index)}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                    isCompleted
                      ? "border-primary bg-primary text-primary-foreground"
                      : isCurrent
                      ? "border-primary text-primary"
                      : "border-muted-foreground/25 text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {!isVertical && index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-[2px] w-12 bg-muted-foreground/25",
                      isCompleted && "bg-primary"
                    )}
                  />
                )}
              </div>
              <div
                className={cn(
                  "space-y-0.5",
                  isVertical ? "flex-1" : "text-center"
                )}
              >
                <div className="text-sm font-medium">{step.title}</div>
                {step.description && (
                  <div className="text-xs text-muted-foreground">
                    {step.description}
                  </div>
                )}
                {step.optional && (
                  <div className="text-xs italic text-muted-foreground">
                    Optional
                  </div>
                )}
              </div>
            </div>
            {isVertical && index < steps.length - 1 && (
              <div
                className={cn(
                  "ml-4 h-8 w-[2px] bg-muted-foreground/25",
                  isCompleted && "bg-primary"
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}