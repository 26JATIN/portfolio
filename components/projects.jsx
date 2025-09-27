"use client"

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { X, ExternalLink, Github, RefreshCw, Monitor } from "lucide-react";
import Lenis from '@studio-freight/lenis'

// Enhanced Preview component with screenshot optimization
const ProjectPreview = React.memo(({ card, className, onLoad, onError, isModal = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState(card.screenshotUrl || null);
  const [imageKey, setImageKey] = useState(Date.now()); // Force re-render of images
  const imgRef = useRef(null);

  // Update screenshot URL when card prop changes (e.g., after cleanup/refresh)
  useEffect(() => {
    setScreenshotUrl(card.screenshotUrl || null);
    setImageKey(Date.now() + Math.random()); // Generate unique cache-busting key
    if (!card.screenshotUrl) {
      setIsLoaded(false);
      setHasError(false);
    }
  }, [card.screenshotUrl, card._id, card.updatedAt]); // Also trigger on updatedAt change

  // Screenshot generation is now handled only through admin panel
  // No automatic generation on frontend

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(false);
    onError?.();
    
    // Screenshot generation only available through admin panel
    // No auto-retry on error for frontend
  }, [onError]);

  // For modal view, still use iframe for interactivity
  if (isModal && card.liveUrl) {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className || ''}`}>
        <iframe
          className="w-full h-full border-0 bg-white"
          src={card.liveUrl}
          title={`${card.title} - Live Preview`}
          sandbox="allow-same-origin allow-scripts allow-forms allow-links"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className || ''}`}>
      {screenshotUrl ? (
        <>
          <img
            key={imageKey} // Force re-mount when key changes
            ref={imgRef}
            src={screenshotUrl} // Remove cache-busting from src
            alt={`${card.title} screenshot`}
            className={`w-full h-full object-cover object-top transition-opacity duration-700 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${hasError ? 'hidden' : 'block'}`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
          />
          
          {/* Hover overlay for better UX */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
        </>
      ) : null}
      
      {/* Loading state */}
      {(!isLoaded && !hasError) && screenshotUrl && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Loading preview...
            </p>
          </div>
        </div>
      )}
      
      {/* Fallback when no screenshot and no live URL */}
      {((!screenshotUrl && !card.liveUrl) || hasError) && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400 p-4">
            <Monitor className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm font-medium mb-1">{card.title}</div>
            <div className="text-xs opacity-75">
              {hasError ? 'Preview unavailable' : 'No live URL available'}
            </div>
            {/* Screenshot generation only available through admin panel */}
          </div>
        </div>
      )}
      
      {/* Click overlay for cards */}
      {!isModal && <div className="absolute inset-0 bg-transparent cursor-pointer z-10" />}
    </div>
  );
});

ProjectPreview.displayName = 'ProjectPreview';

