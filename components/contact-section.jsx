export function ContactSection() {
  const socialPlatforms = [
    { name: "FOLLOW ME!", emoji: "👀😊" },
    { name: "INSTAGRAM" },
    { name: "DRIBBBLE" },
    { name: "BEHANCE" },
    { name: "LINKEDIN" },
  ]

  return (
    <section className="bg-background text-foreground flex flex-col justify-between px-4 sm:px-6 lg:px-8 xl:px-16 py-8 sm:py-12 lg:py-16 min-h-[80vh] sm:min-h-screen">
      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left side - Title and Email */}
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Let's
                <br />
                connect
                <br />
                and chat
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
                <span className="text-muted-foreground font-medium text-sm sm:text-base">HELLO@COZY.COM</span>
                <button className="w-8 sm:w-10 h-8 sm:h-10 bg-foreground rounded-full flex items-center justify-center text-background hover:opacity-80 transition-opacity">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="sm:w-4 sm:h-4"
                  >
                    <path
                      d="M7 17L17 7M17 7H7M17 7V17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right side - Social platforms */}
            <div className="bg-teal-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 flex flex-wrap gap-3 sm:gap-4 justify-center items-center min-h-[300px] sm:min-h-[400px]">
              {socialPlatforms.map((platform, index) => (
                <div
                  key={index}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 sm:px-6 py-2 sm:py-3 text-white font-medium flex items-center space-x-2 text-sm sm:text-base"
                >
                  <span>{platform.name}</span>
                  {platform.emoji && <span className="text-base sm:text-lg">{platform.emoji}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between pt-8 sm:pt-12 lg:pt-16 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <div className="w-6 sm:w-8 h-6 sm:h-8 bg-foreground rounded-full flex items-center justify-center text-background font-bold text-sm sm:text-base">
            C
          </div>
          <span className="text-muted-foreground font-medium text-sm sm:text-base">Jatin Gupta</span>
        </div>
        <span className="text-muted-foreground text-sm sm:text-base">©2024</span>
        <button className="bg-muted text-muted-foreground px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium hover:opacity-80 transition-opacity text-sm sm:text-base">
          Book a call
        </button>
      </footer>
    </section>
  )
}
