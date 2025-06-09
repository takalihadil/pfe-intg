"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { FormationRecommendation } from "@/lib/types/marketplace"
import { Brain } from "lucide-react"

interface Question {
  id: string
  text: string
  options: {
    id: string
    text: string
    value: string
  }[]
}

const questions: Question[] = [
  {
    id: "goal",
    text: "What's your primary business goal right now?",
    options: [
      { id: "revenue", text: "Increase Revenue", value: "revenue" },
      { id: "efficiency", text: "Improve Efficiency", value: "efficiency" },
      { id: "growth", text: "Scale Business", value: "growth" },
      { id: "skills", text: "Learn New Skills", value: "skills" }
    ]
  },
  {
    id: "experience",
    text: "How long have you been running your business?",
    options: [
      { id: "new", text: "Just Starting", value: "new" },
      { id: "1year", text: "1-2 Years", value: "1year" },
      { id: "3years", text: "3-5 Years", value: "3years" },
      { id: "5years", text: "5+ Years", value: "5years" }
    ]
  },
  {
    id: "challenge",
    text: "What's your biggest challenge?",
    options: [
      { id: "marketing", text: "Marketing & Sales", value: "marketing" },
      { id: "finance", text: "Financial Management", value: "finance" },
      { id: "time", text: "Time Management", value: "time" },
      { id: "tech", text: "Technical Skills", value: "tech" }
    ]
  }
]

interface FormationQuizProps {
  onComplete: (recommendations: FormationRecommendation[]) => void
}

export function FormationQuiz({ onComplete }: FormationQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // TODO: Implement AI recommendation logic
      onComplete([])
    }
  }

  const currentAnswer = answers[questions[currentQuestion].id]
  const isLastQuestion = currentQuestion === questions.length - 1

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle>Find Your Perfect Learning Path</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </div>
          
          <h3 className="text-lg font-medium">
            {questions[currentQuestion].text}
          </h3>

          <RadioGroup
            value={currentAnswer}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {questions[currentQuestion].options.map(option => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.id} />
                <Label htmlFor={option.id}>{option.text}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Button
          className="w-full"
          disabled={!currentAnswer}
          onClick={handleNext}
        >
          {isLastQuestion ? "Get Recommendations" : "Next Question"}
        </Button>
      </CardContent>
    </Card>
  )
}