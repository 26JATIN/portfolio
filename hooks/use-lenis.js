"use client"

import { useEffect, useRef } from 'react'

export function useLenis() {
  const lenisRef = useRef(null)

  useEffect(() => {
    function update(time) {
      lenisRef.current?.raf(time * 1000)
    }

    const lenis = window.lenis

    if (lenis) {
      lenisRef.current = lenis
      lenis.on('scroll', update)
      return () => lenis.off('scroll', update)
    }
  }, [])

  const scrollTo = (target, options = {}) => {
    if (window.lenis) {
      window.lenis.scrollTo(target, options)
    }
  }

  const scrollToTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.5 })
    }
  }

  const scrollToElement = (element, options = {}) => {
    if (window.lenis && element) {
      window.lenis.scrollTo(element, {
        offset: -100, // Offset for fixed headers
        duration: 1.2,
        ...options
      })
    }
  }

  return {
    scrollTo,
    scrollToTop,
    scrollToElement,
    lenis: lenisRef.current
  }
}
