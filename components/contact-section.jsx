"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

export function ContactSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const socialPlatforms = [
    { 
      name: "LinkedIn", 
      emoji: "💼",
      url: "#",
      color: "bg-blue-600 hover:bg-blue-700",
      description: "Professional Network"
    },
    { 
      name: "Dribbble", 
      emoji: "🎨",
      url: "#",
      color: "bg-pink-500 hover:bg-pink-600",
      description: "Design Portfolio"
    },
    { 
      name: "Behance", 
      emoji: "🎯",
      url: "#",
      color: "bg-blue-500 hover:bg-blue-600",
      description: "Creative Showcase"
    },
    { 
      name: "Instagram", 
      emoji: "📸",
      url: "#",
      color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
      description: "Behind the Scenes"
    },
    { 
      name: "Twitter", 
      emoji: "🐦",
      url: "#",
      color: "bg-gray-800 hover:bg-gray-900",
      description: "Thoughts & Updates"
    }
  ]

  return (
    <section 
      ref={sectionRef}
      className="relative bg-background text-foreground px-4 sm:px-6 lg:px-8 xl:px-16 py-16 sm:py-20 lg:py-24 min-h-screen overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-teal-400/3 to-transparent rounded-full"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <Badge
              variant="secondary"
              className="inline-flex items-center w-fit bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 px-4 py-2 text-sm font-semibold border border-emerald-200 dark:border-emerald-800 shadow-sm"
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
              LET'S CONNECT
            </Badge>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.85] tracking-tight text-foreground">
              Get in
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                touch
              </span>
              <span className="relative">
                with me
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-muted-foreground/60">©</span>
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
              I'm always excited to connect with fellow developers, discuss new opportunities, 
              or simply chat about technology and innovation. <span className="font-semibold text-foreground">Let's start a conversation!</span>
            </p>
          </motion.div>
        </div>

        {/* Social Media Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
            {socialPlatforms.map((platform, index) => (
              <motion.a
                key={platform.name}
                href={platform.url}
                target={platform.name === "Resume" ? "_blank" : "_self"}
                rel={platform.name === "Resume" ? "noopener noreferrer" : ""}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.8 + (index * 0.1) }}
                className={`group ${platform.color} rounded-2xl p-6 text-white hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl block`}
              >
                <div className="text-center space-y-3">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {platform.emoji}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{platform.name}</h4>
                    <p className="text-sm text-white/80">{platform.description}</p>
                  </div>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto group-hover:bg-white/30 transition-colors duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="bg-gradient-to-br from-foreground to-foreground/90 rounded-3xl p-8 lg:p-12 text-background text-center mb-16"
        >
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Connect?</h3>
          <p className="text-lg text-background/80 mb-8 max-w-2xl mx-auto">
            Whether you're looking to collaborate on a project, discuss opportunities, 
            or just want to say hello, I'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-background text-foreground hover:bg-background/90 rounded-full px-8 py-3 font-semibold transition-all duration-300 hover:scale-105"
              onClick={() => window.location.href = 'mailto:hello@jatingupta.dev'}
            >
              Send me an email
            </Button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-border/50 space-y-4 sm:space-y-0"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-foreground to-foreground/80 rounded-2xl flex items-center justify-center text-background font-bold text-lg shadow-lg">
              J
            </div>
            <div>
              <span className="text-foreground font-semibold text-lg">Jatin Gupta</span>
              <p className="text-muted-foreground text-sm">Full Stack Developer</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-muted-foreground text-sm">©2024 All rights reserved</span>
            <Button
              variant="outline"
              className="rounded-full px-6 py-2 border-2 hover:bg-foreground hover:text-background transition-all duration-300 hover:scale-105"
              onClick={() => window.open('#', '_blank')}
            >
              Download CV
            </Button>
          </div>
        </motion.footer>
      </div>
    </section>
  )
}
