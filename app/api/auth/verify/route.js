import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getCollection } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request) {
  try {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'No token found' },
        { status: 401 }
      )
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Optional: Verify user still exists in database
    const adminCollection = await getCollection('admins')
    const admin = await adminCollection.findOne(
      { _id: new ObjectId(decoded.id) },
      { projection: { password: 0 } } // Exclude password from result
    )
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { 
        user: {
          id: admin._id,
          email: admin.email,
          name: admin.name || 'Admin'
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Auth verification error:', error)
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}
