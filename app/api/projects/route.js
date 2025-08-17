import Project from '../../../lib/models/Project.js'
import { NextResponse } from 'next/server'

// GET - Fetch all projects or published projects only
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    
    let result
    if (published === 'true') {
      result = await Project.getPublished()
    } else {
      result = await Project.getAll()
    }
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        projects: result.projects 
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

// POST - Create new project
export async function POST(request) {
  try {
    const projectData = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'year', 'category']
    for (const field of requiredFields) {
      if (!projectData[field]) {
        return NextResponse.json({
          success: false,
          error: `${field} is required`
        }, { status: 400 })
      }
    }
    
    const result = await Project.create(projectData)
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        project: result.project,
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
