"use client"

import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { WobbleCard } from "./ui/wobble-card"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useTheme } from "./theme-provider"

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setIsLoaded(true)
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-500">

      {/* Subtle background gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, hsl(var(--foreground) / 0.03) 0%, transparent 50%)`
        }}
      />
      
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Left Content - 7 columns */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Badge className="inline-flex items-center gap-2 border-0 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Available for projects
                </Badge>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-4"
              >
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight leading-[0.9] text-foreground transition-colors duration-500">
                  Full Stack
                  <br />
                  <span className="font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">Developer</span>
                </h1>
                
                <div className="w-16 h-1 bg-foreground transition-colors duration-500" />
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-6"
              >
                <p className="text-xl lg:text-2xl font-light leading-relaxed max-w-2xl text-muted-foreground transition-colors duration-500">
                  Computer Science student passionate about building scalable web applications and solving complex problems through clean, efficient code.
                </p>
                
                <div className="text-sm font-medium tracking-wide text-muted-foreground transition-colors duration-500">
                  BTECH CS STUDENT • CHANDIGARH, INDIA
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button 
                  size="lg"
                  className="rounded-full px-8 py-6 text-base font-medium transition-all duration-300 hover:scale-105 border-0 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Hire me
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 rounded-full px-8 py-6 text-base font-medium transition-all duration-300 border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  View projects
                </Button>
              </motion.div>
            </div>

            {/* Right Content - 5 columns */}
            <div className="lg:col-span-5 space-y-4 mt-16 lg:mt-8">
              
              {/* Profile Card with Wobble Effect */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <WobbleCard
                  containerClassName={`min-h-[175px] ${theme === 'light' ? 'bg-purple-900' : 'bg-purple-800'}`}
                  className="p-6"
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-2xl font-bold text-white">Jatin Gupta</h3>
                        <div className="w-3 h-3 bg-green-400 rounded-full" />
                      </div>
                      
                      <p className="text-sm mb-6 flex items-center gap-2 text-gray-200">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                        </svg>
                        Chandigarh, India
                      </p>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <span className="font-bold text-sm text-white">CS</span>
                          </div>
                          <div>
                            <div className="text-xs font-bold tracking-wider text-gray-300">COMPUTER SCIENCE</div>
                            <div className="text-lg font-bold text-white">BTECH Student</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </WobbleCard>
              </motion.div>

              {/* Skills Stats with Wobble Cards */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="grid grid-cols-2 gap-4"
              >
                <WobbleCard
                  containerClassName={`min-h-[120px] ${theme === 'light' ? 'bg-green-800' : 'bg-green-700'}`}
                  className="p-6"
                >
                  <div className="text-3xl font-bold mb-1 text-white">20+</div>
                  <div className={`text-sm ${theme === 'light' ? 'text-slate-300' : 'text-green-100'}`}>Projects built</div>
                </WobbleCard>
                
                <WobbleCard
                  containerClassName={`min-h-[120px] ${theme === 'light' ? 'bg-indigo-800' : 'bg-indigo-700'}`}
                  className="p-6"
                >
                  <div className="text-3xl font-bold mb-1 text-white">3+</div>
                  <div className={`text-sm ${theme === 'light' ? 'text-gray-300' : 'text-indigo-100'}`}>Years coding</div>
                </WobbleCard>
              </motion.div>

              {/* Tech Stack with Wobble Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <WobbleCard
                  containerClassName={`min-h-[200px] ${theme === 'light' ? 'bg-pink-900' : 'bg-pink-800'}`}
                  className="p-6"
                >
                  <p className={`text-sm mb-4 font-medium ${theme === 'light' ? 'text-zinc-300' : 'text-pink-100'}`}>
                    Technical expertise
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <span className="font-bold text-xs text-blue-200">C++</span>
                      </div>
                      <span className="text-sm font-medium text-white">Data Structures & Algorithms</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <span className="font-bold text-xs text-orange-200">JS</span>
                      </div>
                      <span className="text-sm font-medium text-white">Full Stack Development</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <span className="font-bold text-xs text-green-200">PY</span>
                      </div>
                      <span className="text-sm font-medium text-white">Machine Learning & Automation</span>
                    </div>
                  </div>
                </WobbleCard>
              </motion.div>

              {/* Social Links with subtle styling */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="flex gap-3"
              >
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground transition-colors duration-500">
          <span className="text-xs font-medium tracking-wider">SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-[1px] h-8 bg-muted-foreground transition-colors duration-500"
          />
        </div>
      </motion.div>
    </section>
  )
}
