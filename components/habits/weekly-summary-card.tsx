"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, RefreshCw, Quote, Lightbulb, TrendingUp, Star, Bell, XCircle, CheckCircle, ChevronDown, Check } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import ReactMarkdown from "react-markdown"
import confetti from "canvas-confetti"

interface HabitAdvice {
  name: string
  completions: number
  target: number
  advice: string
  isExpanded: boolean
  
}

interface WeeklySummaryCardProps {
  summary: string
  habits: HabitAdvice[]
  isLoading: boolean
  dateRange: string
  onRegenerate: () => void
}

export function WeeklySummaryCard({ summary, habits: initialHabits, isLoading, dateRange, onRegenerate }: WeeklySummaryCardProps) {
  const [parsedSummary, setParsedSummary] = useState<{
    overview: string
    tips: string[]
    quote: string
  }>({
    overview: "",
    tips: [],
    quote: "",
  })
  const [habitsWithAdvice, setHabitsWithAdvice] = useState<HabitAdvice[]>(initialHabits || [])
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [selectedTip, setSelectedTip] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/notification-sound.mp3")
      audioRef.current.src = "https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3"
      audioRef.current.volume = 0.5

      const soundPref = localStorage.getItem("summarySound")
      setSoundEnabled(soundPref === "enabled")
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Show notification when summary is loaded
  useEffect(() => {
    if (summary && !isLoading) {
      setTimeout(() => {
        setShowNotification(true)
        if (soundEnabled && audioRef.current) {
          audioRef.current.play().catch((e) => console.log("Audio play failed:", e))
        }
      }, 500)
    } else {
      setShowNotification(false)
    }
  }, [summary, isLoading, soundEnabled])

  // Parse the summary into sections
  useEffect(() => {
    if (!summary) return

    const lines = summary.split("\n").filter((line) => line.trim() !== "")

    // Extract overview
    const overview = lines.slice(0, 2).join("\n")

    // Extract tips
    const tipRegex = /^(\d+[.)]-?|\*|-|•)\s+(.+)/
    const tips = lines.filter((line) => tipRegex.test(line)).map((line) => line.replace(tipRegex, "$2").trim())

    // Extract quote
    const quoteIndex = lines.findIndex(
      (line) =>
        line.includes('"') ||
        line.includes('"') ||
        line.toLowerCase().includes("citation") ||
        line.toLowerCase().includes("quote"),
    )

    const quote = quoteIndex !== -1 ? lines.slice(quoteIndex).join("\n") : ""

    // Parse habits with advice
    const habitSections = summary.split('### ').slice(1)
    const parsedHabits = habitSections.map(section => {
      const lines = section.split('\n').filter(l => l.trim())
      const existingHabit = initialHabits?.find(h => lines[0].trim().includes(h.name)) || {
        name: lines[0].trim(),
        completions: 0,
        target: 0
      }
      return {
        ...existingHabit,
        advice: lines.slice(1).join('\n'),
        isExpanded: false
      }
    })

    setHabitsWithAdvice(parsedHabits.length ? parsedHabits : initialHabits || [])
    setParsedSummary({
      overview,
      tips: tips.length ? tips : ["Continuez à suivre vos habitudes", "Essayez d'être plus régulier"],
      quote: quote || "La discipline est le pont entre les objectifs et leur accomplissement.",
    })
  }, [summary, initialHabits])

  const toggleHabitExpansion = (index: number) => {
    setHabitsWithAdvice(prev => prev.map((habit, i) => 
      i === index ? { ...habit, isExpanded: !habit.isExpanded } : habit
    ))
  }

  const toggleSound = () => {
    const newState = !soundEnabled
    setSoundEnabled(newState)
    localStorage.setItem("summarySound", newState ? "enabled" : "disabled")
  }

  const triggerConfetti = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 3

      confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: ["#6E48AA", "#9D50BB", "#4776E6"],
        disableForReducedMotion: true,
      })
    }
  }

  const tryTip = (tip: string) => {
    setSelectedTip(tip)
    triggerConfetti()
  }

  const closeTip = () => {
    setSelectedTip(null)
  }

  const remindLater = () => {
    alert("Vous recevrez un rappel plus tard!")
  }

  // Animation variants (keep your existing ones)
  const loadingVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  const notificationVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.9,
      transition: {
        duration: 0.2,
      },
    },
  }

  const BrainParticles = () => (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-[#6E48AA] to-[#4776E6]"
          initial={{
            x: "50%",
            y: "50%",
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: `${50 + (Math.random() * 100 - 50)}%`,
            y: `${50 + (Math.random() * 100 - 50)}%`,
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  )

  const ProgressBar = ({ value, label }: { value: number; label: string }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6E48AA] to-[#4776E6]"
          initial={{ width: "0%" }}
          animate={{ width: `${value}%` }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
            delay: 0.2,
          }}
        >
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)",
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: ["0% 0%", "200% 0%"],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </motion.div>
      </div>
    </div>
  )

  return (
    <div ref={cardRef} className="relative">
      {/* Notification */}
      <AnimatePresence>
        {showNotification && !isLoading && (
          <motion.div
            variants={notificationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute -top-20 left-0 right-0 z-50 mx-auto w-full max-w-md"
          >
            <div className="bg-gradient-to-r from-[#6E48AA] to-[#4776E6] p-4 rounded-lg shadow-lg text-white flex items-start gap-3">
              <div className="relative flex-shrink-0">
                <Brain className="h-8 w-8" />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white/50"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">Résumé IA prêt !</h4>
                <p className="text-sm text-white/90">Votre analyse hebdomadaire personnalisée est disponible.</p>
              </div>
              <button onClick={() => setShowNotification(false)} className="text-white/80 hover:text-white">
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Tip Modal */}
      <AnimatePresence>
        {selectedTip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={closeTip}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-[#6E48AA] dark:text-[#9D50BB]">Conseil Sélectionné</h3>
                <button onClick={closeTip} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              <div className="prose prose-sm dark:prose-invert">
                <ReactMarkdown>{selectedTip}</ReactMarkdown>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" onClick={closeTip}>
                  Fermer
                </Button>
                <Button onClick={remindLater}>
                  <Bell className="h-4 w-4 mr-2" />
                  Rappeler plus tard
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="overflow-hidden border-0 shadow-lg relative bg-white dark:bg-gray-900">
        {/* Gradient background with animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6E48AA]/10 via-[#9D50BB]/10 to-[#4776E6]/10 dark:from-[#6E48AA]/20 dark:via-[#9D50BB]/20 dark:to-[#4776E6]/20">
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-[#6E48AA]/10 via-transparent to-[#4776E6]/10 dark:from-[#6E48AA]/20 dark:to-[#4776E6]/20"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        </div>

        <CardHeader className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm pb-4 border-b border-[#6E48AA]/20 dark:border-[#6E48AA]/30">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-[#6E48AA] dark:text-[#9D50BB]">
              <div className="relative">
                <Brain className="h-5 w-5" />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[#9D50BB] dark:border-[#9D50BB]"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>
              <span>Résumé IA Hebdomadaire</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="ml-2"
              >
                <Star className="h-4 w-4 text-amber-500" />
              </motion.div>
            </CardTitle>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSound}
                className={`p-1 rounded-full transition-colors ${
                  soundEnabled
                    ? "bg-[#6E48AA]/20 text-[#6E48AA] dark:bg-[#6E48AA]/30 dark:text-[#9D50BB]"
                    : "bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                }`}
                title={soundEnabled ? "Désactiver le son" : "Activer le son"}
              >
                <Bell className="h-4 w-4" />
              </button>
              <span className="text-sm text-muted-foreground">{dateRange}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 relative z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="relative flex justify-center items-center py-8">
                  <motion.div
                    className="absolute w-16 h-16 rounded-full border-t-2 border-l-2 border-[#6E48AA]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute w-12 h-12 rounded-full border-t-2 border-r-2 border-[#9D50BB]"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute w-8 h-8 rounded-full border-b-2 border-r-2 border-[#4776E6]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                  <Brain className="h-8 w-8 text-[#6E48AA] dark:text-[#9D50BB] relative z-10" />
                  <BrainParticles />
                </div>

                <motion.div
                  className="text-center text-[#6E48AA] dark:text-[#9D50BB] font-medium"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  L'IA analyse vos habitudes...
                </motion.div>

                <div className="space-y-3">
                  <Skeleton className="h-4 w-full bg-[#6E48AA]/10 dark:bg-[#6E48AA]/20" />
                  <Skeleton className="h-4 w-11/12 bg-[#6E48AA]/10 dark:bg-[#6E48AA]/20" />
                  <Skeleton className="h-4 w-10/12 bg-[#6E48AA]/10 dark:bg-[#6E48AA]/20" />
                  <Skeleton className="h-4 w-full bg-[#6E48AA]/10 dark:bg-[#6E48AA]/20" />
                </div>
              </motion.div>
            ) : (
              <motion.div key="content" initial="hidden" animate="visible" className="space-y-6">
                {/* Overview Section */}
                <motion.div custom={0} variants={contentVariants} className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-[#6E48AA] dark:text-[#9D50BB]">
                    <TrendingUp className="h-5 w-5" />
                    <span>Vue d'ensemble</span>
                    <motion.div
                      className="ml-1 h-1.5 w-1.5 rounded-full bg-[#9D50BB]"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                  </h3>
                  <motion.div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <ReactMarkdown>
                      {parsedSummary.overview ||
                        "Votre semaine a été productive avec plusieurs habitudes complétées régulièrement. 🌟"}
                    </ReactMarkdown>
                  </motion.div>
                </motion.div>

                {/* Progress Bars */}
                <motion.div
                  custom={1}
                  variants={contentVariants}
                  className="space-y-3 bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-[#6E48AA]/20 dark:border-[#6E48AA]/30"
                >
                  <h3 className="text-sm font-semibold text-[#6E48AA] dark:text-[#9D50BB]">Progression hebdomadaire</h3>
                  <div className="space-y-3">
                    <ProgressBar value={75} label="Taux de complétion" />
                    <ProgressBar value={68} label="Constance" />
                    <ProgressBar value={82} label="Amélioration" />
                  </div>
                </motion.div>

                {/* Habits Section */}
                {habitsWithAdvice.length > 0 && (
                  <motion.div custom={1.5} variants={contentVariants} className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="h-5 w-5" />
                      <span>Vos Habitudes</span>
                      <motion.div
                        className="ml-1 h-1.5 w-1.5 rounded-full bg-emerald-500"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
                      />
                    </h3>
                    
                    <div className="space-y-2">
                      {habitsWithAdvice.map((habit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + index * 0.05 }}
                          className="border rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => toggleHabitExpansion(index)}
                            className="w-full p-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`h-3 w-3 rounded-full ${
                                habit.completions >= habit.target ? 'bg-green-500' : 'bg-amber-500'
                              }`} />
                              <span className="font-medium">{habit.name}</span>
                              <span className="text-sm text-muted-foreground">
                              
                              </span>
                            </div>
                            <ChevronDown className={`h-4 w-4 transition-transform ${
                              habit.isExpanded ? 'rotate-180' : ''
                            }`} />
                          </button>
                          
                          <AnimatePresence>
                            {habit.isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="px-4 pb-3"
                              >
                                <div className="prose prose-sm dark:prose-invert p-3 bg-gray-50 dark:bg-gray-800 rounded">
                                  <ReactMarkdown>{habit.advice}</ReactMarkdown>
                                </div>
                                <div className="mt-2 flex gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-xs"
                                    onClick={() => tryTip(habit.advice)}
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Essayer ce conseil
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-xs"
                                    onClick={remindLater}
                                  >
                                    <Bell className="h-3 w-3 mr-1" />
                                    Rappeler
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Tips Section */}
                <motion.div custom={2} variants={contentVariants} className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <Lightbulb className="h-5 w-5" />
                    <span>Conseils personnalisés</span>
                    <motion.div
                      className="ml-1 h-1.5 w-1.5 rounded-full bg-amber-500"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                    />
                  </h3>
                  <ul className="space-y-4">
                    {parsedSummary.tips.map((tip, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                        className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg border border-[#6E48AA]/20 dark:border-[#6E48AA]/30"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-start gap-2 group">
                              <motion.div
                                className="text-amber-500 dark:text-amber-400 font-bold mt-1 transform"
                                whileHover={{ scale: 1.2, rotate: 10 }}
                              >
                                <Star className="h-4 w-4" />
                              </motion.div>
                              <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown>{tip}</ReactMarkdown>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2 sm:mt-0">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => tryTip(tip)}
                              className="text-xs px-3 py-1 rounded-full bg-[#6E48AA] text-white hover:bg-[#9D50BB] transition-colors"
                            >
                              Essayer ce conseil
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={remindLater}
                              className="text-xs px-3 py-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                              Rappeler plus tard
                            </motion.button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Quote Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="mt-6"
                >
                  <div className="relative bg-gradient-to-r from-[#6E48AA]/10 to-[#4776E6]/10 dark:from-[#6E48AA]/20 dark:to-[#4776E6]/20 p-4 rounded-lg border border-[#6E48AA]/20 dark:border-[#6E48AA]/30 overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#6E48AA]/5 to-transparent"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        ease: "linear",
                      }}
                    />
                    <div className="relative flex items-start gap-3">
                      <Quote className="h-6 w-6 text-[#9D50BB] flex-shrink-0 mt-1" />
                      <motion.div
                        className="prose prose-sm dark:prose-invert max-w-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                      >
                        <ReactMarkdown>{parsedSummary.quote}</ReactMarkdown>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        <CardFooter className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-4 border-t border-[#6E48AA]/20 dark:border-[#6E48AA]/30 flex justify-between items-center">
          <div className="flex items-center">
            <motion.div
              className="text-xs text-[#6E48AA] dark:text-[#9D50BB] flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Brain className="h-3 w-3" />
              <span>Propulsé par l'IA</span>
            </motion.div>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Button
              onClick={onRegenerate}
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="border-[#6E48AA]/30 bg-white hover:bg-[#6E48AA]/10 text-[#6E48AA] hover:text-[#9D50BB] dark:border-[#6E48AA]/50 dark:bg-gray-900 dark:text-[#9D50BB] dark:hover:bg-[#6E48AA]/20 transition-all duration-300 shadow-sm hover:shadow"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              <span>Nouvelle analyse IA</span>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </div>
  )
}