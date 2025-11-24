import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero"
import { ServicesSection } from "@/components/skills"
import { SelectedWorkSection } from "@/components/projects"
import { ExperienceSection } from "@/components/experience"
import { ContactSection } from "@/components/contact"

export const metadata = {
  title: "Jatin Gupta - Product Designer & Full-Stack Developer Portfolio",
  description: "Welcome to Jatin Gupta's portfolio. Discover my work as a Product Designer and Full-Stack Developer with 2+ years of experience in creating exceptional digital experiences.",
  openGraph: {
    title: "Jatin Gupta - Product Designer & Full-Stack Developer Portfolio",
    description: "Welcome to Jatin Gupta's portfolio. Discover my work as a Product Designer and Full-Stack Developer with 2+ years of experience in creating exceptional digital experiences.",
  }
}

export default function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Jatin Gupta Portfolio',
    description: 'Portfolio website showcasing the work of Jatin Gupta, Full Stack Developer and Product Designer',
    url: 'https://jatingupta.me',
    mainEntity: {
      '@type': 'Person',
      name: 'Jatin Gupta',
      jobTitle: 'Full-Stack Developer & Product Designer',
      description: 'Full Stack Developer and Product Designer specializing in React, Next.js, and modern web technologies.',
      hasOccupation: {
        '@type': 'Occupation',
        name: 'Full-Stack Developer',
        occupationLocation: {
          '@type': 'Country',
          name: 'India'
        }
      },
      knowsAbout: ['Full Stack Development', 'Product Design', 'React', 'Next.js', 'SEO', 'Web Performance']
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
