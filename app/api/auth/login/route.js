import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getCollection } from '@/lib/mongodb'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    console.log('Login attempt for email:', email)

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Connect to MongoDB and get admin collection
    console.log('Connecting to MongoDB...')
    const adminCollection = await getCollection('admins')
    console.log('Connected to MongoDB successfully')
    
    // Find admin user
    console.log('Looking for admin with email:', email)
    const admin = await adminCollection.findOne({ email })
    console.log('Admin found:', admin ? 'Yes' : 'No')
    
    if (!admin) {
      console.log('Admin not found in database')
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check password
    console.log('Checking password...')
    const isValidPassword = await bcrypt.compare(password, admin.password)
    console.log('Password valid:', isValidPassword)
    
    if (!isValidPassword) {
      console.log('Invalid password provided')
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate JWT token
    console.log('Generating JWT token...')
    const token = jwt.sign(
      { 
        id: admin._id,
        email: admin.email,
        role: 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Create response
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: admin._id,
          email: admin.email,
          name: admin.name || 'Admin'
        }
      },
      { status: 200 }
    )

    // Set HTTP-only cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400, // 24 hours
      path: '/'
    })

    console.log('Login successful for:', email)
    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}
