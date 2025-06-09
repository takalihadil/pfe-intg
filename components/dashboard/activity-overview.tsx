"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { formatDuration } from "@/lib/utils/time"
import { Clock, DollarSign, TrendingDown, FileText } from "lucide-react"
import Cookies from "js-cookie"

interface StatsData {
  workHours: number
  sales: number
  expenses: number
  notes: Array<{
    id: string
    text: string
    time: string
    type: 'work'
  }>
}

export function ActivityOverview() {
  const [activeSegment, setActiveSegment] = useState<'hours' | 'sales' | 'expenses' | 'notes'>('hours')
  const [data, setData] = useState<StatsData>({
    workHours: 0,
    sales: 0,
    expenses: 0,
    notes: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token")
      try {
        const [expensesRes, salesRes, timeStatsRes, notesRes] = await Promise.all([
          fetch('http://localhost:3000/expenses/total', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:3000/sales/stats', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:3000/time-entry/stats', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:3000/time-entry/Notes', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ])

        if (!expensesRes.ok || !salesRes.ok || !timeStatsRes.ok || !notesRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const expensesData = await expensesRes.json()
        const salesData = await salesRes.json()
        const timeStatsData = await timeStatsRes.json()
        const notesData = await notesRes.json()

        setData({
          workHours: timeStatsData.allTime || 0,
          sales: salesData.allTime || 0,
          expenses: expensesData.totalAmount || 0,
          notes: notesData.map((note: any) => ({
            id: note.id,
            text: note.notes,
            time: new Date(note.date).toLocaleDateString(),
            type: 'work'
          }))
        })
      } catch (err) {
        setError('Failed to load data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const segments = [
    {
      id: 'hours' as const,
      label: 'Work Hours',
      value: formatDuration(data.workHours * 3600000), // Convert hours to milliseconds
      icon: Clock,
      color: 'bg-blue-500',
      angle: 0
    },
    {
      id: 'sales' as const,
      label: 'Sales',
      value: formatCurrency(data.sales),
      icon: DollarSign,
      color: 'bg-green-500',
      angle: 90
    },
    {
      id: 'expenses' as const,
      label: 'Expenses',
      value: formatCurrency(data.expenses),
      icon: TrendingDown,
      color: 'bg-red-500',
      angle: 180
    },
    {
      id: 'notes' as const,
      label: 'Notes',
      value: `${data.notes.length} entries`,
      icon: FileText,
      color: 'bg-purple-500',
      angle: 270
    }
  ] as const

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center h-[500px] flex items-center justify-center">
          Loading...
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6 text-center h-[500px] flex items-center justify-center text-red-500">
          {error}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="relative">
          <div className="relative w-[300px] h-[300px] mx-auto">
            {/* Background circle */}
            <div className="absolute inset-0 rounded-full border-4 border-border/30" />
            {segments.map((segment) => {
              const Icon = segment.icon
              const isActive = activeSegment === segment.id
              
              return (
                <div
                  key={segment.id}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${segment.angle}deg) translate(120px) rotate(-${segment.angle}deg)`,
                    marginLeft: '-32px',
                    marginTop: '-32px',
                  }}
                >
                  <motion.button
                    className={`
                      p-4 rounded-full transition-colors w-16 h-16 z-10
                      ${isActive ? `${segment.color} text-white shadow-lg` : 'bg-background hover:bg-muted border border-border'}
                    `}
                    onClick={() => setActiveSegment(segment.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-6 w-6 mx-auto" />
                  </motion.button>
                </div>
              )
            })}

            {/* Center Label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                key={activeSegment}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-medium"
              >
                {segments.find(s => s.id === activeSegment)?.label}
              </motion.div>
            </div>
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSegment}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              {activeSegment === 'notes' ? (
                <div className="space-y-3 max-h-[200px] overflow-y-auto px-4">
                  {data.notes.map((note) => (
                    <div 
                      key={note.id}
                      className="p-3 rounded-lg bg-background/50 border border-border/50"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                          {note.type}
                        </span>
                        <span className="text-muted-foreground">{note.time}</span>
                      </div>
                      <p className="mt-1">{note.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px]">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-bold"
                  >
                    {segments.find(s => s.id === activeSegment)?.value}
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}