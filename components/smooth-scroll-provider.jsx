"use client"

import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: 'vertical', // vertical, horizontal
      gestureDirection: 'vertical', // vertical, horizontal, both
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    // Make Lenis available globally
    window.lenis = lenis

    // Add class to html element for CSS targeting
    document.documentElement.classList.add('lenis')

    // Listen for the scroll and update the progress
    lenis.on('scroll', (e) => {
      // You can add custom scroll logic here if needed
      // console.log(e)
    })

    // Use requestAnimationFrame to continuously update the scroll
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Cleanup function
    return () => {
      document.documentElement.classList.remove('lenis')
      window.lenis = null
      lenis.destroy()
    }
  }, [])

  return children
}
