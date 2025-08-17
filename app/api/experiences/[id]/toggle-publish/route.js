import Experience from '../../../../../lib/models/Experience.js'
import { NextResponse } from 'next/server'

// POST - Toggle publish status
export async function POST(request, { params }) {
  try {
    const { id } = params
    const result = await Experience.togglePublish(id)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        isPublished: result.isPublished,
        message: `Experience ${result.isPublished ? 'published' : 'unpublished'} successfully`
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
