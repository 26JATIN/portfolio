import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth'

// Example protected API route
async function handler(request) {
  // request.user contains the authenticated user info
  return NextResponse.json(
    { 
      message: 'This is a protected route',
      user: {
        id: request.user.id,
        email: request.user.email,
        role: request.user.role
      }
    },
    { status: 200 }
  )
}

// Export the protected route
export const GET = withAuth(handler)
