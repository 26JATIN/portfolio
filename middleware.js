import { NextResponse } from 'next/server'

export function middleware(request) {
  console.log('Middleware called for:', request.nextUrl.pathname)
  
  // Only protect admin routes (except login page and API routes)
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/api/') &&
      request.nextUrl.pathname !== '/admin') {
    
    console.log('Checking authentication for protected route:', request.nextUrl.pathname)
    const token = request.cookies.get('admin-token')?.value
    console.log('Token found:', token ? 'Yes' : 'No')

    if (!token) {
      console.log('No token found, redirecting to /admin')
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    // Simple check - just verify it's a JWT format (3 parts separated by dots)
    const jwtParts = token.split('.')
    if (jwtParts.length !== 3) {
      console.log('Invalid JWT format, redirecting to /admin')
      const response = NextResponse.redirect(new URL('/admin', request.url))
      response.cookies.delete('admin-token')
      return response
    }

    console.log('Token format valid, allowing access')
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
}
