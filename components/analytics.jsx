'use client'

import { useEffect } from 'react'

export function Analytics() {
  useEffect(() => {
    // Google Analytics 4 (Replace with your GA4 measurement ID)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Load Google Analytics
      const script = document.createElement('script')
      script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID'
      script.async = true
      document.head.appendChild(script)

      window.dataLayer = window.dataLayer || []
      function gtag(...args) {
        window.dataLayer.push(args)
      }
      gtag('js', new Date())
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: document.title,
        page_location: window.location.href,
      })
    }
  }, [])

  return null
}