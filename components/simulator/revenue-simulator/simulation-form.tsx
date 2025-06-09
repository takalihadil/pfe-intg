"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  rateChange: z.number().min(-50).max(100),
  expenseChange: z.number().min(-50).max(100),
  clientChange: z.number().min(-50).max(100),
  timeChange: z.number().min(-50).max(100),
  confidence: z.number().min(0).max(100),
  timeframe: z.enum(["1month", "3months", "6months", "12months"]),
  assumptions: z.string().optional(),
})

interface SimulationFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void
}

export function SimulationForm({ onSubmit }: SimulationFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rateChange: 0,
      expenseChange: 0,
      clientChange: 0,
      timeChange: 0,
      confidence: 80,
      timeframe: "3months",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="rateChange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate Change (%)</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Slider
                    min={-50}
                    max={100}
                    step={5}
                    value={[field.value]}
                    onValueChange={([value]) => field.onChange(value)}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>-50%</span>
                    <span>{field.value}%</span>
                    <span>+100%</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expenseChange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expense Change (%)</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Slider
                    min={-50}
                    max={100}
                    step={5}
                    value={[field.value]}
                    onValueChange={([value]) => field.onChange(value)}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>-50%</span>
                    <span>{field.value}%</span>
                    <span>+100%</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientChange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Base Change (%)</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Slider
                    min={-50}
                    max={100}
                    step={5}
                    value={[field.value]}
                    onValueChange={([value]) => field.onChange(value)}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>-50%</span>
                    <span>{field.value}%</span>
                    <span>+100%</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeChange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Investment Change (%)</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Slider
                    min={-50}
                    max={100}
                    step={5}
                    value={[field.value]}
                    onValueChange={([value]) => field.onChange(value)}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>-50%</span>
                    <span>{field.value}%</span>
                    <span>+100%</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="timeframe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timeframe</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1month">1 Month</SelectItem>
                    <SelectItem value="3months">3 Months</SelectItem>
                    <SelectItem value="6months">6 Months</SelectItem>
                    <SelectItem value="12months">12 Months</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confidence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confidence Level (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="assumptions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key Assumptions (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="List any important assumptions for this simulation"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Run Simulation</Button>
      </form>
    </Form>
  )
}