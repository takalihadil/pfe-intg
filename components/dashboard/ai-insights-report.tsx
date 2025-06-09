"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Brain, TrendingUp, Users, Target, Sparkles, Star, ArrowRight, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Cookies from "js-cookie"

interface AIInsight {
  title: string
  message: string
  action: string
  impact?: string
  confidence: number
  category: "revenue" | "customers" | "growth" | "optimization"
}

const mockInsights: AIInsight[] = [
  {
    title: "Revenue Opportunity Detected",
    message: "Your afternoon sales (2-4 PM) are consistently 30% lower than morning peaks. Consider introducing a happy hour promotion during this period.",
    action: "Launch an afternoon special offering 15% off between 2-4 PM",
    impact: "Potential revenue increase of $500/week",
    confidence: 89,
    category: "revenue"
  },
  {
    title: "Customer Behavior Pattern",
    message: "Customers who try your caramel latte are 3x more likely to become repeat visitors. This product could be key to customer retention.",
    action: "Feature caramel latte in your marketing and consider a first-time buyer discount",
    impact: "Could increase customer retention by 25%",
    confidence: 92,
    category: "customers"
  },
  {
    title: "Growth Opportunity",
    message: "Based on your location data, there's an untapped market of office workers within a 5-minute walk. They typically order coffee between 8-9 AM.",
    action: "Launch a pre-order system for morning coffee runs",
    impact: "Estimated 40 new daily customers",
    confidence: 85,
    category: "growth"
  }
]

const categoryIcons = {
  revenue: TrendingUp,
  customers: Users,
  growth: Target,
  optimization: Brain
}

const categoryStyles = {
  revenue: {
    gradient: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/20",
    text: "text-green-500",
    glow: "shadow-green-500/20"
  },
  customers: {
    gradient: "from-blue-500/20 to-indigo-500/20",
    border: "border-blue-500/20",
    text: "text-blue-500",
    glow: "shadow-blue-500/20"
  },
  growth: {
    gradient: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/20",
    text: "text-purple-500",
    glow: "shadow-purple-500/20"
  },
  optimization: {
    gradient: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/20",
    text: "text-amber-500",
    glow: "shadow-amber-500/20"
  }
}

interface ProjectData {
  projectName: string
  role: string
  location: string
  startHour: number
  endHour: number
}

