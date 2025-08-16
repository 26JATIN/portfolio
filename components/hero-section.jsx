import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"

export function HeroSection() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-12 sm:pb-16 lg:pb-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left side content */}
          <div className="space-y-8 lg:space-y-12 order-2 lg:order-1 text-center lg:text-left">
            <div className="space-y-2">
              <Badge
                variant="secondary"
                className="inline-flex items-center mx-auto lg:mx-0 w-fit bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 px-4 py-2 text-sm font-semibold border border-emerald-200 dark:border-emerald-800 shadow-sm"
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                AVAILABLE FOR WORK
              </Badge>
            </div>

            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.85] tracking-tight text-foreground">
                Hi, I'm a<br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  product
                </span>
                <br />
                <span className="relative">
                  designer
                  <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-muted-foreground/60">©</span>
                </span>
              </h1>

              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
                I have <span className="font-semibold text-foreground">11 years</span> of experience working on useful and mindful products together with <span className="font-semibold text-foreground">startups</span> and <span className="font-semibold text-foreground">known brands</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button className="group relative overflow-hidden rounded-2xl px-8 py-4 bg-foreground text-background hover:bg-foreground/90 text-lg font-semibold min-h-[56px] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                  <span className="relative z-10">Contact Me</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
                <Button variant="outline" className="rounded-2xl px-8 py-4 text-lg font-semibold min-h-[56px] border-2 hover:bg-muted/50 transition-all duration-300">
                  View Portfolio
                </Button>
              </div>
            </div>
          </div>

          {/* Right side content */}
          <div className="space-y-6 order-1 lg:order-2 w-full max-w-md mx-auto lg:max-w-none">
            {/* Profile Card */}
            <div className="group bg-card border border-border/50 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] backdrop-blur-sm bg-card/80">
              <div className="flex flex-col sm:flex-row">
                {/* Left side of card */}
                <div className="flex-1 p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-xl lg:text-2xl">Cozydiadora</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-6 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                    Jakarta, Indonesia
                  </p>

                  {/* Enhanced mockup preview */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 mb-6 shadow-inner">
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl h-12 lg:h-16 mb-3 shadow-lg"></div>
                    <div className="bg-white dark:bg-gray-700 rounded-xl p-3 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                        <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded flex-1"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded"></div>
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-100 dark:to-gray-200 rounded-lg flex items-center justify-center shadow-lg">
                      <span className="text-sm text-white dark:text-black font-bold">F</span>
                    </div>
                    <span className="text-sm font-bold tracking-wide text-muted-foreground">FRAMER EXPERT</span>
                  </div>

                  <div className="text-blue-600 dark:text-blue-400 font-bold text-xl lg:text-2xl">
                    $150 - $300/HR
                  </div>
                </div>

                {/* Right side - Profile photo */}
                <div className="w-full sm:w-32 md:w-36 lg:w-44 xl:w-52 h-48 sm:h-auto relative overflow-hidden">
                  <img 
                    src="/smiling-designer-headshot.png" 
                    alt="Cozydiadora" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            </div>

            {/* Brands worked with card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
              <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <p className="text-sm mb-4 opacity-95 leading-relaxed font-medium">
                  The most recent brands
                  <br />I happily worked with <span className="text-pink-200">♥</span>
                </p>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <span className="text-sm font-bold tracking-wider">SQUARESPACE</span>
                  <span className="text-sm font-bold tracking-wider">ASANA</span>
                  <span className="text-sm font-bold tracking-wider">ATTEN</span>
                </div>
              </div>
            </div>

            {/* Social media icons */}
            <div className="flex gap-4 justify-center lg:justify-start">
              <a href="#" className="group w-14 h-14 bg-gray-900 dark:bg-gray-100 rounded-2xl flex items-center justify-center hover:scale-110 hover:rotate-6 transition-all duration-300 shadow-lg hover:shadow-xl">
                <svg className="w-7 h-7 text-white dark:text-black group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="group w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center hover:scale-110 hover:rotate-6 transition-all duration-300 shadow-lg hover:shadow-xl">
                <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="group w-14 h-14 bg-blue-700 rounded-2xl flex items-center justify-center hover:scale-110 hover:rotate-6 transition-all duration-300 shadow-lg hover:shadow-xl">
                <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
