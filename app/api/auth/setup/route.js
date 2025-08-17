import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getCollection } from '@/lib/mongodb'

export async function POST() {
  try {
    console.log('Admin setup started...')
    console.log('Environment check - NODE_ENV:', process.env.NODE_ENV)
    console.log('Admin email from env:', process.env.ADMIN_EMAIL)
    console.log('Admin password from env:', process.env.ADMIN_PASSWORD ? 'Set' : 'Not set')

    // Check if this is development environment
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Setup only available in development' },
        { status: 403 }
      )
    }

    console.log('Connecting to MongoDB...')
    const adminCollection = await getCollection('admins')
    console.log('Connected to MongoDB successfully')
    
    // Check if admin already exists
    console.log('Checking if admin already exists...')
    const existingAdmin = await adminCollection.findOne({ 
      email: process.env.ADMIN_EMAIL 
    })
    
    if (existingAdmin) {
      console.log('Admin user already exists')
      return NextResponse.json(
        { message: 'Admin user already exists', email: process.env.ADMIN_EMAIL },
        { status: 200 }
      )
    }

    // Hash the password
    console.log('Hashing password...')
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, saltRounds)
    console.log('Password hashed successfully')
    
    // Create admin user
    const adminUser = {
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    console.log('Creating admin user...')
    const result = await adminCollection.insertOne(adminUser)
    console.log('Admin user created with ID:', result.insertedId)
    
    return NextResponse.json(
      { 
        message: 'Admin user created successfully',
        adminId: result.insertedId,
        email: process.env.ADMIN_EMAIL
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: 'Failed to setup admin user: ' + error.message },
      { status: 500 }
    )
  }
}
