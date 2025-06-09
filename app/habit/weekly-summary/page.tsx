"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { WeeklySummaryCard } from "@/components/habits/weekly-summary-card"
//import { HabitsHeader } from "@/components/habits/habits-header"
import { Button } from "@/components/ui/button"
import { Sparkles, RefreshCw, Calendar, Brain, ArrowRight } from "lucide-react"
import { fetchWeeklySummary, regenerateWeeklySummary } from "@/lib/api"
import { motion } from "framer-motion"

export default function WeeklySummaryPage() {
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState("")
  const { toast } = useToast()

  // Get the current week's date range
  useEffect(() => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay()) // Sunday as start of week
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6) // Saturday as end of week

    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }
    const start = startOfWeek.toLocaleDateString("fr-FR", options)
    const end = endOfWeek.toLocaleDateString("fr-FR", options)
    setDateRange(`${start} - ${end}`)
  }, [])

  // Fetch the weekly summary on page load
  useEffect(() => {
    loadSummary()
  }, [])

  const loadSummary = async () => {
    try {
      setIsLoading(true)
      const data = await fetchWeeklySummary()
      setSummary(data)
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to fetch weekly summary:", error)
      toast({
        title: "Échec du chargement",
        description: "Impossible de charger votre résumé hebdomadaire. Veuillez réessayer.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleRegenerate = async () => {
    try {
      setIsLoading(true)
      const data = await regenerateWeeklySummary()
      setSummary(data)
      setIsLoading(false)

      toast({
        title: "✨ Résumé régénéré !",
        description: "Votre nouveau résumé hebdomadaire est prêt.",
        variant: "success",
      })
    } catch (error) {
      console.error("Failed to regenerate weekly summary:", error)
      toast({
        title: "Échec de la régénération",
        description: "Impossible de créer un nouveau résumé. Veuillez réessayer.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <>
     
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <motion.h1
                className="text-3xl font-bold text-[#6E48AA] dark:text-[#9D50BB] flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative">
                  <Brain className="h-7 w-7" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#9D50BB] dark:border-[#9D50BB]"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                </div>
                Résumé Hebdomadaire IA
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="ml-2"
                >
                  <Sparkles className="h-5 w-5 text-amber-500" />
                </motion.div>
              </motion.h1>
              <motion.p
                className="text-muted-foreground mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Votre bilan personnalisé et vos conseils pour progresser
              </motion.p>
            </div>

            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="flex items-center text-muted-foreground bg-[#6E48AA]/10 dark:bg-[#6E48AA]/20 px-3 py-1.5 rounded-full">
                <Calendar className="h-4 w-4 mr-2 text-[#9D50BB]" />
                <span>{dateRange}</span>
              </div>

              <Button
                onClick={handleRegenerate}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="flex items-center gap-2 border-[#6E48AA]/30 hover:bg-[#6E48AA]/10 text-[#6E48AA] dark:border-[#6E48AA]/50 dark:hover:bg-[#6E48AA]/20 dark:text-[#9D50BB]"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Régénérer
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="grid grid-cols-1 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <WeeklySummaryCard
              summary={summary}
              isLoading={isLoading}
              dateRange={dateRange}
              onRegenerate={handleRegenerate} habits={[]}            />
          </motion.div>

          <motion.div
            className="mt-8 bg-[#6E48AA]/5 dark:bg-[#6E48AA]/10 rounded-lg p-6 border border-[#6E48AA]/10 dark:border-[#6E48AA]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-[#6E48AA] dark:text-[#9D50BB] mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Comment fonctionne l'IA dans votre résumé hebdomadaire
            </h2>

            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Notre intelligence artificielle analyse vos données d'habitudes pour créer un résumé personnalisé qui
                vous aide à progresser :
              </p>

              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-[#9D50BB] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#6E48AA] dark:text-[#9D50BB]">Analyse de tendances</strong> : L'IA
                    identifie les modèles dans vos habitudes et détecte les jours où vous êtes le plus productif.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-[#9D50BB] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#6E48AA] dark:text-[#9D50BB]">Conseils personnalisés</strong> : Basés sur
                    vos performances spécifiques, l'IA génère des recommandations adaptées à votre situation.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-[#9D50BB] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#6E48AA] dark:text-[#9D50BB]">Motivation contextuelle</strong> : L'IA
                    sélectionne des citations motivantes en fonction de vos défis actuels.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-5 w-5 text-[#9D50BB] flex-shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-[#6E48AA] dark:text-[#9D50BB]">Régénération intelligente</strong> : Chaque
                    fois que vous cliquez sur "Régénérer", l'IA analyse vos données sous un nouvel angle.
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}
