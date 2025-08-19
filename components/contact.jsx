"use client"

import React from "react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { AnimatedTooltip } from "./ui/animated-tooltip"
import { LinkPreview } from "./ui/link-preview"
import { WobbleCard } from "./ui/wobble-card"
import { useTheme } from "./theme-provider"

export function ContactSection() {
  const { theme } = useTheme()

  const socialPlatforms = [
    { 
      id: 1,
      name: "Github", 
      designation: "Projects Showcase",
      image: theme === "dark" ? "/icons/github-light.png" : "/icons/github-dark.png",
      url: "https://github.com/26JATIN"
    },
    { 
      id: 2,
      name: "Instagram", 
      designation: "Behind the Scenes",
      image: "/icons/instagram.png",
      url: "https://x.com/JatinGupta93145"
    },
      { 
      id: 3,
      name: "LeetCode", 
      designation: "DSA Showcase",
      image: "/icons/leetcode.png",
      url: "https://leetcode.com/u/JATINGUPTA26/"
    },


    { 
      id: 4,
      name: "Discord", 
      designation: "Design Portfolio",
      image: "/icons/discord.png",
      url: "https://discord.com/users/775586851960389682"
    },
    { 
      id: 5,
      name: "LinkedIn", 
      designation: "Professional Network",
      image: "/icons/linkedin.png",
      url: "https://www.linkedin.com/in/26jatin"
    }

  ]

  return (
    <section 
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
          <div className="space-y-6">
            <Badge
              variant="secondary"
              className="inline-flex items-center w-fit bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 px-4 py-2 text-sm font-semibold border border-emerald-200 dark:border-emerald-800 shadow-sm"
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
              LET'S CONNECT
            </Badge>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.85] tracking-tight text-foreground">
              Get in{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                touch 
              </span>
              <span className="relative">
                {" "}with me
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-muted-foreground/60">©</span>
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
              I'm always excited to connect with fellow developers, discuss new opportunities, 
              or simply chat about technology and innovation. <span className="font-semibold text-foreground">Let's start a conversation!</span>
            </p>
          </div>
        </div>


        {/* Call to Action Section */}
        <WobbleCard
          containerClassName="mb-16"
          className="text-center text-white"
        >
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Connect?</h3>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Whether you're looking to collaborate on a project, discuss opportunities, 
            or just want to say hello, I'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-white text-indigo-800 hover:bg-white/90 rounded-full px-8 py-3 font-semibold transition-all duration-300 hover:scale-105"
              onClick={() => window.location.href = 'mailto:hello@jatingupta.dev'}
            >
              Send me an email
            </Button>
          </div>
        </WobbleCard>

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-border/50 space-y-4 sm:space-y-0">
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
        </footer>
        
        {/* Social Media Section - Bottom Center */}
        <div className="flex justify-center mt-8 pt-6 border-t border-border/30">
          <div className="flex items-center">
            <AnimatedTooltip items={socialPlatforms} />
          </div>
        </div>
      </div>
    </section>
  )
}
