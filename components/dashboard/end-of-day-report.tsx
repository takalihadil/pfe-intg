"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Crown, Loader2 } from "lucide-react"
import confetti from "canvas-confetti"
import Cookies from "js-cookie"

interface DailyFinancials {
  totalRevenue: number
  totalExpenses: number
  profit: number
  mostCommonExpenseType: string | null
  bestSellingProduct: string | null
  profitabilityInsight: string
  totalDuration: number
  revenuePerHour: number
  profitPerHour: number
}

interface EndOfDayStats {
  hoursWorked: string
  totalSales: number
  totalExpenses: number
  netProfit: number
  bestSeller: {
    name: string
    quantity: number
  }
  performance: {
    percentage: number
    trend: "up" | "down"
  }
}

interface UserData {
  sub: string
  fullname: string
  // Add other user properties as needed
}

export function EndOfDayReport() {
  const [isOpen, setIsOpen] = useState(false)
  const [isWriting, setIsWriting] = useState(false)
  const [stats, setStats] = useState<EndOfDayStats | null>(null)
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token")
        if (!token) throw new Error("No authentication token found")

        // Fetch user sub
        const meResponse = await fetch("http://localhost:3000/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!meResponse.ok) throw new Error("Failed to fetch user sub")
        const { sub } = await meResponse.json()

        // Fetch user details
        const userResponse = await fetch(`http://localhost:3000/auth/${sub}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!userResponse.ok) throw new Error("Failed to fetch user details")
        const userData = await userResponse.json()

        setUser({
          sub,
          fullname: userData.fullname
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load user data")
      }
    }

    fetchUserData()
  }, [])

  const getTrendFromInsight = (insight: string): "up" | "down" => {
    if (insight.toLowerCase().includes("increase")) return "up"
    if (insight.toLowerCase().includes("decrease")) return "down"
    return "up"
  }

  const formatDuration = (hours: number): string => {
    const totalMinutes = Math.round(hours * 60)
    const hoursWorked = Math.floor(totalMinutes / 60)
    const minutesWorked = totalMinutes % 60
    return `${hoursWorked}h ${minutesWorked}m`
  }

  const fetchDailyStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = Cookies.get("token")
      if (!token) throw new Error("Authentication required")

      const today = new Date().toISOString().split("T")[0]
      const response = await fetch(
        `http://localhost:3000/sales/profit-summary?period=day&date=${today}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      if (!response.ok) throw new Error("Failed to fetch daily stats")
      
      const data: DailyFinancials = await response.json()

      const transformedStats: EndOfDayStats = {
        hoursWorked: formatDuration(data.totalDuration),
        totalSales: data.totalRevenue,
        totalExpenses: data.totalExpenses,
        netProfit: data.profit,
        bestSeller: {
          name: data.bestSellingProduct || "No products sold",
          quantity: 0
        },
        performance: {
          percentage: Math.abs(data.profitPerHour),
          trend: getTrendFromInsight(data.profitabilityInsight)
        }
      }

      setStats(transformedStats)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load daily stats")
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = async () => {
    if (!user) {
      setError("User data not loaded")
      return
    }

    await fetchDailyStats()
    setIsOpen(true)
    setTimeout(() => {
      setIsWriting(true)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }, 1000)
  }

  const scrollVariants = {
    closed: {
      height: 0,
      opacity: 0,
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.4, 0, 0.2, 1],
      }
    }
  }

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
      }
    }
  }

  const textContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 1
      }
    }
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error} - <Button variant="ghost" onClick={fetchDailyStats}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="relative">
      {!isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={handleOpen}
            className="bg-gradient-to-r from-amber-500 to-purple-600 text-white hover:from-amber-600 hover:to-purple-700"
            disabled={loading || !user}
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Crown className="mr-2 h-5 w-5" />
            )}
            End My Workday
          </Button>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            className="relative max-w-2xl mx-auto"
            initial="closed"
            animate="open"
            exit="closed"
          >
            <motion.div
              variants={scrollVariants}
              className="relative bg-[url('https://images.unsplash.com/photo-1524364892822-dda3df70e991?w=800&q=80')] bg-cover bg-center rounded-lg overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-amber-800/20 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-amber-800/20 to-transparent" />
              
              <div className="p-8 min-h-[600px] bg-amber-50/95 dark:bg-amber-950/95">
                <motion.div
                  variants={textContainer}
                  initial="hidden"
                  animate={isWriting ? "visible" : "hidden"}
                  className="space-y-8 font-serif"
                >
                  <motion.div variants={textVariants} className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-100">
                      📜 Royal Decree 📜
                    </h2>
                    <p className="text-lg text-amber-800 dark:text-amber-200">
                      On this fine day of {new Date().toLocaleDateString()}
                    </p>
                  </motion.div>

                  <motion.div variants={textVariants} className="text-center italic text-amber-800 dark:text-amber-200">
                    To our esteemed proprietor, {user?.fullname || "Valued Merchant"}
                  </motion.div>

                  {stats && (
                    <motion.div variants={textVariants} className="space-y-4 text-amber-900 dark:text-amber-100">
                      <p className="leading-relaxed">
                        Let it be known that on this day, you have served the realm for{" "}
                        <span className="font-bold">{stats.hoursWorked}</span>, during which time:
                      </p>
                      
                      <ul className="space-y-2 pl-6 list-disc">
                        <li>
                          Your establishment amassed <span className="font-bold">{formatCurrency(stats.totalSales)}</span>
                        </li>
                        <li>
                          The kingdom's expenses totaled <span className="font-bold">{formatCurrency(stats.totalExpenses)}</span>
                        </li>
                        <li>
                          Leaving a noble profit of <span className="font-bold">{formatCurrency(stats.netProfit)}</span>
                        </li>
                        <li>
                          Your finest offering was <span className="font-bold">{stats.bestSeller.name}</span>
                        </li>
                      </ul>
                    </motion.div>
                  )}

                  <motion.div variants={textVariants} className="space-y-4">
                    <h3 className="text-xl font-bold text-center text-amber-900 dark:text-amber-100">
                      🏰 Royal Assessment 🏰
                    </h3>
                    {stats && (
                      <p className="text-amber-800 dark:text-amber-200 italic text-center">
                        "Hark! Your establishment's performance shows a{" "}
                        <span className="font-bold">
                          {stats.performance.percentage}% {stats.performance.trend === "up" ? "rise" : "fall"}
                        </span>{" "}
                        compared to yesterdays endeavors.
                      </p>
                    )}
                  </motion.div>

                  <motion.div variants={textVariants} className="flex justify-center pt-4">
                    <div className="w-24 h-24 rounded-full bg-red-800 flex items-center justify-center text-white text-3xl border-4 border-amber-900 shadow-lg">
                      👑
                    </div>
                  </motion.div>

                  <motion.div variants={textVariants} className="flex justify-center gap-4 pt-4">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                      Roll Up Scroll
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}