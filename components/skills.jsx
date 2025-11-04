"use client"

import { useEffect, useRef, useState } from "react"
import { WobbleCard } from "./ui/wobble-card"
import { Badge } from "./ui/badge"
import { ExternalLink, Award } from "lucide-react"

export function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [missionVisible, setMissionVisible] = useState(false)
  const [servicesVisible, setServicesVisible] = useState(false)
  const [certificatesVisible, setCertificatesVisible] = useState(false)
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [flippedCards, setFlippedCards] = useState({})
  const sectionRef = useRef(null)
  const missionRef = useRef(null)
  const servicesRef = useRef(null)
  const certificatesRef = useRef(null)

  const toggleFlip = (skillId) => {
    setFlippedCards(prev => ({
      ...prev,
      [skillId]: !prev[skillId]
    }))
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === sectionRef.current && entry.isIntersecting) {
            setIsVisible(true)
          }
          if (entry.target === missionRef.current && entry.isIntersecting) {
            setMissionVisible(true)
          }
          if (entry.target === servicesRef.current && entry.isIntersecting) {
            setServicesVisible(true)
          }
          if (entry.target === certificatesRef.current && entry.isIntersecting) {
            setCertificatesVisible(true)
          }
        })
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    if (missionRef.current) observer.observe(missionRef.current)
    if (servicesRef.current) observer.observe(servicesRef.current)
    if (certificatesRef.current) observer.observe(certificatesRef.current)

    return () => observer.disconnect()
  }, [])

  // Fetch skills
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/skills?published=true')
        const data = await response.json()
        if (data.success) {
          setSkills(data.skills)
        }
      } catch (error) {
        console.error('Error fetching skills:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  const brands = []

  return (
    <section
      ref={sectionRef}
      className={`py-6 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 min-h-[80vh] sm:min-h-screen transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div ref={missionRef}>
        <WobbleCard
          containerClassName={`bg-teal-700 h-40 sm:h-70 md:h-70 mb-8 sm:mb-16 transition-all duration-1000 ease-out ${
            missionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
          className="flex flex-col justify-center p-4 sm:p-6 md:p-8 lg:p-10"
        >
        <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-4 sm:mb-6 md:mb-8 leading-[1.4] sm:leading-[1.3] md:leading-[1.2]">
          My mission is to assist startups and enterprises in creating an emotional bond between their products and
          satisfied, engaged customers.
        </h2>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-12">
          {brands.map((brand, index) => (
            <div
              key={index}
              className={`text-white/80 font-medium text-xs sm:text-sm md:text-base lg:text-lg transition-all duration-700 ease-out ${
                missionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {brand.logo}
            </div>
          ))}
        </div>
        </WobbleCard>
      </div>      
      <div ref={servicesRef} className="flex flex-col lg:flex-row min-h-[60vh] gap-6 lg:gap-0">
        {/* Left sidebar with title */}
        <div className="w-full lg:w-1/4 flex-shrink-0 mb-4 sm:mb-6 lg:mb-0 lg:pr-6 xl:pr-8">
          <h3
            className={`text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-foreground dark:text-white lg:sticky lg:top-8 hover:text-cyan-500 dark:hover:text-cyan-500 transition-all duration-300 cursor-default hover:scale-105 transform leading-[1.2] ${
              servicesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            How Can I<br />
            Assist You?
          </h3>
        </div>

        {/* Right content area with services grid */}
        <div className="w-full lg:w-3/4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8">
            {skills.map((skill, index) => (
              <div
                key={skill._id}
                className={`relative transition-all duration-700 ease-out ${
                  servicesVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
                }`}
                style={{ 
                  transitionDelay: `${index * 150}ms`,
                  perspective: '1000px'
                }}
              >
                {/* Flip Container */}
                <div className="relative w-full group max-w-[500px] mx-auto sm:max-w-none" style={{ paddingBottom: '75%' }}> {/* More responsive aspect ratio */}
                  <div className={`absolute inset-0 [transform-style:preserve-3d] transition-all duration-700 ${flippedCards[skill._id] ? '[transform:rotateY(180deg)]' : ''}`}>
                    {/* Front Side */}
                    <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl sm:rounded-2xl backdrop-blur-md bg-white/5 dark:bg-white/5 shadow-lg p-[4%] sm:p-[5%] md:p-[6%] flex transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1">
                      {/* Icon on Left */}
                      {skill.icon && (
                        <div className="flex-shrink-0 mr-[4%] sm:mr-[5%]">
                          <div className="w-[12%] min-w-[40px] max-w-[56px] aspect-square">
                            {skill.icon.startsWith('<svg') ? (
                              <div
                                dangerouslySetInnerHTML={{ __html: skill.icon }}
                                className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                              />
                            ) : (
                              <img 
                                src={skill.icon} 
                                alt={skill.title}
                                className="w-full h-full object-contain"
                              />
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Content Area */}
                      <div className="flex-1 flex flex-col min-w-0">
                        {/* Title */}
                        <div className="mb-[3%] sm:mb-[4%]">
                          <h4 className="text-[clamp(0.875rem,3.5vw,1.5rem)] sm:text-[clamp(1rem,2vw,1.5rem)] font-bold text-foreground dark:text-white line-clamp-2">
                            {skill.title}
                          </h4>
                        </div>
                        
                        {/* Description */}
                        <p className="text-[clamp(0.6875rem,2.8vw,1rem)] sm:text-[clamp(0.75rem,1.5vw,1rem)] text-muted-foreground dark:text-gray-400 leading-[1.5] flex-1 mb-[3%] sm:mb-[4%] line-clamp-3 xs:line-clamp-4 sm:line-clamp-4 md:line-clamp-5 lg:line-clamp-4 xl:line-clamp-5">
                          {skill.description}
                        </p>

                        {/* View Certificate Button - Bottom Right */}
                        {skill.certificateImage && (
                          <div className="flex justify-end mt-auto">
                            <button 
                              onClick={() => toggleFlip(skill._id)}
                              className="px-[3%] py-[2%] min-h-[28px] sm:min-h-[32px] bg-white dark:bg-white text-gray-900 rounded-md sm:rounded-lg text-[clamp(0.625rem,2.5vw,0.875rem)] sm:text-[clamp(0.75rem,1.5vw,0.875rem)] font-medium flex items-center gap-[2%] sm:gap-[3%] hover:bg-gray-100 transition-colors whitespace-nowrap"
                            >
                              <span className="hidden xs:inline sm:hidden">Cert</span>
                              <span className="hidden sm:inline">View Certificate</span>
                              <span className="xs:hidden">📜</span>
                              <svg className="w-[0.625rem] h-[0.625rem] sm:w-[0.875rem] sm:h-[0.875rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Back Side - Certificate */}
                    {skill.certificateImage && (
                      <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                        {skill.certificateUrl ? (
                          <a
                            href={skill.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative w-full h-full flex items-center justify-center cursor-pointer group/cert"
                          >
                            <img
                              src={skill.certificateImage}
                              alt={`${skill.title} Certificate`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover/cert:bg-black/10 transition-colors duration-300" />
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                toggleFlip(skill._id)
                              }}
                              className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-gray-800 text-white rounded-md sm:rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-900 transition-colors flex items-center gap-1 sm:gap-1.5 md:gap-2 shadow-lg z-10"
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                              <span className="hidden sm:inline">Back</span>
                            </button>
                          </a>
                        ) : (
                          <div className="relative w-full h-full flex items-center justify-center">
                            <img
                              src={skill.certificateImage}
                              alt={`${skill.title} Certificate`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => toggleFlip(skill._id)}
                              className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white text-gray-900 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-1 sm:gap-1.5 md:gap-2 shadow-lg"
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                              <span>Back</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
