export function generateStructuredData(type, data) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  }
  
  return JSON.stringify(baseData)
}

export function generateProjectStructuredData(project) {
  return generateStructuredData('CreativeWork', {
    name: project.title,
    description: project.description,
    creator: {
      '@type': 'Person',
      name: 'Jatin Gupta'
    },
    dateCreated: project.date,
    url: project.url,
    image: project.image,
    keywords: project.technologies?.join(', '),
    genre: 'Web Development'
  })
}

export function generateExperienceStructuredData(experience) {
  return generateStructuredData('WorkRole', {
    roleName: experience.position,
    startDate: experience.startDate,
    endDate: experience.endDate || new Date().toISOString(),
    worksFor: {
      '@type': 'Organization',
      name: experience.company
    },
    description: experience.description,
    skills: experience.technologies
  })
}

export const defaultSEOConfig = {
  baseUrl: 'https://jatingupta.me',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    site_name: 'Jatin Gupta Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@JatinGupta93145',
  },
}