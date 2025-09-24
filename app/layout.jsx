import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import {ThemeProvider} from "../components/theme-provider"
import SmoothScrollProvider from "../components/smooth-scroll-provider"
import { Analytics } from "../components/analytics"
import "./globals.css"

export const metadata = {
  metadataBase: new URL('https://jatingupta.me'),
  title: {
    default: "Jatin Gupta - Product Designer & Full-Stack Developer",
    template: "%s | Jatin Gupta - Product Designer"
  },
  description: "Experienced Product Designer and Full-Stack Developer with 11+ years creating user-centric digital experiences. Specializing in UI/UX design, React development, and modern web applications.",
  keywords: [
    "Product Designer",
    "UI/UX Designer", 
    "Full-Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Frontend Developer",
    "Web Designer",
    "JavaScript Developer",
    "Portfolio",
    "Jatin Gupta"
  ],
  authors: [{ name: "Jatin Gupta" }],
  creator: "Jatin Gupta",
  publisher: "Jatin Gupta",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jatingupta.me',
    title: 'Jatin Gupta - Product Designer & Full-Stack Developer',
    description: 'Experienced Product Designer and Full-Stack Developer with 11+ years creating user-centric digital experiences.',
    siteName: 'Jatin Gupta Portfolio',
    images: [
      {
        url: '/og-image.jpg', // You'll need to add this image
        width: 1200,
        height: 630,
        alt: 'Jatin Gupta - Product Designer & Full-Stack Developer',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jatin Gupta - Product Designer & Full-Stack Developer',
    description: 'Experienced Product Designer and Full-Stack Developer with 11+ years creating user-centric digital experiences.',
    creator: '@jatingupta', // Replace with your Twitter handle
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://jatingupta.me',
  },
  category: 'portfolio',
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jatin Gupta',
    jobTitle: 'Product Designer & Full-Stack Developer',
    description: 'Experienced Product Designer and Full-Stack Developer with 11+ years creating user-centric digital experiences.',
    url: 'https://jatingupta.me',
    sameAs: [
      'https://linkedin.com/in/jatingupta', // Replace with your actual profiles
      'https://github.com/26JATIN',
      'https://twitter.com/jatingupta',
    ],
    knowsAbout: [
      'Product Design',
      'UI/UX Design',
      'React Development',
      'Next.js',
      'JavaScript',
      'Full-Stack Development',
      'Web Design'
    ],
    image: 'https://jatingupta.me/profile-image.jpg',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN' // Replace with your country
    }
  }

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const storageKey = 'cozy-ui-theme';
                let theme = 'dark'; // Default to dark
                try {
                  theme = localStorage.getItem(storageKey) || 'dark';
                } catch (e) {}
                
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.backgroundColor = '#000000';
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
