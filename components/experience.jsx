"use client"

import { useEffect, useRef, useState } from "react"

export function ExperienceSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
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

  // Fetch published experiences
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch('/api/experiences?published=true')
        const data = await response.json()
        
        if (data.success && data.experiences.length > 0) {
          setExperiences(data.experiences)
        } else {
          // If no experiences from API, don't show section at all
          setExperiences([])
        }
      } catch (error) {
        console.error('Error fetching experiences:', error)
        // If API fails, don't show section
        setExperiences([])
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [])

  // Don't render the section if no experiences are available
  if (!loading && experiences.length === 0) {
    return null
  }

  return (
    <section 
      ref={sectionRef}
      className="bg-gradient-to-br from-background via-background to-muted/20 text-foreground flex items-center px-6 sm:px-8 lg:px-12 xl:px-20 py-20 relative overflow-hidden min-h-[80vh] sm:min-h-screen"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left side - Title and CTA */}
          <div className="lg:col-span-2 space-y-8 text-center lg:text-left">
            <div
              className={`transform transition-all duration-1200 ease-out ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[0.9] tracking-tight mb-6">
                Wanna see
                <br />
                <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  my experience?
                </span>
              </h2>
              <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-md mx-auto lg:mx-0">
                Over 2 years crafting digital experiences for world-class companies
              </p>
            </div>
            
            <div
              className={`transform transition-all duration-1000 ease-out delay-300 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <button className="group relative bg-foreground text-background px-8 py-4 rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <span className="relative z-10">Book a call</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </div>
          </div>

          {/* Right side - Experience grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse p-6 lg:p-8 rounded-2xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                {experiences.map((exp, index) => (
                  <div
                    key={exp._id || index}
                    className={`group relative transform transition-all duration-1000 ease-out ${
                      isVisible 
                        ? "translate-y-0 opacity-100" 
                        : "translate-y-12 opacity-0"
                    }`}
                    style={{ transitionDelay: `${500 + index * 150}ms` }}
                  >
                    <div className="relative p-6 lg:p-8 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                      {/* Gradient background on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${exp.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>
                      
                      {/* Glass reflection effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                      
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white bg-gradient-to-br ${exp.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            {exp.logo}
                          </div>
                          <div>
                            <span className="text-foreground font-semibold text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-500 group-hover:bg-clip-text transition-all duration-300">
                              {exp.company}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-foreground leading-tight group-hover:scale-105 transition-transform duration-300 origin-left">
                            {exp.role}
                          </h3>
                          <p className="text-muted-foreground font-medium">
                            {exp.period}
                          </p>
                          
                          {/* Show description if available */}
                          {exp.description && (
                            <p className="text-muted-foreground text-sm leading-relaxed mt-3 line-clamp-3">
                              {exp.description}
                            </p>
                          )}
                          
                          {/* Show technologies if available */}
                          {exp.technologies && exp.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {exp.technologies.slice(0, 3).map((tech, techIndex) => (
                                <span
                                  key={techIndex}
                                  className="text-xs px-2 py-1 rounded-full bg-white/20 dark:bg-black/20 text-muted-foreground"
                                >
                                  {tech}
                                </span>
                              ))}
                              {exp.technologies.length > 3 && (
                                <span className="text-xs px-2 py-1 rounded-full bg-white/20 dark:bg-black/20 text-muted-foreground">
                                  +{exp.technologies.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Decorative element */}
                        <div className={`w-full h-1 bg-gradient-to-r ${exp.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </section>
  )
}
