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

      // Track Core Web Vitals
      if ('web-vital' in window) {
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
          getCLS(console.log)
          getFID(console.log)
          getFCP(console.log)
          getLCP(console.log)
          getTTFB(console.log)
        })
      }
    }
  }, [])

  return null
}

// Optional: Add hotjar or other analytics
export function Hotjar() {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Add Hotjar tracking code here if needed
      // (function(h,o,t,j,a,r){
      //   h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
      //   h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6};
      //   a=o.getElementsByTagName('head')[0];
      //   r=o.createElement('script');r.async=1;
      //   r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
      //   a.appendChild(r);
      // })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    }
  }, [])

  return null
}