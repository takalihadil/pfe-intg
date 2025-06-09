import React, { useState, useEffect, useRef } from 'react';
import { SkipForward } from 'lucide-react';

interface IntroAnimationProps {
  onComplete: () => void;
  onSkip: () => void;
}

const IntroAnimation = ({ onComplete, onSkip }: IntroAnimationProps) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const animationRef = useRef<HTMLDivElement>(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Auto-advance animation phases with fixed durations
  useEffect(() => {
    const phases = [
      { duration: 2000 }, // Logo reveal
      { duration: 4000 }, // 3D elements animation
      { duration: 3000 }, // Project management
      { duration: 3000 }, // Invoice tracking
      { duration: 4000 }  // Final message
    ];
    
    if (currentPhase >= phases.length) {
      console.log("Animation sequence complete");
      setTimeout(() => onComplete(), 500);
      return;
    }
    
    console.log(`Playing animation phase ${currentPhase + 1} of ${phases.length}`);
    const timer = setTimeout(() => {
      setCurrentPhase(prev => prev + 1);
    }, phases[currentPhase].duration);
    
    return () => clearTimeout(timer);
  }, [currentPhase, onComplete]);

  // Handle skip button click
  const handleSkip = () => {
    console.log("Skip button pressed");
    onSkip();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      {/* Abstract background animation */}
      <div className="absolute inset-0">
        {/* Dynamic gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 opacity-80 animate-gradient"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full"
              style={{
                background: `radial-gradient(circle at center, ${['rgba(139,92,246,0.8)', 'rgba(236,72,153,0.8)', 'rgba(59,130,246,0.8)'][i % 3]} 0%, transparent 70%)`,
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.3,
                transform: `scale(${Math.random() * 0.5 + 0.5})`,
                animation: `float-particle ${Math.random() * 15 + 10}s ease-in-out infinite ${Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            backgroundPosition: 'center center',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'center bottom',
            animation: 'grid-move 15s linear infinite'
          }}
        ></div>
      </div>
      
      {/* Main animation container */}
      <div ref={animationRef} className="relative z-10 w-full max-w-3xl mx-auto px-4">
        
        {/* Phase 1: Logo reveal */}
        <div className={`transition-all duration-1000 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center
          ${currentPhase === 0 ? 'opacity-100 scale-100' : currentPhase === 1 ? 'opacity-70 scale-75 -translate-y-40' : 'opacity-0 scale-50'}`}>
          <div className="text-8xl font-extrabold relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              IndieTracker
            </span>
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-2xl animate-pulse-slow"></div>
          </div>
          <p className="mt-4 text-white text-xl animate-fade-in" style={{animationDelay: '0.5s'}}>
            Unlock the freedom to manage your business, your way
          </p>
        </div>
        
        {/* Phase 2: 3D rotating elements - Enhanced cube effect */}
        <div className={`transition-all duration-700 absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full
          ${currentPhase === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="h-80 flex items-center justify-center">
            {/* Explicitly add the perspective-container class */}
            <div className="perspective-container" style={{ perspective: '1000px' }}>
              {/* Explicitly add the rotating-cube class with inline animation */}
              <div className="rotating-cube" style={{ 
                position: 'relative',
                width: '200px',
                height: '200px',
                transformStyle: 'preserve-3d',
                animation: 'rotate-cube 12s infinite linear'
              }}>
                {/* Front face */}
                <div className="cube-face front" style={{
                  position: 'absolute',
                  width: '200px',
                  height: '200px',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3))',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(5px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'translateZ(100px)'
                }}>
                  <div className="cube-content">
                    <div className="text-4xl font-bold text-white">Your Business</div>
                  </div>
                </div>
                
                {/* Back face */}
                <div className="cube-face back" style={{
                  position: 'absolute',
                  width: '200px',
                  height: '200px',
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(139, 92, 246, 0.3))',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(5px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotateY(180deg) translateZ(100px)'
                }}>
                  <div className="cube-content">
                    <div className="text-4xl font-bold text-white">Your Way</div>
                  </div>
                </div>
                
                {/* Right face */}
                <div className="cube-face right" style={{
                  position: 'absolute',
                  width: '200px',
                  height: '200px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3))',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(5px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotateY(90deg) translateZ(100px)'
                }}>
                  <div className="cube-content">
                    <div className="text-4xl font-bold text-white">With Freedom</div>
                  </div>
                </div>
                
                {/* Left face */}
                <div className="cube-face left" style={{
                  position: 'absolute',
                  width: '200px',
                  height: '200px',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3))',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(5px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotateY(-90deg) translateZ(100px)'
                }}>
                  <div className="cube-content">
                    <div className="text-4xl font-bold text-white">Made Simple</div>
                  </div>
                </div>
                
                {/* Top face */}
                <div className="cube-face top" style={{
                  position: 'absolute',
                  width: '200px',
                  height: '200px',
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(59, 130, 246, 0.3))',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(5px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotateX(90deg) translateZ(100px)'
                }}>
                  <div className="cube-content">
                    <div className="text-4xl font-bold text-white">AI Powered</div>
                  </div>
                </div>
                
                {/* Bottom face */}
                <div className="cube-face bottom" style={{
                  position: 'absolute',
                  width: '200px',
                  height: '200px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(236, 72, 153, 0.3))',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(5px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotateX(-90deg) translateZ(100px)'
                }}>
                  <div className="cube-content">
                    <div className="text-4xl font-bold text-white">All-In-One</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced subtitle for context */}
          <div className="text-center mt-16">
            <p className="text-white text-xl animate-fade-in-up">Powerful features combined in one seamless platform</p>
          </div>
        </div>
        
        {/* Phase 3: Project Management Animation */}
        <div className={`transition-all duration-700 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full
          ${currentPhase === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2 animate-fade-in-up">Project Management</h2>
            <p className="text-white/80 animate-fade-in-up" style={{animationDelay: '0.2s'}}>Track and manage all your projects effortlessly</p>
          </div>
          
          <div className="project-cards-container relative h-64">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="project-card absolute glassmorphism-card w-64 p-4 rounded-lg shadow-lg"
                style={{
                  top: `${i * 10}px`,
                  left: '50%',
                  transform: `translateX(-50%) translateY(${i * 5}px) rotate(${(i-2) * 5}deg)`,
                  zIndex: 5 - i,
                  transition: 'all 0.5s ease',
                  animation: `float-cards 3s ease-in-out infinite ${i * 0.2}s`,
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="h-4 w-3/4 bg-white/30 rounded mb-3"></div>
                <div className="h-3 w-1/2 bg-white/20 rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-8 w-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full"></div>
                  <div className="h-3 w-1/3 bg-white/20 rounded"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Enhanced visuals */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4">
            <div className="flex space-x-2">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
              <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
            </div>
          </div>
        </div>
        
        {/* Phase 4: Invoice Animation */}
        <div className={`transition-all duration-700 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full
          ${currentPhase === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2 animate-fade-in-up">Smart Invoicing</h2>
            <p className="text-white/80 animate-fade-in-up" style={{animationDelay: '0.2s'}}>Create and track invoices with ease</p>
          </div>
          
          <div className="invoice-animation relative h-64 flex justify-center">
            <div className="invoice glassmorphism-card w-72 p-5 rounded-lg shadow-glow" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 0 15px 2px rgba(139, 92, 246, 0.3)'
            }}>
              <div className="flex justify-between items-center mb-4">
                <div className="h-10 w-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded"></div>
                <div>
                  <div className="h-4 w-16 bg-white/30 rounded mb-1"></div>
                  <div className="h-3 w-24 bg-white/20 rounded"></div>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="h-3 w-32 bg-white/20 rounded"></div>
                    <div className="h-3 w-16 bg-white/30 rounded"></div>
                  </div>
                ))}
              </div>
              
              <div className="h-px w-full bg-white/20 mb-3"></div>
              
              <div className="flex justify-between items-center">
                <div className="h-4 w-20 bg-white/30 rounded"></div>
                <div className="h-6 w-24 bg-gradient-to-br from-green-400 to-teal-400 rounded"></div>
              </div>
              
              <div className="absolute -right-4 -top-4 h-12 w-12 bg-green-500 rounded-full flex items-center justify-center transform rotate-12 shadow-lg">
                <div className="h-6 w-6 border-2 border-white rounded-full border-l-transparent animate-spin"></div>
              </div>
            </div>
            
            <div className="payment-status absolute right-10 bottom-0 transform translate-y-1/2">
              <div className="glassmorphism-card rounded-full px-4 py-2 text-white flex items-center shadow-glow" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 0 15px 2px rgba(139, 92, 246, 0.3)'
              }}>
                <div className="h-3 w-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <div className="h-3 w-20 bg-white/30 rounded"></div>
              </div>
            </div>
            
            {/* Money floating animation */}
            <div className="absolute -left-10 top-10" style={{animation: 'float-circle 6s ease-in-out infinite 0.3s'}}>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold shadow-glow">
                $
              </div>
            </div>
            <div className="absolute -right-5 top-20" style={{animation: 'float-circle 6s ease-in-out infinite 0.7s'}}>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-glow">
                $
              </div>
            </div>
          </div>
        </div>
        
        {/* Phase 5: Final Call to Action */}
        <div className={`transition-all duration-700 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full
          ${currentPhase === 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="text-center">
            <h2 className="text-5xl font-extrabold mb-4 animate-fade-in-up">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Your Business Awaits
              </span>
            </h2>
            <p className="text-white text-xl mb-6 animate-fade-in-up" style={{animationDelay: '0.3s'}}>All the tools you need in one place</p>
            <div className="flex justify-center space-x-4">
              <div className="relative">
                <div className="h-12 w-40 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse-soft flex items-center justify-center text-white font-bold">
                  Get Started
                </div>
                
                {/* Enhanced glow effect */}
                <div className="absolute -inset-2 bg-indigo-500 opacity-20 blur-lg rounded-full animate-pulse-slower"></div>
              </div>
            </div>
            
            {/* Additional decorative elements */}
            <div className="mt-10 flex justify-center space-x-8">
              <div className="h-3 w-3 bg-pink-400 rounded-full animate-pulse-slow"></div>
              <div className="h-3 w-3 bg-purple-400 rounded-full animate-pulse-slow" style={{animationDelay: '0.3s'}}></div>
              <div className="h-3 w-3 bg-indigo-400 rounded-full animate-pulse-slow" style={{animationDelay: '0.6s'}}></div>
            </div>
          </div>
        </div>
        
        {/* Skip button */}
        <button 
          onClick={handleSkip}
          className="absolute top-4 right-4 z-[60] text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all cursor-pointer"
        >
          <div className="flex items-center">
            <span className="mr-2 text-sm">Skip</span>
            <SkipForward size={18} />
          </div>
        </button>
        
        {/* Phase indicator - MOVED TO BOTTOM OF SCREEN */}
       
      </div>
      
      {/* Add critical keyframe animations inline */}
      <style jsx>{`
        @keyframes rotate-cube {
          0% {
            transform: rotateX(0deg) rotateY(0deg);
          }
          100% {
            transform: rotateX(360deg) rotateY(360deg);
          }
        }
        
        @keyframes float-cards {
          0%, 100% {
            transform: translateX(-50%) translateY(var(--y-offset, 0)) rotate(var(--rotate, 0deg));
          }
          50% {
            transform: translateX(-50%) translateY(calc(var(--y-offset, 0) - 10px)) rotate(var(--rotate, 0deg));
          }
        }
        
        @keyframes float-circle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        
        @keyframes float-particle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
          }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes grid-move {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 50px;
          }
        }
        
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-pulse-soft {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default IntroAnimation;