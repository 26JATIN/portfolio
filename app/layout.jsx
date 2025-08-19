import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import {ThemeProvider} from "../components/theme-provider"
import SmoothScrollProvider from "../components/smooth-scroll-provider"
import "./globals.css"

export const metadata = {
  title: "Jatin Gupta - Product Designer",
  description: "Product Designer with 11 years of experience working on useful and mindful products",
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
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
      </body>
    </html>
  )
}
