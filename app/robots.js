export default function robots() {
  const baseUrl = 'https://jatingupta.me'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/private/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}