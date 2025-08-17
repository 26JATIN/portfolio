import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero"
import { ServicesSection } from "@/components/skills"
import { SelectedWorkSection } from "@/components/projects"
import { ExperienceSection } from "@/components/experience"
import { ContactSection } from "@/components/contact"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <SelectedWorkSection />
        <ExperienceSection />
        <ContactSection />
      </main>
    </div>
  )
}
