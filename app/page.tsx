

"use client"

import React, 
{ useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAIAssistant } from '@/contexts/AIAssistantContext';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import IntroAnimation from '@/components/intro/IntroAnimation';
import PackageCard from '@/components/pricing/PackageCard';
import FeatureSection from '@/components/features/FeatureSection';
import { ArrowRight, Sparkles, Star, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const Index = () => {
  const { toggleAssistant } = useAIAssistant();
  // Always show intro when landing on the page
  const [showIntro, setShowIntro] = useState(true);
  const [introCompleted, setIntroCompleted] = useState(false);
  
  const skipIntro = () => {
    console.log("Skip intro triggered");
    setShowIntro(false);
    setIntroCompleted(true);
  };

  const completeIntro = () => {
    console.log("Complete intro triggered");
    setShowIntro(false);
    setIntroCompleted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Navigation Menu */}
      <div className={`bg-background border-b border-border p-4 fixed top-0 left-0 right-0 z-50 transition-all ${introCompleted ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <h2 className="font-bold text-xl flex items-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">IndieTracker</span>
            <Sparkles size={16} className="ml-1 text-yellow-500 animate-pulse-soft" />
          </h2>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" className={navigationMenuTriggerStyle()}>
                  Home
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/auth" className={navigationMenuTriggerStyle()}>
                  Login
                </Link>
              </NavigationMenuItem>
              
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      {/* Intro Animation Section - Will show every time the page loads */}
      {showIntro ? (
        <IntroAnimation onComplete={completeIntro} onSkip={skipIntro} />
      ) : (
        <div className={`flex flex-col w-full ${introCompleted ? 'animate-fade-in' : ''}`}>
          {/* Header/Hero section */}
          <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pt-24 pb-16 text-white relative overflow-hidden">
            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute bg-white rounded-full animate-float-slow opacity-20"
                  style={{
                    width: `${Math.random() * 20 + 10}px`,
                    height: `${Math.random() * 20 + 10}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${Math.random() * 8 + 5}s`
                  }}
                ></div>
              ))}
            </div>
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 mb-8 md:mb-0 animate-fade-in" style={{animationDelay: '0.2s'}}>
                  <div className="inline-flex items-center bg-white/20 px-4 py-2 rounded-full text-white text-sm font-medium mb-4">
                    <Star size={16} className="mr-2 text-yellow-300" /> 
                    The ultimate freelance management platform
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                    Manage Your Freelance Business <span className="text-yellow-300 animate-pulse-soft">Effortlessly</span>
                  </h1>
                  <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                    The all-in-one platform for freelancers and small businesses to manage projects,
                    clients, invoices, and growth with AI assistance.
                  </p>
                  <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                    <Link href="/auth">
                      <Button 
                        size="lg" 
                        className="bg-white text-indigo-600 hover:bg-white/90 font-bold group"
                      >
                        Get Started Free <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    
                  </div>
                </div>
                <div className="md:w-1/2 animate-fade-in" style={{animationDelay: '0.6s'}}>
                  <div className="relative">
                    <div className="absolute -top-10 -left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
                    <div className="absolute -bottom-5 -right-5 w-16 h-16 bg-indigo-300 rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
                    <img 
                      src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                      alt="Platform Dashboard Preview" 
                      className="rounded-lg shadow-2xl border-4 border-white/20 transform hover:scale-105 transition-transform duration-500"
                      style={{maxHeight: '400px', objectFit: 'cover'}}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Wave SVG for nice transition */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-12 md:h-20">
                <path fill="#ffffff" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,149.3C672,149,768,171,864,176C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
            </div>
          </header>

          {/* For Who Section */}
          <section className="py-16 bg-white relative z-10">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-4 animate-fade-in">Who is this for?</h2>
              <p className="text-lg text-center text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in">
                Whether you're working online or managing a physical business, FreePilot adapts to your needs
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 animate-fade-in" style={{animationDelay: '0.3s'}}>
                  <div className="bg-indigo-500 text-white w-12 h-12 rounded-full flex items-center justify-center mb-6 animate-bounce-subtle">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-indigo-600">Digital Freelancers</h3>
                  <p className="mb-6 text-gray-700">
                    For designers, developers, writers, marketers, and other digital service providers who want to manage projects, clients, and invoicing in one place.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-indigo-500 mr-2" />
                      Project milestone tracking
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-indigo-500 mr-2" />
                      Team collaboration tools
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-indigo-500 mr-2" />
                      Client management & communication
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-8 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 animate-fade-in" style={{animationDelay: '0.5s'}}>
                  <div className="bg-pink-500 text-white w-12 h-12 rounded-full flex items-center justify-center mb-6 animate-bounce-subtle">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-pink-600">Brick & Mortar Businesses</h3>
                  <p className="mb-6 text-gray-700">
                    For shops, restaurants, service providers and other physical businesses that need to track sales, inventory, and customer relationships.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-pink-500 mr-2" />
                      Daily sales tracking
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-pink-500 mr-2" />
                      Expense management
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-pink-500 mr-2" />
                      AI business insights & recommendations
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Feature Highlights Section */}
          <FeatureSection />

          {/* Pricing Packages Section */}
          <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-4 animate-fade-in">Choose Your Plan</h2>
              <p className="text-lg text-center text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in">
                Select the package that fits your business needs and growth ambitions
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <PackageCard 
                  name="Silver" 
                  price="Free"
                  description="Perfect for solo freelancers just getting started"
                  features={[
                    "Project Management",
                    "Client Management",
                    "Basic Invoicing",
                    "Time Tracking",
                    "Community Access"
                  ]}
                  recommended={false}
                  delay={0.3}
                />
                
                <PackageCard 
                  name="Gold" 
                  price="$19/mo"
                  description="For growing freelancers with multiple clients"
                  features={[
                    "Everything in Silver",
                    "Team Collaboration",
                    "AI Assistant Access",
                    "Advanced Analytics",
                    "Custom Invoicing",
                    "Expense Tracking"
                  ]}
                  recommended={true}
                  delay={0.5}
                />
                
                <PackageCard 
                  name="Diamond" 
                  price="$49/mo"
                  description="Complete solution for established businesses"
                  features={[
                    "Everything in Gold",
                    "Advanced AI Planner",
                    "Business Opportunity Finder",
                    "Personal Success Coach",
                    "Custom Branding",
                    "Priority Support"
                  ]}
                  recommended={false}
                  delay={0.7}
                />
              </div>
            </div>
          </section>

          {/* Call to action */}
          <section className="py-16 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white relative overflow-hidden">
            {/* Animated particles */}
            <div className="absolute inset-0">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute bg-white rounded-full animate-float-slow opacity-20"
                  style={{
                    width: `${Math.random() * 20 + 10}px`,
                    height: `${Math.random() * 20 + 10}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: `${Math.random() * 8 + 5}s`
                  }}
                ></div>
              ))}
            </div>
            
            <div className="container mx-auto px-4 text-center relative z-10">
              <h2 className="text-3xl font-bold mb-6 animate-fade-in">Ready to take control of your business?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.3s'}}>
                Join thousands of freelancers and small businesses using FreePilot to grow and thrive.
              </p>
              <Link href="/signup">
                <Button 
                  size="lg" 
                  className="bg-white text-indigo-600 hover:bg-white/90 font-bold animate-fade-in animate-pulse-subtle"
                  style={{animationDelay: '0.5s'}}
                >
                  Get Started Free
                </Button>
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">FreePilot</h3>
                  <p className="text-gray-400">
                    The all-in-one platform for freelancers and small businesses to manage and grow.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-4">Product</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white">AI Assistant</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4">Resources</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white">Community</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4">Legal</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
                    <li><a href="#" className="text-gray-400 hover:text-white">Security</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 flex justify-between items-center">
                <p className="text-gray-500">© 2025 FreePilot. All rights reserved.</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white">
                    {/* Social Icon */}
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Index;
