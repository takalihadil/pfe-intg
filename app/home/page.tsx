"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle2, LineChart, Clock, Target, Wallet, Users, Shield, Mail, Github, Twitter } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <LineChart className="h-5 w-5" />
            IndieTracker
          </div>
          <Button variant="default" size="sm">
            Login
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Track Your Indie Business Success
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            All-in-one platform for indie entrepreneurs to track finances, time, habits, and connect with like-minded creators.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="gap-2">
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Time Tracking</h3>
              <p className="text-muted-foreground text-sm">Track your productivity and project progress</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Financial Management</h3>
              <p className="text-muted-foreground text-sm">Monitor income, expenses, and business growth</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Goal Tracking</h3>
              <p className="text-muted-foreground text-sm">Set and achieve your business milestones</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What are you waiting for?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of indie entrepreneurs who are scaling their businesses with IndieTracker
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          {/* Silver Plan */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">Silver</span>
                <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">Popular</span>
              </CardTitle>
              <div className="text-3xl font-bold">$9<span className="text-muted-foreground text-sm font-normal">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {["Time tracking", "Basic financial tools", "Goal setting", "Email support"].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>

          {/* Gold Plan */}
          <Card className="relative overflow-hidden border-primary">
            <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-sm">
              Best Value
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Gold</CardTitle>
              <div className="text-3xl font-bold">$19<span className="text-muted-foreground text-sm font-normal">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {[
                  "Everything in Silver",
                  "Advanced analytics",
                  "Team collaboration",
                  "Priority support",
                  "Custom reports"
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="default">Get Started</Button>
            </CardFooter>
          </Card>

          {/* Ultimate Plan */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl">Ultimate</CardTitle>
              <div className="text-3xl font-bold">$39<span className="text-muted-foreground text-sm font-normal">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {[
                  "Everything in Gold",
                  "White-label reports",
                  "API access",
                  "24/7 phone support",
                  "Custom integrations",
                  "Dedicated account manager"
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Built for Indie Entrepreneurs</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Secure & Private</h3>
                    <p className="text-muted-foreground">Your data is encrypted and stored securely. We never share your information.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Community-Driven</h3>
                    <p className="text-muted-foreground">Connect with other indie entrepreneurs and share experiences.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop" 
                alt="Dashboard Preview" 
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted">
        <div className="container mx-auto py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-semibold">
                <LineChart className="h-5 w-5" />
                IndieTracker
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering indie entrepreneurs to achieve their business goals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Features</li>
                <li>Pricing</li>
                <li>Testimonials</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon">
                  <Mail className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Github className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 IndieTracker. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}