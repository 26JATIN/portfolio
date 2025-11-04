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
  const [certificates, setCertificates] = useState([])
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
      }
    }

    fetchSkills()
  }, [])

  // Fetch certificates
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch('/api/certificates?published=true')
        const data = await response.json()
        if (data.success) {
          setCertificates(data.certificates)
        }
      } catch (error) {
        console.error('Error fetching certificates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCertificates()
  }, [])

  const brands = []

  return (
    <section
      ref={sectionRef}
      className={`py-8 sm:py-16 px-4 sm:px-8 lg:px-16 min-h-[80vh] sm:min-h-screen transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div ref={missionRef}>
        <WobbleCard
          containerClassName={`bg-teal-700 h-40 sm:h-70 md:h-70 mb-8 sm:mb-16 transition-all duration-1000 ease-out ${
            missionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
          className="flex flex-col justify-center"
        >
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8 leading-tight">
          My mission is to assist startups and enterprises in creating an emotional bond between their products and
          satisfied, engaged customers.
        </h2>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-12">
          {brands.map((brand, index) => (
            <div
              key={index}
              className={`text-white/80 font-medium text-sm sm:text-base lg:text-lg transition-all duration-700 ease-out ${
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
      <div ref={servicesRef} className="flex flex-col lg:flex-row min-h-[60vh]">
        {/* Left sidebar with title */}
        <div className="w-full lg:w-1/4 flex-shrink-0 mb-8 lg:mb-0 lg:pr-8">
          <h3
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground dark:text-white lg:sticky lg:top-32 hover:text-cyan-500 dark:hover:text-cyan-500 transition-all duration-300 cursor-default hover:scale-105 transform ${
              servicesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            How Can I<br />
            Assist You?
          </h3>
        </div>

        {/* Right content area with services grid */}
        <div className="w-full lg:w-3/4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
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
                <div className="relative w-full group" style={{ paddingBottom: '69.543%' }}> {/* Reduced card aspect ratio */}
                  <div className={`absolute inset-0 [transform-style:preserve-3d] transition-all duration-700 ${flippedCards[skill._id] ? '[transform:rotateY(180deg)]' : ''}`}>
                    {/* Front Side */}
                    <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl backdrop-blur-md bg-white/5 dark:bg-white/5 shadow-lg p-6 flex transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1">
                      {/* Icon on Left */}
                      {skill.icon && (
                        <div className="flex-shrink-0 mr-6">
                          <div className="w-14 h-14">
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
                      <div className="flex-1 flex flex-col">
                        {/* Title and Number */}
                        <div className="flex items-baseline gap-3 mb-4">
                          <h4 className="text-2xl font-bold text-foreground dark:text-white">
                            {skill.title}
                          </h4>
                          <span className="text-3xl font-light text-muted-foreground dark:text-gray-500">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                        
                        {/* Description */}
                        <p className="text-sm text-muted-foreground dark:text-gray-400 leading-relaxed flex-1 mb-4">
                          {skill.description}
                        </p>

                        {/* View Certificate Button - Bottom Right */}
                        {skill.certificateImage && (
                          <div className="flex justify-end">
                            <button 
                              onClick={() => toggleFlip(skill._id)}
                              className="px-4 py-2 bg-white dark:bg-white text-gray-900 rounded-lg text-sm font-medium flex items-center gap-2"
                            >
                              <span>View Certificate</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Back Side - Certificate */}
                    {skill.certificateImage && (
                      <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden shadow-lg">
                        {skill.certificateUrl ? (
                          <a
                            href={skill.certificateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative w-full h-full flex items-center justify-center cursor-pointer"
                          >
                            <img
                              src={skill.certificateImage}
                              alt={`${skill.title} Certificate`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                toggleFlip(skill._id)
                              }}
                              className="absolute top-2 left-2 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors flex items-center gap-2 shadow-lg"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                             
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
                              className="absolute top-4 left-4 px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Certificates Section */}
      {certificates.length > 0 && (
        <div ref={certificatesRef} className="mt-16 sm:mt-24">
          <div className="flex flex-col lg:flex-row min-h-[40vh]">
            {/* Left sidebar with title */}
            <div className="w-full lg:w-1/4 flex-shrink-0 mb-8 lg:mb-0 lg:pr-8">
              <h3
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground dark:text-white lg:sticky lg:top-32 hover:text-cyan-500 dark:hover:text-cyan-500 transition-all duration-300 cursor-default hover:scale-105 transform ${
                  certificatesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
              >
                Certificates &<br />
                Achievements
              </h3>
            </div>

            {/* Right content area with certificates grid */}
            <div className="w-full lg:w-3/4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                {certificates.map((certificate, index) => (
                  <div
                    key={certificate._id}
                    className={`group relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/10 shadow-lg hover:shadow-xl hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-700 ease-out hover:scale-105 ${
                      certificatesVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    {/* Certificate Image */}
                    {certificate.certificateImage && (
                      <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-gray-100 dark:bg-gray-900">
                        <img
                          src={certificate.certificateImage}
                          alt={certificate.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-purple-500/90 text-white border-0">
                            <Award className="w-3 h-3 mr-1" />
                            Certified
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Certificate Details */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg sm:text-xl font-semibold text-foreground dark:text-white pr-2">
                          {certificate.title}
                        </h4>
                        {certificate.credentialUrl && (
                          <a
                            href={certificate.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 text-blue-500 hover:text-blue-600 transition-colors"
                            title="View Certificate"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                          {certificate.issuer}
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-gray-500">
                          Issued: {new Date(certificate.issueDate).toLocaleDateString('en-US', { 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </p>
                        {certificate.credentialId && (
                          <p className="text-xs text-muted-foreground dark:text-gray-500 font-mono">
                            ID: {certificate.credentialId}
                          </p>
                        )}
                      </div>

                      {certificate.description && (
                        <p className="text-sm text-muted-foreground dark:text-gray-300 leading-relaxed mb-4">
                          {certificate.description}
                        </p>
                      )}

                      {certificate.skills && certificate.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {certificate.skills.map((skill, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
