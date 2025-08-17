import Project from '../../../../lib/models/Project.js'
import { NextResponse } from 'next/server'

// GET - Fetch single project by ID
export async function GET(request, { params }) {
  try {
    const { id } = params
    const result = await Project.getById(id)
    
    if (result.success) {
      if (result.project) {
        return NextResponse.json({ 
          success: true, 
          project: result.project 
        })
      } else {
        return NextResponse.json({ 
          success: false, 
          error: 'Project not found' 
        }, { status: 404 })
      }
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

// PUT - Update project
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const updateData = await request.json()
    
    const result = await Project.update(id, updateData)
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Project updated successfully' 
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

// DELETE - Delete project
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const result = await Project.delete(id)
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Project deleted successfully' 
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