export const Card = React.memo(({
  card,
  index,
  layout = false,
  onClick
}) => {
  const [showIframe, setShowIframe] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  // Memoize the card preview to prevent unnecessary re-renders
  const cardPreview = useMemo(() => (
    <div 
      className={`rounded-2xl transition-all duration-700 ease-out hover:scale-105 p-1 sm:p-2 aspect-[4/3] overflow-hidden relative group`}
      style={{
        borderRadius: '24px 24px 4px 24px'
      }}
    >
      <div className="bg-white dark:bg-gray-800 h-full shadow-lg relative overflow-hidden" style={{ borderRadius: '16px 16px 2px 16px' }}>
        <ProjectPreview
          card={card}
          className="w-full h-full"
          onLoad={() => {}}
          onError={() => {}}
        />
      </div>
    </div>
  ), [card]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape" && showIframe) {
        handleCloseIframe();
      }
    }

    if (showIframe) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showIframe]);

  useOutsideClick(containerRef, () => {
    if (showIframe) {
      handleCloseIframe();
    }
  });

  const handleOpen = () => {
    if (card.liveUrl) {
      setShowIframe(true);
      setIframeLoaded(false);
      setIframeError(false);
    }
    if (onClick) onClick(card);
  };

  const handleCloseIframe = () => {
    setShowIframe(false);
    setIframeLoaded(false);
    setIframeError(false);
  };

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    setIframeError(false);
  };

  const handleIframeError = () => {
    setIframeError(true);
    setIframeLoaded(false);
  };

  const handleRefreshIframe = () => {
    setIframeLoaded(false);
    setIframeError(false);
    
    // Force refresh by adding a timestamp to the URL
    if (iframeRef.current) {
      const iframe = iframeRef.current.querySelector('iframe');
      if (iframe) {
        const url = new URL(card.liveUrl);
        url.searchParams.set('_refresh', Date.now().toString());
        iframe.src = url.toString();
      }
    }
  };

  return (
    <>
      {/* Website Iframe Modal */}
      <AnimatePresence>
        {showIframe && (
          <div className="fixed inset-0 z-50 h-screen overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className={`relative z-[60] h-full w-full bg-white/5 dark:bg-black/5 backdrop-blur-xl border border-white/10 dark:border-white/5 flex flex-col`}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30
              }}
            >
              {/* Minimal Header with transparent blur */}
              <div className="flex-shrink-0 flex items-center justify-between p-2 border-b border-white/5 bg-white/5 dark:bg-black/5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-sm"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  ></motion.div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900 dark:text-white text-xs truncate max-w-[200px]">
                      {card.title}
                    </h3>
                  </div>
                </div>
                
                {/* Minimal Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleRefreshIframe}
                    className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20 backdrop-blur-sm transition-all duration-200 hover:scale-110"
                    title="Refresh (Cmd/Ctrl + R)"
                  >
                    <RefreshCw className="w-3 h-3 text-gray-700 dark:text-gray-200" />
                  </button>
                  <button
                    onClick={() => window.open(card.liveUrl, '_blank')}
                    className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20 backdrop-blur-sm transition-all duration-200 hover:scale-110"
                    title="Open in New Tab"
                  >
                    <ExternalLink className="w-3 h-3 text-gray-700 dark:text-gray-200" />
                  </button>
                  <button
                    onClick={handleCloseIframe}
                    className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 hover:bg-red-500/20 dark:bg-black/10 dark:hover:bg-red-500/20 backdrop-blur-sm transition-all duration-200 hover:scale-110"
                    title="Close (Esc)"
                  >
                    <X className="w-3 h-3 text-gray-700 dark:text-gray-200 hover:text-red-500" />
                  </button>
                </div>
              </div>

              {/* Enhanced preview container using ProjectPreview component */}
              <div className="flex-1 relative bg-transparent" ref={iframeRef}>
                <ProjectPreview
                  card={card}
                  className="w-full h-full"
                  isModal={true}
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                />
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
        className="cursor-pointer card-hover border border-gray-200 dark:border-white/10 rounded-3xl p-3 bg-white/50 dark:bg-white/5  shadow-sm hover:shadow-lg"
        transition={{ type: "spring", stiffness: 300, damping: 20 }}>
        {cardPreview}
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
});

Card.displayName = 'Card';

