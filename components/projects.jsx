"use client"

import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import Lenis from '@studio-freight/lenis'

export const Card = ({
  card,
  index,
  layout = false,
  onClick
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const modalContentRef = useRef(null);
  const modalLenisRef = useRef(null);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Initialize Lenis for modal content
  useEffect(() => {
    if (open && modalContentRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        modalLenisRef.current = new Lenis({
          wrapper: modalContentRef.current,
          content: modalContentRef.current.firstChild,
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          gestureDirection: 'vertical',
          smooth: true,
          mouseMultiplier: 1,
          smoothTouch: false,
          touchMultiplier: 2,
          infinite: false,
        })

        function raf(time) {
          modalLenisRef.current?.raf(time)
          if (modalLenisRef.current) {
            requestAnimationFrame(raf)
          }
        }
        requestAnimationFrame(raf)
      }, 100)
    }

    return () => {
      if (modalLenisRef.current) {
        modalLenisRef.current.destroy()
        modalLenisRef.current = null
      }
    }
  }, [open])

  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => {
    setOpen(true);
    if (onClick) onClick(card);
  };

  const handleClose = () => {
    setOpen(false);
    
    // Cleanup modal Lenis instance
    if (modalLenisRef.current) {
      modalLenisRef.current.destroy()
      modalLenisRef.current = null
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 h-screen overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-[60] mx-auto my-4 h-[calc(100vh-2rem)] max-w-5xl rounded-3xl bg-white font-sans dark:bg-neutral-900 flex flex-col"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}>
              
              {/* Fixed Header */}
              <div className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-700">
                <button
                  className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-sm transition-colors dark:bg-white/10 dark:hover:bg-white/20"
                  onClick={handleClose}>
                  <span className="text-black dark:text-white">✕</span>
                </button>
                <motion.p
                  layoutId={layout ? `category-${card.title}` : undefined}
                  className="text-base font-medium text-black dark:text-white">
                  {card.category}
                </motion.p>
                <motion.p
                  layoutId={layout ? `title-${card.title}` : undefined}
                  className="mt-2 text-2xl font-semibold text-neutral-700 md:text-4xl dark:text-white">
                  {card.title}
                </motion.p>
              </div>

              {/* Scrollable Content */}
              <div 
                ref={modalContentRef}
                className="flex-1 overflow-hidden modal-scrollbar"
                style={{ height: 'calc(100% - 120px)' }}
              >
                <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                  {/* Hero Image/Preview */}
                  <div className={`${card.gradient ? `bg-gradient-to-br ${card.gradient}` : 'bg-transparent'} rounded-2xl aspect-video p-4 sm:p-6 border-0 flex items-center justify-center`}>
                    {card.heroImage ? (
                      <img 
                        src={card.heroImage} 
                        alt={card.title}
                        className="w-full h-full object-cover rounded-lg border-0 outline-none"
                      />
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <div className="text-lg sm:text-xl font-medium">{card.title}</div>
                        <div className="text-sm mt-2">Hero image would go here</div>
                      </div>
                    )}
                  </div>

                  {/* Project Details */}
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {card.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs sm:text-sm px-2 sm:px-3 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Main Content with improved typography */}
                  <div className="prose prose-sm sm:prose-base lg:prose-lg prose-gray max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-li:text-gray-600 dark:prose-li:text-gray-300"
                       style={{
                         fontSize: 'clamp(14px, 2.5vw, 16px)',
                         lineHeight: '1.7'
                       }}>
                    {card.content}
                  </div>

                  {/* Project Gallery */}
                  {card.gallery && card.gallery.length > 0 && (
                    <div className="space-y-4 sm:space-y-6">
                      <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Project Gallery</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {card.gallery.map((image, imgIndex) => (
                          <div key={imgIndex} className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <img 
                              src={image.src} 
                              alt={image.alt || `${card.title} - Image ${imgIndex + 1}`}
                              className="w-full h-48 sm:h-56 lg:h-64 object-cover gallery-image cursor-pointer transition-transform duration-300 hover:scale-105"
                            />
                            {image.caption && (
                              <div className="p-3 text-sm text-gray-600 dark:text-gray-300">
                                {image.caption}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technical Details */}
                  {card.techStack && card.techStack.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Technology Stack</h4>
                      <div className="flex flex-wrap gap-2">
                        {card.techStack.map((tech, techIndex) => (
                          <span 
                            key={techIndex}
                            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button className="rounded-full flex-1 sm:flex-none" size="lg">
                      {card.liveUrl ? 'View Live Site' : 'View Project'}
                    </Button>
                    <Button variant="outline" className="rounded-full flex-1 sm:flex-none" size="lg">
                      Case Study
                    </Button>
                  </div>

                  {/* Extra spacing for better scroll experience */}
                  <div className="h-8 sm:h-12"></div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.div
        layoutId={layout ? `card-${card.title}` : undefined}
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleOpen}
        className="cursor-pointer"
        transition={{ type: "spring", stiffness: 300, damping: 20 }}>
        <div 
          className={`${card.gradient ? `bg-gradient-to-br ${card.gradient}` : 'bg-transparent'} p-4 sm:p-6 aspect-[4/3] overflow-hidden`}
          style={{
            borderRadius: '24px 24px 4px 24px'
          }}
        >
          <div className="bg-white dark:bg-gray-800 h-full shadow-lg relative overflow-hidden" style={{ borderRadius: '16px 16px 2px 16px' }}>
            {card.heroImage ? (
              <img 
                src={card.heroImage} 
                alt={card.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                  <div className="text-base sm:text-lg font-medium mb-2">{card.title}</div>
                  <div className="text-xs sm:text-sm">Hero image will appear here</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start gap-2">
              <motion.h3 
                layoutId={layout ? `title-${card.title}` : undefined}
                className="text-lg sm:text-xl font-semibold text-foreground leading-tight flex-1"
              >
                {card.title}
              </motion.h3>
              <span className="text-muted-foreground text-sm sm:text-base font-medium flex-shrink-0">{card.year}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {card.tags.map((tag, tagIndex) => (
              <Badge
                key={tagIndex}
                className="text-xs sm:text-sm px-2 sm:px-3 py-1"
                variant="default"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export function SelectedWorkSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
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

  // Fetch published projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects?published=true')
        const data = await response.json()
        
        if (data.success) {
          // Transform the projects to match the existing Card component structure
          const transformedProjects = data.projects.map(project => ({
            ...project,
            id: project._id,
            // Create a preview component from project data
            preview: (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="w-6 h-6 rounded" 
                    style={{ backgroundColor: '#3B82F6' }}
                  ></div>
                  <span className="text-sm font-medium">{project.title}</span>
                </div>
                <h4 className="text-lg font-bold leading-tight">
                  {project.title}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {project.projectOverview || project.category}
                </p>
                <div className="flex gap-2 mt-4">
                  <button 
                    className="text-white text-sm px-4 py-2 rounded bg-blue-600"
                  >
                    View Project
                  </button>
                  <button className="border text-sm px-4 py-2 rounded">
                    Learn More
                  </button>
                </div>
                <div className="mt-4 flex justify-end">
                  <div 
                    className="w-16 h-16 rounded-full opacity-20 bg-blue-600"
                  ></div>
                </div>
              </div>
            ),
            // Create structured content JSX
            content: (
              <div className="space-y-8">
                {project.projectOverview && (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Project Overview</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                      {project.projectOverview}
                    </p>
                  </div>
                )}
                
                {project.challenge && (
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">The Challenge</h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {project.challenge}
                    </p>
                  </div>
                )}

                {project.designProcess && (
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Design Process</h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {project.designProcess}
                    </p>
                  </div>
                )}

                {project.keyFeatures && project.keyFeatures.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Key Features</h4>
                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-3 text-base">
                      {project.keyFeatures.map((feature, index) => (
                        <li key={index}>
                          <strong className="text-gray-900 dark:text-white">{feature.title}:</strong> {feature.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.technicalImplementation && (
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Technical Implementation</h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {project.technicalImplementation}
                    </p>
                  </div>
                )}

                {project.results && (
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Results & Impact</h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                      {project.results}
                    </p>
                    {project.resultMetrics && project.resultMetrics.length > 0 && (
                      <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 ml-4">
                        {project.resultMetrics.map((metric, index) => (
                          <li key={index}>{metric}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )
          }))
          setProjects(transformedProjects)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const defaultProjects = [
    {
      id: 1,
      title: "ZENPOINT WELLNESS",
      year: "2023",
      category: "WEB DESIGN & BRANDING",
      tags: ["WEB DESIGN", "BRANDING"],
      gradient: "from-blue-100 to-blue-200",
      src: "/zenpoint-preview.png",
      heroImage: "/zenpoint-hero.jpg",
      description: "A mindfulness and wellness platform focusing on inner peace and mental clarity.",
      type: "wellness",
      liveUrl: "https://zenpoint-wellness.com",
      techStack: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Node.js", "MongoDB"],
      gallery: [
        {
          src: "/zenpoint-gallery-1.jpg",
          alt: "ZenPoint Homepage Design",
          caption: "Clean and calming homepage design with intuitive navigation"
        },
        {
          src: "/zenpoint-gallery-2.jpg", 
          alt: "Meditation Sessions Interface",
          caption: "Interactive meditation sessions with customizable timers"
        },
        {
          src: "/zenpoint-gallery-3.jpg",
          alt: "Progress Tracking Dashboard",
          caption: "Comprehensive progress tracking and wellness analytics"
        },
        {
          src: "/zenpoint-gallery-4.jpg",
          alt: "Mobile App Interface",
          caption: "Responsive mobile design for on-the-go mindfulness"
        }
      ],
      preview: (
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
      ),
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Project Overview</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              ZenPoint Wellness is a comprehensive mindfulness and wellness platform designed to help users find inner peace and mental clarity in today's fast-paced world. The project focused on creating a calming digital experience that reflects the brand's core values of tranquility and mindfulness.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">The Challenge</h4>
            <p className="text-gray-600 leading-relaxed">
              In an increasingly digital world, people are struggling to find moments of peace and mindfulness. Traditional wellness platforms often felt clinical or overwhelming, failing to create the serene environment necessary for true relaxation and mental clarity.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Design Process</h4>
            <p className="text-gray-600 leading-relaxed">
              The design process began with extensive research into wellness psychology and user behavior patterns. We conducted user interviews with meditation practitioners and wellness enthusiasts to understand their digital needs and pain points. This research informed our decision to prioritize simplicity, calming colors, and intuitive navigation.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We developed a design system based on natural elements - soft blues reminiscent of calm waters, gentle greens reflecting nature, and warm whites suggesting clouds and open spaces. Every interaction was carefully crafted to feel effortless and peaceful.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Key Features</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-3 text-base">
              <li><strong>Guided Meditation Sessions:</strong> Customizable meditation experiences with various durations and themes</li>
              <li><strong>Progress Tracking:</strong> Beautiful visualizations of mindfulness streaks and personal growth</li>
              <li><strong>Ambient Soundscapes:</strong> High-quality nature sounds and calming music library</li>
              <li><strong>Community Features:</strong> Connect with like-minded individuals on shared wellness journeys</li>
              <li><strong>Personalized Recommendations:</strong> AI-driven suggestions based on user preferences and progress</li>
              <li><strong>Breathing Exercises:</strong> Interactive breathing guides with visual cues and rhythm control</li>
              <li><strong>Sleep Stories:</strong> Narrated stories designed to promote restful sleep</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Technical Implementation</h4>
            <p className="text-gray-600 leading-relaxed">
              Built with modern web technologies, ZenPoint Wellness delivers a smooth, responsive experience across all devices. We implemented advanced features like offline meditation downloads, background audio playback, and seamless synchronization across platforms. The application uses progressive web app (PWA) technology for app-like performance in web browsers.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Results & Impact</h4>
            <p className="text-gray-600 leading-relaxed">
              The platform launched to overwhelmingly positive reception, with users praising the intuitive interface and genuinely calming design aesthetic. Key metrics showed remarkable improvement:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>40% increase in user engagement compared to previous platform</li>
              <li>85% session completion rate for guided meditations</li>
              <li>4.8/5 star rating in app stores</li>
              <li>60% of users reported improved sleep quality after 30 days</li>
              <li>50,000+ active monthly users within first quarter</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "TIMBER ELEGANCE",
      year: "2022",
      category: "E-COMMERCE & PRODUCT DESIGN",
      tags: ["E-COMMERCE", "PRODUCT DESIGN"],
      gradient: "from-amber-100 to-amber-200",
      src: "/timber-preview.png",
      heroImage: "/timber-hero.jpg",
      description: "Premium furniture e-commerce platform with sustainable design focus.",
      type: "ecommerce",
      liveUrl: "https://timber-elegance.com",
      techStack: ["Next.js", "TypeScript", "Shopify", "Three.js", "Stripe", "Sanity CMS"],
      gallery: [
        {
          src: "/timber-gallery-1.jpg",
          alt: "Product Catalog Page",
          caption: "Elegant product grid showcasing premium furniture pieces"
        },
        {
          src: "/timber-gallery-2.jpg",
          alt: "Product Detail View",
          caption: "Detailed product views with 360° rotation and material close-ups"
        },
        {
          src: "/timber-gallery-3.jpg",
          alt: "AR Visualization",
          caption: "Augmented reality feature for placing furniture in user's space"
        },
        {
          src: "/timber-gallery-4.jpg",
          alt: "Sustainability Page",
          caption: "Transparency in sourcing and environmental commitment"
        }
      ],
      preview: (
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
      ),
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Project Overview</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              Timber Elegance represents a new approach to furniture e-commerce, focusing on sustainable, premium wood furniture. The platform combines elegant design with cutting-edge technology to create an immersive shopping experience that reflects the quality and craftsmanship of the products.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">The Challenge</h4>
            <p className="text-gray-600 leading-relaxed">
              The main challenge was conveying the tactile quality and craftsmanship of premium wood furniture through digital means. Customers needed to understand the texture, grain patterns, and build quality without physical interaction. Additionally, the brand wanted to transparently communicate their sustainability practices and ethical sourcing.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Innovative Solutions</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-3 text-base">
              <li><strong>360° Product Photography:</strong> High-resolution images showing every angle and detail of each piece</li>
              <li><strong>Material Close-ups:</strong> Macro photography revealing wood grain patterns and finish quality</li>
              <li><strong>AR Visualization:</strong> Augmented reality feature allowing customers to place furniture in their space</li>
              <li><strong>Sustainability Certificates:</strong> Digital certificates and sourcing transparency for each product</li>
              <li><strong>Customer Gallery:</strong> Real customer photos showing furniture in actual homes</li>
              <li><strong>Virtual Showroom:</strong> 3D rendered rooms showcasing furniture in context</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Design Philosophy</h4>
            <p className="text-gray-600 leading-relaxed">
              The design philosophy centered around "Digital Craftsmanship" - every element of the user interface was crafted with the same attention to detail as the furniture pieces themselves. We used warm, natural color palettes, premium typography, and spacious layouts that let the products shine.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Results</h4>
            <p className="text-gray-600 leading-relaxed">
              The platform exceeded all expectations, transforming how customers interact with premium furniture online:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>250% increase in online sales within 6 months</li>
              <li>40% reduction in product returns due to better visualization</li>
              <li>92% customer satisfaction rating</li>
              <li>Featured in Furniture Design Magazine as "E-commerce Innovation of the Year"</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "DIGITAL AGENCY PRO",
      year: "2023",
      category: "AGENCY & WEB DESIGN",
      tags: ["AGENCY", "WEB DESIGN"],
      gradient: "from-purple-100 to-purple-200",
      src: "/agency-preview.png",
      heroImage: "/agency-hero.jpg",
      description: "Modern digital agency website with portfolio showcase.",
      type: "agency",
      liveUrl: "https://digital-agency-pro.com",
      techStack: ["React", "Gatsby", "GraphQL", "Contentful", "GSAP", "Netlify"],
      gallery: [
        {
          src: "/agency-gallery-1.jpg",
          alt: "Agency Homepage",
          caption: "Bold and creative homepage design with interactive elements"
        },
        {
          src: "/agency-gallery-2.jpg",
          alt: "Portfolio Showcase",
          caption: "Dynamic portfolio grid with hover effects and case study previews"
        },
        {
          src: "/agency-gallery-3.jpg",
          alt: "Team Section",
          caption: "Meet the team section with personality-driven profiles"
        },
        {
          src: "/agency-gallery-4.jpg",
          alt: "Contact Form",
          caption: "Streamlined contact and project inquiry system"
        }
      ],
      preview: (
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
      ),
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Project Overview</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              Digital Agency Pro needed a website that would showcase their creative capabilities while maintaining professional credibility. The challenge was creating a balance between creative expression and business functionality that would appeal to both startups and enterprise clients.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Design Philosophy</h4>
            <p className="text-gray-600 leading-relaxed">
              The design philosophy centered around "Creative Professionalism" - showcasing the agency's creative capabilities while maintaining the trust and credibility that potential clients expect from a professional service provider. Every element was designed to demonstrate the agency's expertise through the website itself.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Key Features</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-3 text-base">
              <li><strong>Interactive Portfolio:</strong> Dynamic showcase with filterable case studies and live project previews</li>
              <li><strong>Team Profiles:</strong> Personality-driven team member profiles highlighting expertise and experience</li>
              <li><strong>Client Testimonials:</strong> Video testimonials and detailed success stories with metrics</li>
              <li><strong>Service Breakdown:</strong> Clear service descriptions with transparent pricing information</li>
              <li><strong>Project Estimator:</strong> Interactive tool for potential clients to estimate project costs</li>
              <li><strong>Blog & Insights:</strong> Industry insights and thought leadership content</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Results</h4>
            <p className="text-gray-600 leading-relaxed">
              The new website became a powerful business development tool:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>300% increase in qualified lead generation</li>
              <li>Average project value increased by 150%</li>
              <li>Won 3 major enterprise contracts directly through website inquiries</li>
              <li>Featured in Awwwards and CSS Design Awards</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "MOBILE FINTECH",
      year: "2023",
      category: "FINTECH & MOBILE DESIGN",
      tags: ["FINTECH", "MOBILE"],
      gradient: "from-green-100 to-green-200",
      src: "/fintech-preview.png",
      heroImage: "/fintech-hero.jpg",
      description: "Secure mobile banking application with modern UX.",
      type: "fintech",
      liveUrl: "https://mobile-fintech-app.com",
      techStack: ["React Native", "Node.js", "PostgreSQL", "Redis", "AWS", "Stripe"],
      gallery: [
        {
          src: "/fintech-gallery-1.jpg",
          alt: "App Dashboard",
          caption: "Clean and intuitive dashboard with financial overview"
        },
        {
          src: "/fintech-gallery-2.jpg",
          alt: "Transaction Flow",
          caption: "Secure and seamless money transfer interface"
        },
        {
          src: "/fintech-gallery-3.jpg",
          alt: "Security Features",
          caption: "Biometric authentication and security settings"
        },
        {
          src: "/fintech-gallery-4.jpg",
          alt: "Analytics View",
          caption: "Personal finance analytics and spending insights"
        }
      ],
      preview: (
        <>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Bitcoin (BTC)</span>
              <span className="text-green-600 font-bold">+5.2%</span>
            </div>
            <div className="h-8 bg-green-200 rounded flex items-end p-1">
              <div className="w-full h-4 bg-green-500 rounded"></div>
            </div>
            <div className="text-xl font-bold">$45,234.67</div>
            <p className="text-sm text-gray-600">24h Volume: $2.1B</p>
            <button className="bg-green-500 text-white text-sm px-6 py-2 rounded">Trade Now</button>
          </div>
        </>
      ),
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Project Overview</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              A next-generation mobile banking application designed to provide secure, intuitive financial management tools for the modern user. The project emphasized cutting-edge security while maintaining a modern, approachable interface that makes complex financial operations simple and accessible.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Security-First Design</h4>
            <p className="text-gray-600 leading-relaxed">
              In fintech, security isn't just a feature—it's the foundation. Every design decision was made with security in mind, from the initial user onboarding flow to daily transaction processes. We implemented multiple layers of protection while ensuring the user experience remained seamless and trustworthy.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Advanced Security Features</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-3 text-base">
              <li><strong>Biometric Authentication:</strong> Fingerprint and facial recognition with fallback security questions</li>
              <li><strong>Multi-Factor Authentication:</strong> SMS, email, and authenticator app integration</li>
              <li><strong>End-to-End Encryption:</strong> All data encrypted both in transit and at rest</li>
              <li><strong>Real-time Fraud Detection:</strong> AI-powered monitoring with instant alerts</li>
              <li><strong>Secure Document Upload:</strong> Encrypted document storage with automatic PII detection</li>
              <li><strong>Session Management:</strong> Automatic logout and session monitoring across devices</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">User Experience Innovation</h4>
            <p className="text-gray-600 leading-relaxed">
              The UX design focused on simplifying complex financial operations while maintaining complete transparency and control for users. We conducted extensive usability testing across different user demographics, ensuring accessibility for users with varying levels of tech-savviness and financial literacy.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Results & Impact</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Zero security breaches since launch</li>
              <li>4.9/5 star rating in app stores</li>
              <li>200,000+ active users within first year</li>
              <li>95% customer satisfaction for security features</li>
              <li>Named "Most Innovative Fintech App" by TechCrunch</li>
            </ul>
          </div>
        </div>
      )
    },
  ]

  // Fallback projects for when API is not available or loading
  const displayProjects = projects.length > 0 ? projects : defaultProjects

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
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded-3xl aspect-[4/3] mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
              >
                {displayProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.9 + (index * 0.1),
                      ease: "easeOut" 
                    }}
                  >
                    <Card
                    card={project}
                    index={index}
                    layout={true}
                  />
                </motion.div>
              ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

{/* Custom Styles for Modal */}
<style jsx global>{`
  /* Custom scrollbar for modal content */
  .modal-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e0 transparent;
  }

  .modal-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .modal-scrollbar::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }

  .modal-scrollbar::-webkit-scrollbar-thumb {
    background-color: #cbd5e0;
    border-radius: 3px;
  }

  .modal-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #a0aec0;
  }

  /* Dark mode scrollbar */
  .dark .modal-scrollbar {
    scrollbar-color: #4a5568 transparent;
  }

  .dark .modal-scrollbar::-webkit-scrollbar-thumb {
    background-color: #4a5568;
  }

  .dark .modal-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #718096;
  }

  /* Prose styles for better typography */
  .prose {
    color: #374151;
    max-width: none;
  }

  .prose h3 {
    color: #111827;
    font-weight: 700;
    font-size: 1.5rem;
    line-height: 1.6;
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .prose h4 {
    color: #111827;
    font-weight: 600;
    font-size: 1.25rem;
    line-height: 1.6;
    margin-top: 0;
    margin-bottom: 0.75rem;
  }

  .prose p {
    margin-top: 0;
    margin-bottom: 1rem;
    line-height: 1.7;
  }

  .prose ul {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .prose li {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .prose strong {
    color: #111827;
    font-weight: 600;
  }

  /* Dark mode prose */
  .dark .prose {
    color: #d1d5db;
  }

  .dark .prose h3,
  .dark .prose h4 {
    color: #f9fafb;
  }

  .dark .prose strong {
    color: #f9fafb;
  }

  /* Image hover effects */
  .gallery-image {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .gallery-image:hover {
    transform: scale(1.05);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
`}</style>

