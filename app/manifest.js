export default function manifest() {
  return {
    name: 'Jatin Gupta - Product Designer & Full-Stack Developer',
    short_name: 'Jatin Gupta',
    description: 'Portfolio of Jatin Gupta - Product Designer and Full-Stack Developer',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/favicon-512x512.png', 
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['portfolio', 'design', 'development'],
    lang: 'en',
    orientation: 'portrait-primary',
  }
}