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
    <section className="relative min-h-screen overflow-hidden bg-background text-foreground transition-colors duration-500 pt-20 sm:pt-24">

      {/* Subtle background gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, hsl(var(--foreground) / 0.03) 0%, transparent 50%)`
        }}
      />
      
      <div className="relative z-10 min-h-[calc(100vh-5rem)] sm:min-h-[calc(100vh-6rem)] flex items-center">
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
