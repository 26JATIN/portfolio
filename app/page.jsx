import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero"
import { ServicesSection } from "@/components/skills"
import { SelectedWorkSection } from "@/components/projects"
import { ExperienceSection } from "@/components/experience"
import { ContactSection } from "@/components/contact"

export const metadata = {
  title: "Jatin Gupta - Product Designer & Full-Stack Developer Portfolio",
  description: "Welcome to Jatin Gupta's portfolio. Discover my work as a Product Designer and Full-Stack Developer with 11+ years of experience in creating exceptional digital experiences.",
  openGraph: {
    title: "Jatin Gupta - Product Designer & Full-Stack Developer Portfolio",
    description: "Welcome to Jatin Gupta's portfolio. Discover my work as a Product Designer and Full-Stack Developer with 11+ years of experience in creating exceptional digital experiences.",
  }
}

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Jatin Gupta Portfolio',
    description: 'Portfolio website showcasing the work of Jatin Gupta, Product Designer and Full-Stack Developer',
    url: 'https://jatingupta.me',
    mainEntity: {
      '@type': 'Person',
      name: 'Jatin Gupta',
      jobTitle: 'Product Designer & Full-Stack Developer',
      hasOccupation: {
        '@type': 'Occupation',
        name: 'Product Designer',
        occupationLocation: {
          '@type': 'Country',
          name: 'India'
        }
      }
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background">
        <Header />
        <main role="main">
          <HeroSection />
          <ServicesSection />
          <SelectedWorkSection />
          <ExperienceSection />
          <ContactSection />
        </main>
      </div>
    </>
  )
}
