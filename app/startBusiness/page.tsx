"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Brain, Sparkles, Star, Lightbulb, ArrowRight, PlusCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { toast } from "sonner"
import Cookies from "js-cookie"

interface BusinessPlan {
  id: string
  title: string
  budget: number
  description: string
  status?: string
  progress?: number
  createdAt?: string
  type?: string
  category?: string
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function BusinessPlansPage() {
  const router = useRouter()
  const [showOptions, setShowOptions] = useState(false)
  const [plans, setPlans] = useState<BusinessPlan[]>([])
  const [loading, setLoading] = useState(true)
  
  const creationOptions = [
    {
      id: "ai",
      title: "AI Co-Pilot",
      description: "Let AI enhance your existing business",
      icon: Brain,
      color: "from-emerald-500 to-teal-500",
      path: "/location"
    },
    {
      id: "generate",
      title: "Idea Generator",
      description: "Generate fresh business concepts",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
      path: "/localplan"
    }
  ];

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = Cookies.get("token")
        const response = await fetch("http://localhost:3000/business-plan/plans", {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (!response.ok) throw new Error("Failed to fetch plans")
        const data = await response.json()
        setPlans(data)
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent"
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">Business Plans</h1>
          <p className="text-muted-foreground">
            Manage and track your business plans
          </p>
        </div>
        
        <div>
          <Button
            size="lg"
            onClick={() => setShowOptions(!showOptions)}
            className="relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Start a New Adventure
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </Button>
        </div>
      </motion.div>

      {/* Create Options */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid gap-4 md:grid-cols-2 p-4 rounded-md bg-muted/50">
              {creationOptions.map((option, index) => {
                const Icon = option.icon
                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => router.push(option.path)}
                    className="group relative p-6 rounded-xl cursor-pointer overflow-hidden bg-card"
                  >
                    <div className="relative z-10 space-y-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">{option.title}</h3>
                      <p className="text-muted-foreground">{option.description}</p>
                    </div>
                    
                    <div className={`
                      absolute inset-0 opacity-0 group-hover:opacity-10
                      transition-opacity duration-500 bg-gradient-to-br ${option.color}
                    `} />
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2"
      >
        {plans.map((plan) => (
          <motion.div key={plan.id} variants={item}>
            <div onClick={() => router.push(`/startBusiness/${plan.id}`)}>
              <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {plan.type === 'ai-generated' ? (
                          <Brain className="h-5 w-5 text-primary" />
                        ) : (
                          <Lightbulb className="h-5 w-5 text-amber-500" />
                        )}
                        <span className="text-sm font-medium text-muted-foreground">
                          {plan.type === 'ai-generated' ? 'AI Generated' : 'Custom Plan'}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {plan.title}
                      </h3>
                      <p className="text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{plan.progress || 0}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300 group-hover:brightness-110"
                        style={{ width: `${plan.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {plan.category || `Budget: ${plan.budget?.toLocaleString()}`}
                      </Badge>
                      <Badge variant="outline" className={
                        (plan.status === 'active') 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100'
                      }>
                        {plan.status === 'active' ? 'Active' : 'Draft'}
                      </Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {plans.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Lightbulb className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Plans Yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by generating an AI plan or creating your own
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button onClick={() => router.push('/location')}>
              <Brain className="mr-2 h-4 w-4" />
              AI Co-Pilot
            </Button>
            <Button variant="outline" onClick={() => router.push('/localplan')}>
              <Sparkles className="mr-2 h-4 w-4" />
              Idea Generator
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}