export function SelectedWorkSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const sectionRef = useRef(null)

  // Memoize intersection observer setup
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

  // Fetch published projects with error handling and loading states
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects?published=true', {
          signal: controller.signal
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects')
        }
        
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
        if (error.name !== 'AbortError') {
          console.error('Error fetching projects:', error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
    
    return () => {
      controller.abort()
    }
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
  const displayProjects = useMemo(() => {
    return projects.length > 0 ? projects : defaultProjects
  }, [projects])

  // Get unique categories for filter buttons
  const categories = useMemo(() => {
    const allCategories = displayProjects.map(project => project.category)
    const uniqueCategories = [...new Set(allCategories)]
    return ['ALL', ...uniqueCategories]
  }, [displayProjects])

  // Filter projects based on selected category
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'ALL') {
      return displayProjects
    }
    return displayProjects.filter(project => project.category === selectedCategory)
  }, [displayProjects, selectedCategory])

  // Memoize loading skeleton
  const loadingSkeleton = useMemo(() => (
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
  ), [])

  // Memoize rendered projects
  const renderedProjects = useMemo(() => {
    return filteredProjects.map((project, index) => (
      <motion.div
        key={`${selectedCategory}-${project.id}`}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { 
            duration: 0.6, 
            delay: index * 0.1,
            ease: "easeOut" 
          }
        }}
        exit={{ 
          opacity: 0, 
          y: -20, 
          scale: 0.95,
          transition: { duration: 0.3 }
        }}
        layout
      >
        <Card
          card={project}
          index={index}
          layout={true}
        />
      </motion.div>
    ));
  }, [filteredProjects, selectedCategory]);

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
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 hover:text-cyan-500 transition-all duration-300 cursor-default hover:scale-105 transform">
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
              {/* <Button
                variant="default"
                className="rounded-full px-4 sm:px-6 py-2 sm:py-3 bg-foreground text-background hover:bg-foreground/90 hover:scale-110 transform transition-all duration-300 hover:shadow-lg text-sm sm:text-base mb-6"
              >
                See All
              </Button> */}
              
              {/* Category Filter Buttons */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Filter by Category
                </h3>
                {/* Desktop: Vertical layout */}
                <div className="hidden lg:flex flex-col gap-2">
                  {categories.map((category) => {
                    const count = category === 'ALL' 
                      ? displayProjects.length 
                      : displayProjects.filter(p => p.category === category).length
                    
                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 flex items-center justify-between group ${
                          selectedCategory === category
                            ? 'bg-foreground text-background shadow-md'
                            : 'text-gray-600 dark:text-gray-300 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <span className="truncate">{category}</span>
                        <span className={`ml-2 text-xs px-2 py-1 rounded-full transition-colors ${
                          selectedCategory === category
                            ? 'bg-background text-foreground'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 group-hover:bg-foreground group-hover:text-background'
                        }`}>
                          {count}
                        </span>
                      </button>
                    )
                  })}
                </div>
                
                {/* Mobile: Horizontal scrollable layout */}
                <div className="lg:hidden overflow-x-auto">
                  <div className="flex gap-2 pb-2">
                    {categories.map((category) => {
                      const count = category === 'ALL' 
                        ? displayProjects.length 
                        : displayProjects.filter(p => p.category === category).length
                      
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                            selectedCategory === category
                              ? 'bg-foreground text-background shadow-md'
                              : 'text-gray-600 dark:text-gray-300 hover:text-foreground bg-gray-100 dark:bg-gray-800'
                          }`}
                        >
                          <span>{category}</span>
                          <span className={`text-xs px-2 py-1 rounded-full transition-colors ${
                            selectedCategory === category
                              ? 'bg-background text-foreground'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}>
                            {count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-4/5 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 xl:p-12 space-y-8 sm:space-y-12">
            {/* Filter Status Indicator */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4"
            >
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {selectedCategory === 'ALL' ? 'All Projects' : selectedCategory}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {filteredProjects.length} of {displayProjects.length} projects
                </p>
              </div>
              {selectedCategory !== 'ALL' && (
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className="text-sm text-gray-500 hover:text-foreground transition-colors duration-200 flex items-center gap-2"
                >
                  <span>Clear filter</span>
                  <span className="text-lg">×</span>
                </button>
              )}
            </motion.div>

            {loading ? (
              loadingSkeleton
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
                >
                  {renderedProjects}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

{/* Custom Styles for Modal and Performance Optimizations */}
<style jsx global>{`
  /* Custom scrollbar for modal content */
  .modal-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e0 transparent;
    /* Enhanced mobile scrolling */
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }

  /* Better mobile touch handling */
  @media (max-width: 768px) {
    .modal-scrollbar {
      overflow-y: scroll !important;
      -webkit-overflow-scrolling: touch;
    }
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

  /* Optimized prose styles for better typography and performance */
  .prose {
    color: #374151;
    max-width: none;
    /* Use will-change for better performance during scrolling */
    will-change: scroll-position;
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

  /* Performance optimization for animations */
  .card-hover {
    will-change: transform;
    transform: translate3d(0, 0, 0);
  }

  /* Reduce motion for users who prefer it */
  @media (prefers-reduced-motion: reduce) {
    .card-hover,
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Loading animation optimization */
  @keyframes skeleton-loading {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }

  .skeleton-loader {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200px 100%;
    animation: skeleton-loading 1.5s infinite;
  }

  .dark .skeleton-loader {
    background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
    background-size: 200px 100%;
  }
`}</style>