export function AIInsightsReport() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [activeInsight, setActiveInsight] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [isAfterHours, setIsAfterHours] = useState(false)
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true)

 useEffect(() => {
  const fetchAIInsights = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast({ title: "Authorization required", description: "Please login again" });
        return;
      }

      const meResponse = await fetch("http://localhost:3000/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!meResponse.ok) throw new Error("Failed to fetch user data");
      const { sub } = await meResponse.json();

      const subResponse = await fetch(`http://localhost:3000/auth/${sub}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!subResponse.ok) throw new Error("Failed to fetch project data");
      const projectData: ProjectData = await subResponse.json();

      const now = new Date();
      const currentHour = now.getHours();
      const isOvernight = projectData.startHour >= projectData.endHour;
      const isAfterHours = isOvernight
        ? currentHour < projectData.startHour && currentHour >= projectData.endHour
        : currentHour < projectData.startHour || currentHour >= projectData.endHour;

      if (isAfterHours) {
        setIsAfterHours(true);
        setLoading(false);
        return;
      }

      const aiResponse = await fetch(
        `http://localhost:3000/project-offline-ai?` +
          new URLSearchParams({
            project: projectData.projectName,
            location: projectData.location,
            type: projectData.role,
            startHour: projectData.startHour.toString(),
            endHour: projectData.endHour.toString()
          }),
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("AI Response Status:", aiResponse.status);
      const aiText = await aiResponse.text();
      console.log("AI Raw Response:", aiText);

      if (!aiResponse.ok) throw new Error("Failed to get AI insights");

      const aiItems = aiText
        .split("\n")
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^\d+\.\s*/, "").trim());

      const formattedInsights: AIInsight[] = aiItems.map((text, index) => {
        const [action, message] = text.includes(": ")
          ? [text.split(": ")[0], text.split(": ").slice(1).join(": ")]
          : [text, text];

        return {
          title: `AI Recommendation ${index + 1}`,
          message,
          action,
          confidence: 85 + Math.floor(Math.random() * 10),
          category: ["revenue", "customers", "growth", "optimization"][index % 4]
        };
      });

      setInsights(formattedInsights);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error loading insights",
        description: "Failed to fetch AI recommendations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  fetchAIInsights();
}, [toast]);
  useEffect(() => {
    if (insights.length > 0 && isAutoplayEnabled) {
      const interval = setInterval(() => {
        if (!isExpanded) {
          setIsVisible(false)
          setTimeout(() => {
            setActiveInsight(prev => (prev + 1) % insights.length)
            setIsVisible(true)
          }, 500)
        }
      }, 8000)

      return () => clearInterval(interval)
    }
  }, [isExpanded, insights.length, isAutoplayEnabled])

  const goToNextInsight = () => {
    setIsVisible(false)
    setTimeout(() => {
      setActiveInsight(prev => (prev + 1) % insights.length)
      setIsVisible(true)
    }, 300)
  }

  const goToPrevInsight = () => {
    setIsVisible(false)
    setTimeout(() => {
      setActiveInsight(prev => (prev - 1 + insights.length) % insights.length)
      setIsVisible(true)
    }, 300)
  }

  if (loading) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="h-12 w-12 text-primary opacity-50" />
          </motion.div>
          <p className="text-muted-foreground">Generating AI insights...</p>
        </div>
      </Card>
    )
  }

  if (isAfterHours) {
    return (
      <Card className="h-[400px] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Sparkles className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <h3 className="text-xl font-semibold">Great work today!</h3>
          <p className="text-muted-foreground">
            You've completed your work hours. We'll see each other tomorrow inshaallah.<br />
            Check your daily stats in "End My Work Day". Wishing you the best!
          </p>
        </div>
      </Card>
    )
  }

  if (!insights.length) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">No insights available</p>
      </Card>
    )
  }

  const insight = insights[activeInsight]
  const style = categoryStyles[insight.category]
  const Icon = categoryIcons[insight.category]

  return (
    <Card className={`
      relative transition-all duration-500 overflow-hidden
      ${isExpanded ? 'h-[600px]' : 'h-[400px]'}
      bg-[#FAFAFA] dark:bg-[#1A1A1A] border-[#E5E5E5] dark:border-[#333333]
    `}>
      {/* Modern subtle pattern background */}
      <div className="absolute inset-0 opacity-5">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="dotPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotPattern)" />
        </svg>
      </div>
      
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

      <div className="relative h-full p-8 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              className={`p-2 rounded-lg bg-${insight.category}-500/10 ${style.text}`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon className="h-5 w-5" />
            </motion.div>
            <div>
              <h2 className="text-lg font-semibold">AI Assistant</h2>
              <p className="text-sm text-muted-foreground">Personalized insights</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsAutoplayEnabled(!isAutoplayEnabled)}
              className="h-8 w-8"
            >
              {isAutoplayEnabled ? (
                <span className="w-2 h-4 bg-muted-foreground" />
              ) : (
                <ArrowRight className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {isVisible && (
              <motion.div
                key={activeInsight}
                className="h-full flex flex-col"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-3">
                  <h3 className={`text-xl font-bold ${style.text}`}>
                    {insight.title}
                  </h3>
                  <div className="flex items-center mt-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-xs text-muted-foreground">{insight.confidence}% confidence</span>
                  </div>
                </div>

                <div className={`flex-1 p-4 rounded-lg bg-${insight.category}-500/5 border border-${insight.category}-500/10 mb-4 overflow-y-auto`}>
                  <p className="text-sm leading-relaxed">{insight.message}</p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 border border-border">
                  <div className="flex items-start gap-2">
                    <div className={`mt-0.5 p-1 rounded bg-${insight.category}-500/10 ${style.text}`}>
                      <Check className="h-3 w-3" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Recommended Action</h4>
                      <p className="text-xs text-muted-foreground">{insight.action}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-border">
          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevInsight}
              className="h-8 w-8 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex gap-1 items-center">
              {insights.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeInsight 
                      ? style.text + ' bg-current' 
                      : 'bg-muted-foreground/30'
                  }`}
                  onClick={() => {
                    setActiveInsight(index);
                    setIsVisible(true);
                  }}
                  aria-label={`View insight ${index + 1}`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextInsight}
              className="h-8 w-8 rounded-full"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </Button>
        </div>
      </div>
    </Card>
  )
}
