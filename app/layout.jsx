import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import {ThemeProvider} from "../components/theme-provider"
import SmoothScrollProvider from "../components/smooth-scroll-provider"
import "./globals.css"

export const metadata = {
  title: "Cozydiadora - Product Designer",
  description: "Product Designer with 11 years of experience working on useful and mindful products",
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
