import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: '404 - Page Not Found | Jatin Gupta',
  description: 'The page you are looking for could not be found. Return to Jatin Gupta\'s portfolio homepage.',
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/">
              Return Home
            </Link>
          </Button>
          
          <div className="text-sm text-muted-foreground">
            <p>Popular sections:</p>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <Link href="/#projects" className="hover:text-foreground transition-colors">
                Projects
              </Link>
              <Link href="/#experience" className="hover:text-foreground transition-colors">
                Experience
              </Link>
              <Link href="/#contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}