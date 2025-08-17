"use client"

import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import Lenis from '@studio-freight/lenis'

export const Card = ({
  card,
  index,
  layout = false,
  onClick
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

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

  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => {
    setOpen(true);
    if (onClick) onClick(card);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 h-screen overflow-auto">
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
              className="relative z-[60] mx-auto my-10 h-fit max-w-5xl rounded-3xl bg-white p-4 font-sans md:p-10 dark:bg-neutral-900"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}>
              <button
                className="sticky top-4 right-0 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white"
                onClick={handleClose}>
                <span className="text-neutral-100 dark:text-neutral-900">✕</span>
              </button>
              <motion.p
                layoutId={layout ? `category-${card.title}` : undefined}
                className="text-base font-medium text-black dark:text-white">
                {card.category}
              </motion.p>
              <motion.p
                layoutId={layout ? `title-${card.title}` : undefined}
                className="mt-4 text-2xl font-semibold text-neutral-700 md:text-5xl dark:text-white">
                {card.title}
              </motion.p>
              <div className="py-10">{card.content}</div>
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
          className={`bg-gradient-to-br ${card.gradient} p-6 aspect-[4/3] overflow-hidden`}
          style={{
            borderRadius: '24px 24px 4px 24px'
          }}
        >
          <div className="bg-white h-full p-4 shadow-lg relative" style={{ borderRadius: '16px 16px 2px 16px' }}>
            {card.preview}
          </div>
        </div>
        <div className="space-y-4 mt-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <motion.h3 
                layoutId={layout ? `title-${card.title}` : undefined}
                className="text-xl font-semibold text-foreground leading-tight"
              >
                {card.title}
              </motion.h3>
              <span className="text-muted-foreground text-lg">{card.year}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {card.tags.map((tag, tagIndex) => (
              <Badge
                key={tagIndex}
                className="text-sm px-3 py-1"
                variant={tagIndex === 0 ? "default" : "outline"}
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
      category: "WEB DESIGN & BRANDING",
      tags: ["WEB DESIGN", "BRANDING"],
      gradient: "from-blue-100 to-blue-200",
      src: "/zenpoint-preview.png",
      description: "A mindfulness and wellness platform focusing on inner peace and mental clarity.",
      type: "wellness",
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
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Project Overview</h3>
            <p className="text-gray-600 leading-relaxed">
              ZenPoint Wellness is a comprehensive mindfulness and wellness platform designed to help users find inner peace and mental clarity in today's fast-paced world. The project focused on creating a calming digital experience that reflects the brand's core values of tranquility and mindfulness.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Design Process</h4>
            <p className="text-gray-600 leading-relaxed">
              The design process began with extensive research into wellness psychology and user behavior patterns. We conducted user interviews with meditation practitioners and wellness enthusiasts to understand their digital needs and pain points.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Key Features</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Guided meditation sessions with customizable durations</li>
              <li>Progress tracking and mindfulness streaks</li>
              <li>Calming soundscapes and ambient music</li>
              <li>Community features for shared wellness journeys</li>
              <li>Personalized wellness recommendations</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Results</h4>
            <p className="text-gray-600 leading-relaxed">
              The platform launched to positive reception, with users praising the intuitive interface and calming design aesthetic. User engagement increased by 40% compared to the previous platform, with session completion rates improving significantly.
            </p>
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
      description: "Premium furniture e-commerce platform with sustainable design focus.",
      type: "ecommerce",
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
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Project Overview</h3>
            <p className="text-gray-600 leading-relaxed">
              Timber Elegance represents a new approach to furniture e-commerce, focusing on sustainable, premium wood furniture. The platform combines elegant design with functionality to create an immersive shopping experience that reflects the quality of the products.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Challenges</h4>
            <p className="text-gray-600 leading-relaxed">
              The main challenge was conveying the tactile quality of wood furniture through digital means. We needed to create an experience that would help customers understand the craftsmanship and quality without physical interaction.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Solutions</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>High-resolution 360° product photography</li>
              <li>Detailed material and craftsmanship information</li>
              <li>AR visualization for space planning</li>
              <li>Sustainability certifications and sourcing transparency</li>
              <li>Customer reviews with photo uploads</li>
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
      description: "Modern digital agency website with portfolio showcase.",
      type: "agency",
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
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Project Overview</h3>
            <p className="text-gray-600 leading-relaxed">
              Digital Agency Pro needed a website that would showcase their creative capabilities while maintaining professional credibility. The project focused on creating a balance between creative expression and business functionality.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Design Philosophy</h4>
            <p className="text-gray-600 leading-relaxed">
              The design philosophy centered around "Creative Professionalism" - showcasing the agency's creative capabilities while maintaining the trust and credibility that potential clients expect from a professional service provider.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Key Features</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Interactive portfolio showcase with case studies</li>
              <li>Team member profiles and expertise areas</li>
              <li>Client testimonials and success stories</li>
              <li>Service breakdown with pricing transparency</li>
              <li>Integrated contact and project inquiry system</li>
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
      description: "Secure mobile banking application with modern UX.",
      type: "fintech",
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
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Project Overview</h3>
            <p className="text-gray-600 leading-relaxed">
              A next-generation mobile banking application designed to provide secure, intuitive financial management tools. The project emphasized user security while maintaining a modern, approachable interface design.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xl font-semibold">Security Features</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Biometric authentication and multi-factor security</li>
              <li>End-to-end encryption for all transactions</li>
              <li>Real-time fraud detection and alerts</li>
              <li>Secure document upload and verification</li>
              <li>Privacy-focused data handling</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold">User Experience</h4>
            <p className="text-gray-600 leading-relaxed">
              The UX design focused on simplifying complex financial operations while maintaining transparency and control for users. We conducted extensive usability testing to ensure accessibility across different user demographics.
            </p>
          </div>
        </div>
      )
    },
  ]

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
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
            >
              {projects.map((project, index) => (
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
          </div>
        </div>
      </div>
    </section>
  )
}

