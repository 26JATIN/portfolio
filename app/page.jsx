import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/skills"
import { SelectedWorkSection } from "@/components/projects"
import { ExperienceSection } from "@/components/experience-section"
import { ContactSection } from "@/components/contact-section"

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
