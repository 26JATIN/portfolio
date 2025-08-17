import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export function verifyAdmin(request) {
  const token = request.cookies.get('admin-token')?.value

  if (!token) {
    return {
      error: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return { user: decoded }
  } catch (error) {
    return {
      error: NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  }
}

export async function verifyAdminWithDb(request) {
  const token = request.cookies.get('admin-token')?.value

  if (!token) {
    return {
      error: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Verify user exists in database
    const adminCollection = await getCollection('admins')
    const admin = await adminCollection.findOne(
      { _id: new ObjectId(decoded.id) },
      { projection: { password: 0 } }
    )
    
    if (!admin) {
      return {
        error: NextResponse.json(
          { error: 'Admin not found' },
          { status: 401 }
        )
      }
    }
    
    return { user: { ...decoded, dbUser: admin } }
  } catch (error) {
    return {
      error: NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  }
}

export function withAuth(handler, verifyDb = false) {
  return async function(request, context) {
    const auth = verifyDb ? 
      await verifyAdminWithDb(request) : 
      verifyAdmin(request)
    
    if (auth.error) {
      return auth.error
    }
    
    // Add user to request context
    request.user = auth.user
    return handler(request, context)
  }
}
