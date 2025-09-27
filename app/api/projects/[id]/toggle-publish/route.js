import Project from '../../../../../lib/models/Project.js'
import { NextResponse } from 'next/server'

// POST - Toggle publish status
export async function POST(request, { params }) {
  try {
    const { id } = await params
    const result = await Project.togglePublish(id)
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        isPublished: result.isPublished,
        message: `Project ${result.isPublished ? 'published' : 'unpublished'} successfully` 
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
