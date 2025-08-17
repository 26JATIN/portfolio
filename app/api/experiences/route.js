import Experience from '../../../lib/models/Experience.js'
import { NextResponse } from 'next/server'

// GET - Fetch all experiences or published experiences only
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    
    let result
    if (published === 'true') {
      result = await Experience.getPublished()
    } else {
      result = await Experience.getAll()
    }
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        experiences: result.experiences 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

// POST - Create new experience
export async function POST(request) {
  try {
    const experienceData = await request.json()
    
    // Validate required fields
    const requiredFields = ['company', 'role', 'period']
    for (const field of requiredFields) {
      if (!experienceData[field]) {
        return NextResponse.json({
          success: false,
          error: `${field} is required`
        }, { status: 400 })
      }
    }
    
    const result = await Experience.create(experienceData)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        experience: result.experience,
        id: result.id
      }, { status: 201 })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 })
    }
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// PUT - Update order of experiences
export async function PUT(request) {
  try {
    const { orderUpdates } = await request.json()
    
    if (!Array.isArray(orderUpdates)) {
      return NextResponse.json({
        success: false,
        error: 'orderUpdates must be an array'
      }, { status: 400 })
    }
    
    const result = await Experience.updateOrder(orderUpdates)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Experience order updated successfully'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 })
    }
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
