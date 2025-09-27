import Experience from '../../../../lib/models/Experience.js'
import { NextResponse } from 'next/server'

// GET - Fetch experience by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const result = await Experience.getById(id)
    
    if (result.success) {
      if (!result.experience) {
        return NextResponse.json({
          success: false,
          error: 'Experience not found'
        }, { status: 404 })
      }
      
      return NextResponse.json({
        success: true,
        experience: result.experience
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

// PUT - Update experience
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const updateData = await request.json()
    
    const result = await Experience.update(id, updateData)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        experience: result.experience
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

// DELETE - Delete experience
export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const result = await Experience.delete(id)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Experience deleted successfully'
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
