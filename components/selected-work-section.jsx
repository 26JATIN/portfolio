"use client"

import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { CardContainer, CardBody, CardItem } from "../components/ui/3d-card"
import { useEffect, useRef, useState } from "react"

export function SelectedWorkSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [animationOrigin, setAnimationOrigin] = useState({ x: 0, y: 0 })
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const projects = [
    {
      id: 1,
      title: "ZENPOINT WELLNESS",
      year: "2023",
      tags: ["WEB DESIGN", "BRANDING"],
      gradient: "from-blue-100 to-blue-200",
      image: "/zenpoint-preview.png",
      description: "A mindfulness and wellness platform focusing on inner peace and mental clarity.",
      type: "wellness"
    },
    {
      id: 2,
      title: "TIMBER ELEGANCE",
      year: "2022",
      tags: ["E-COMMERCE", "PRODUCT DESIGN"],
      gradient: "from-amber-100 to-amber-200",
      image: "/timber-preview.png",
      description: "Premium furniture e-commerce platform with sustainable design focus.",
      type: "ecommerce"
    },
    {
      id: 3,
      title: "DIGITAL AGENCY PRO",
      year: "2023",
      tags: ["AGENCY", "WEB DESIGN"],
      gradient: "from-purple-100 to-purple-200",
      image: "/agency-preview.png",
      description: "Modern digital agency website with portfolio showcase.",
      type: "agency"
    },
    {
      id: 4,
      title: "DIGITAL AGENCY PRO",
      year: "2023",
      tags: ["AGENCY", "WEB DESIGN"],
      gradient: "from-purple-100 to-purple-200",
      image: "/agency-preview.png",
      description: "Modern digital agency website with portfolio showcase.",
      type: "agency"
    },
  ]

  const handleCardClick = (project, event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setAnimationOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
    setSelectedProject(project)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setSelectedProject(null)
    document.body.style.overflow = "unset"
  }

  const renderProjectContent = (project) => {
    switch (project.type) {
      case "wellness":
        return (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2 sm:gap-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
                <span className="text-sm font-medium">Zenpoint</span>
              </div>
              <div className="hidden sm:flex gap-3 text-xs">
                <span>About</span>
                <span>Service</span>
                <span>Programs</span>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Log In</button>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-bold leading-tight">Explore inner peace</h4>
              <p className="text-sm text-gray-600 line-clamp-3">Guided meditation and mindfulness techniques for mental clarity</p>
              <div className="flex gap-2 mt-4">
                <button className="bg-black text-white text-sm px-4 py-2 rounded">Start Now</button>
                <button className="border text-sm px-4 py-2 rounded">Learn More</button>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <div className="w-16 h-16 bg-blue-200 rounded-full"></div>
            </div>
          </>
        )
      
      case "ecommerce":
        return (
          <>
            <div className="absolute top-3 right-3">
              <button className="text-sm">✕</button>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-bold">Timber Elegance</h4>
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-amber-200 rounded flex-shrink-0"></div>
                <div className="flex-1 text-sm">
                  <p>Premium Wood</p>
                  <p>Sustainable Design</p>
                  <p>Quality: Premium</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Premium carbon free oak furniture at unbeatable prices</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-bold">$1,299</span>
                <button className="bg-black text-white text-sm px-4 py-2 rounded">Shop Now</button>
              </div>
            </div>
          </>
        )

      case "agency":
        return (
          <>
            <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-8 bg-purple-600 rounded"></div>
              <div className="text-sm space-x-4">
                <span>Work</span>
                <span>About</span>
                <span>Contact</span>
              </div>
            </div>
            <h4 className="text-lg font-bold mb-2">Creative Digital Solutions</h4>
            <p className="text-sm text-gray-600 mb-4">We craft digital experiences that drive results and engage users</p>
            <button className="bg-purple-600 text-white text-sm px-6 py-2 rounded">Get Quote</button>
          </>
        )

      case "mobile":
        return (
          <>
            <div className="bg-green-500 rounded p-3 mb-4">
              <div className="bg-white rounded text-center py-2">
                <span className="text-sm font-bold">FoodieApp</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-green-400 rounded"></div>
                <span className="text-sm">Order in 2 mins</span>
              </div>
              <p className="text-sm text-gray-600">Fast food delivery with real-time tracking</p>
              <button className="bg-green-500 text-white text-sm px-6 py-2 rounded w-full">Order Now</button>
            </div>
          </>
        )

      case "fintech":
        return (
          <>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Bitcoin (BTC)</span>
                <span className="text-green-600 font-bold">+5.2%</span>
              </div>
              <div className="h-8 bg-orange-200 rounded flex items-end p-1">
                <div className="w-full h-4 bg-orange-500 rounded"></div>
              </div>
              <div className="text-xl font-bold">$45,234.67</div>
              <p className="text-sm text-gray-600">24h Volume: $2.1B</p>
              <button className="bg-orange-500 text-white text-sm px-6 py-2 rounded">Trade Now</button>
            </div>
          </>
        )

      case "education":
        return (
          <>
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-indigo-500 rounded"></div>
                <span className="text-sm font-medium">LearnPro</span>
              </div>
              <h4 className="text-lg font-bold">Web Development Course</h4>
              <div className="bg-indigo-100 rounded p-2">
                <div className="bg-indigo-500 h-2 rounded w-3/4"></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Progress: 75% Complete</span>
                <span>Rating: 4.8★</span>
              </div>
              <button className="bg-indigo-500 text-white text-sm px-6 py-2 rounded">Continue Learning</button>
            </div>
          </>
        )

      default:
        return <div className="text-sm text-gray-500">Project preview</div>
    }
  }

  return (
    <section ref={sectionRef} className="bg-background">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/5 p-4 sm:p-6 lg:p-8 xl:p-12 flex flex-col justify-start">
          <div className="lg:sticky lg:top-8">
            <div
              className={`transform transition-all duration-1500 ease-out ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-[50vh] opacity-0"
              }`}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 hover:text-cyan-500 transition-colors duration-300 cursor-default hover:scale-105 transform transition-transform">
                Selected
                <br />
                work
              </h2>
            </div>
            <div
              className={`transform transition-all duration-1000 ease-out delay-500 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <Button
                variant="default"
                className="rounded-full px-4 sm:px-6 py-2 sm:py-3 bg-foreground text-background hover:bg-foreground/90 hover:scale-110 transform transition-all duration-300 hover:shadow-lg text-sm sm:text-base"
              >
                See All
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-4/5 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 xl:p-12 space-y-8 sm:space-y-12">
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 transform transition-all duration-1000 ease-out delay-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
            >
              {projects.map((project) => (
                <CardContainer
                  key={project.id}
                  className="inter-var cursor-pointer"
                  containerClassName="py-0"
                >
                  <CardBody className="relative group/card w-full h-auto p-0" style={{ width: 'auto', height: 'auto' }}>
                    <div
                      onClick={(e) => handleCardClick(project, e)}
                      className="space-y-4 transition-all duration-500"
                    >
                      <CardItem
                        translateZ="100"
                        rotateX={5}
                        rotateY={5}
                        className="w-full"
                      >
                        <div 
                          className={`bg-gradient-to-br ${project.gradient} p-6 aspect-[4/3] overflow-hidden`}
                          style={{
                            borderRadius: '24px 24px 4px 24px' // rounded except bottom-left corner
                          }}
                        >
                          <div className="bg-white h-full p-4 shadow-lg relative" style={{ borderRadius: '16px 16px 2px 16px' }}>
                            {renderProjectContent(project)}
                          </div>
                        </div>
                      </CardItem>

                      <CardItem translateZ="50" className="w-full">
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xl font-semibold text-foreground leading-tight">{project.title}</h3>
                            <span className="text-muted-foreground text-lg">{project.year}</span>
                          </div>
                        </div>
                      </CardItem>

                      <CardItem translateZ="60" className="w-full">
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              className={
                                index === 0
                                  ? `text-sm px-3 py-1`
                                  : "text-sm px-3 py-1"
                              }
                              variant={index === 0 ? "default" : "outline"}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardItem>
                    </div>
                  </CardBody>
                </CardContainer>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            transformOrigin: `${animationOrigin.x}px ${animationOrigin.y}px`,
            animation: "modalOpen 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          }}
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={closeModal}
            style={{ animation: "fadeIn 0.3s ease-out forwards" }}
          />
          <div
            className="relative max-w-4xl max-h-[90vh] w-full mx-4 bg-white dark:bg-black rounded-2xl shadow-2xl overflow-hidden"
            style={{
              transformOrigin: `${animationOrigin.x}px ${animationOrigin.y}px`,
              animation: "cardExpand 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            }}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
            >
              ✕
            </button>

            <div className="p-8">
              <div className={`bg-gradient-to-br ${selectedProject.gradient} rounded-2xl p-8 mb-6`}>
                <div className="bg-white rounded-xl h-96 p-6 shadow-lg">
                  <div className="text-center text-gray-500 flex items-center justify-center h-full text-lg">
                    {selectedProject.title} - Full Website Preview
                    <br />
                    <span className="text-sm mt-2">Actual website content would go here</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-3xl font-bold text-foreground">{selectedProject.title}</h2>
                  <span className="text-muted-foreground text-lg">{selectedProject.year}</span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {selectedProject.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  Detailed project description would go here. This is where you would explain the project goals,
                  design process, technologies used, and the final outcome.
                </p>

                <div className="flex gap-4 pt-4">
                  <Button className="rounded-full">View Live Site</Button>
                  <Button variant="outline" className="rounded-full">Case Study</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes modalOpen {
          from {
            transform: scale(0) translate(-50%, -50%);
            opacity: 0;
          }
          to {
            transform: scale(1) translate(0, 0);
            opacity: 1;
          }
        }

        @keyframes cardExpand {
          from {
            transform: scale(0.1);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  )
}
  
