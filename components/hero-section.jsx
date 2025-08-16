import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"

export function HeroSection() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-6 sm:pb-8 lg:pb-12 min-h-[80vh] sm:min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center justify-items-center">
          {/* Left side content */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10 order-2 lg:order-1 text-center lg:text-left">
            <Badge
              variant="secondary"
              className="hidden lg:flex mx-auto lg:mx-0 w-fit bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium"
            >
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-cyan-500 rounded-full mr-2"></div>
              AVAILABLE FOR WORK
            </Badge>

            <div className="space-y-6 sm:space-y-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold leading-[0.85] sm:leading-[0.9] tracking-tight text-foreground">
                Hi, I'm a<br />
                product
                <br />
                designer<span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">©</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed">
                I have 11 years of experience working on useful and mindful products together with startups and known
                brands
              </p>

              <div className="hidden lg:flex justify-center lg:justify-start">
                <Button className="rounded-full px-6 sm:px-8 py-2.5 sm:py-3 bg-foreground text-background hover:bg-foreground/90 text-sm sm:text-base font-medium min-h-[44px] sm:min-h-[48px]">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>

          {/* Right side content */}
          <div className="hidden lg:block space-y-4 sm:space-y-6 order-1 lg:order-2 w-full max-w-sm mx-auto">
            {/* Profile Card */}
            <div className="bg-card border border-border rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col sm:flex-row">
                {/* Left side of card */}
                <div className="flex-1 p-4 sm:p-5 lg:p-6">
                  <h3 className="font-semibold text-base sm:text-lg lg:text-xl mb-1">Cozydiadora</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 lg:mb-6">Jakarta, Indonesia</p>

                  {/* Mockup preview */}
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                    <div className="bg-green-200 dark:bg-green-800 rounded h-10 sm:h-12 lg:h-16 mb-2"></div>
                    <div className="bg-white dark:bg-gray-700 rounded p-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 sm:w-4 h-3 sm:h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <div className="h-1.5 sm:h-2 bg-gray-300 dark:bg-gray-600 rounded flex-1"></div>
                      </div>
                      <div className="h-1 bg-gray-200 dark:bg-gray-600 rounded mb-1"></div>
                      <div className="h-1 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <div className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 bg-gray-800 dark:bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs text-white dark:text-black font-bold">F</span>
                    </div>
                    <span className="text-xs sm:text-sm font-medium">FRAMER EXPERT</span>
                  </div>

                  <div className="text-blue-600 dark:text-blue-400 font-semibold text-sm sm:text-base lg:text-lg">
                    $150 - $300/HR
                  </div>
                </div>

                {/* Right side - Profile photo */}
                <div className="w-full sm:w-28 md:w-32 lg:w-40 xl:w-48 h-40 sm:h-auto">
                  <img src="/smiling-designer-headshot.png" alt="Cozydiadora" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Brands worked with card */}
            <div className="bg-gradient-to-r from-purple-400 to-blue-500 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 text-white">
              <p className="text-xs sm:text-sm mb-3 sm:mb-4 opacity-90 leading-relaxed">
                The most recent brands
                <br />I happily worked with {"<3"}
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-6 opacity-80">
                <span className="text-xs sm:text-sm font-medium">SQUARESPACE</span>
                <span className="text-xs sm:text-sm font-medium">asana</span>
                <span className="text-xs sm:text-sm font-medium">atten</span>
              </div>
            </div>

            {/* Social media icons grid */}
            <div className="hidden md:grid grid-cols-3 gap-2 sm:gap-3">
              <div className="w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 bg-orange-500 rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-200 cursor-pointer">
                <span className="text-white font-bold text-sm sm:text-base">F</span>
              </div>
              <div className="w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 bg-blue-600 rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-200 cursor-pointer">
                <span className="text-white font-bold text-sm sm:text-base">in</span>
              </div>
              <div className="w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 bg-pink-500 rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-200 cursor-pointer">
                <span className="text-white font-bold text-sm sm:text-base">D</span>
              </div>
              <div className="w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 bg-red-500 rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-200 cursor-pointer">
                <span className="text-white font-bold text-sm sm:text-base">P</span>
              </div>
              <div className="w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 bg-blue-400 rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-200 cursor-pointer">
                <span className="text-white font-bold text-sm sm:text-base">Be</span>
              </div>
              <div className="w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 bg-black dark:bg-white rounded-lg flex items-center justify-center hover:scale-105 transition-transform duration-200 cursor-pointer">
                <span className="text-white dark:text-black font-bold text-sm sm:text-base">X</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
