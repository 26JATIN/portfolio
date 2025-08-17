"use client"

import { useEffect, useRef, useState } from "react"

export function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [missionVisible, setMissionVisible] = useState(false)
  const [servicesVisible, setServicesVisible] = useState(false)
  const sectionRef = useRef(null)
  const missionRef = useRef(null)
  const servicesRef = useRef(null)

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
        })
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    if (missionRef.current) observer.observe(missionRef.current)
    if (servicesRef.current) observer.observe(servicesRef.current)

    return () => observer.disconnect()
  }, [])

  const services = [
    {
      number: "01",
      title: "UI Design",
      description:
        "We create intuitive, visually appealing interfaces that enhance user experience and navigation, ensuring your app is both beautiful and functional across all devices.",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      iconColor: "text-purple-500",
    },
    {
      number: "02",
      title: "Development",
      description:
        "Our team builds reliable, scalable solutions, delivering clean code that powers websites and mobile apps with top-notch performance and security.",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 18L22 12L16 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M8 6L2 12L8 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      iconColor: "text-blue-500",
    },
    {
      number: "03",
      title: "Graphic Design",
      description:
        "We design responsive, user-friendly websites that blend aesthetics with functionality, providing a seamless experience across devices and reflecting your brand's identity.",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21 16V8A2 2 0 0 0 19 6H5A2 2 0 0 0 3 8V16A2 2 0 0 0 5 18H19A2 2 0 0 0 21 16Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M7 10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 14H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      iconColor: "text-purple-500",
    },
    {
      number: "04",
      title: "Branding",
      description:
        "We craft memorable brand identities, from logos to complete strategies, ensuring consistency and a strong connection with your audience across all platforms.",
      icon: (
        <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
          <span className="text-white font-bold text-sm">T</span>
        </div>
      ),
      iconColor: "text-purple-500",
    },
  ]

  const brands = [
    { name: "Jeep", logo: "Jeep" },
    { name: "Amazon", logo: "amazon" },
    { name: "Bitcoin", logo: "₿bitcoin" },
    { name: "HubSpot", logo: "HubSpot" },
    { name: "Stripe", logo: "stripe" },
    { name: "Google", logo: "Google" },
  ]

  return (
    <section
      ref={sectionRef}
      className={`py-8 sm:py-16 px-4 sm:px-8 lg:px-16 min-h-[80vh] sm:min-h-screen transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div
        ref={missionRef}
        className={`bg-teal-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 mb-8 sm:mb-16 backdrop-blur-sm bg-opacity-95 shadow-2xl border border-white/10 transition-all duration-1000 ease-out ${
          missionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
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
      </div>

      <div ref={servicesRef} className="flex flex-col lg:flex-row min-h-[60vh]">
        {/* Left sidebar with title */}
        <div className="w-full lg:w-1/4 flex-shrink-0 mb-8 lg:mb-0 lg:pr-8">
          <h3
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground dark:text-white lg:sticky lg:top-32 transition-all duration-1000 ease-out ${
              servicesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            How Can I<br />
            Assist You?
          </h3>
        </div>

        {/* Right content area with services grid */}
        <div className="w-full lg:w-3/4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {services.map((service, index) => (
              <div
                key={index}
                className={`flex flex-col sm:flex-row gap-4 sm:gap-6 p-6 sm:p-8 rounded-2xl backdrop-blur-md bg-white/5 dark:bg-white/5 border border-white/10 dark:border-white/10 shadow-lg hover:shadow-xl hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-700 ease-out hover:scale-105 ${
                  servicesVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div
                  className={`${service.iconColor} flex-shrink-0 transition-transform duration-300 hover:scale-110 self-start sm:self-center`}
                >
                  {service.icon}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <h4 className="text-lg sm:text-xl font-semibold text-foreground dark:text-white">
                      {service.title}
                    </h4>
                    <span className="text-xl sm:text-2xl font-light text-muted-foreground dark:text-gray-400">
                      {service.number}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground dark:text-gray-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
