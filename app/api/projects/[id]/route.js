import Project from '../../../../lib/models/Project.js'
import { NextResponse } from 'next/server'
import { encode } from 'qss'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Helper function to generate screenshot
async function generateScreenshot(url, title) {
  try {
    const params = encode({
      url: url,
      screenshot: true,
      meta: false,
      embed: 'screenshot.url',
      colorScheme: 'light',
      'viewport.isMobile': false,
      'viewport.deviceScaleFactor': 2,
      'viewport.width': 1200,
      'viewport.height': 800,
      'screenshot.type': 'png',
      'screenshot.quality': 85,
      waitFor: 20000, // Wait 20 seconds for page to fully load
      timeout: 60000
    })

    const screenshotApiUrl = `https://api.microlink.io/?${params}`
    
    const screenshotResponse = await fetch(screenshotApiUrl)
    if (!screenshotResponse.ok) {
      throw new Error('Failed to generate screenshot')
    }

    const screenshotBuffer = await screenshotResponse.arrayBuffer()
    const base64Screenshot = Buffer.from(screenshotBuffer).toString('base64')
    const dataUri = `data:image/png;base64,${base64Screenshot}`

    const publicId = `portfolio/screenshots/${title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${Date.now()}`
    
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      public_id: publicId,
      folder: 'portfolio/screenshots',
      resource_type: 'image',
      format: 'webp',
      quality: 'auto',
      fetch_format: 'auto'
    })

    return {
      success: true,
      screenshotUrl: uploadResult.secure_url,
      screenshotPublicId: uploadResult.public_id
    }
  } catch (error) {
    console.error('Screenshot generation error:', error)
    return { success: false, error: error.message }
  }
}

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
    const { id } = await params
    const updateData = await request.json()
    
    // Get current project to check if liveUrl changed and for cleanup
    const currentProject = await Project.getById(id)
    if (!currentProject.success || !currentProject.project) {
      return NextResponse.json({ 
        success: false, 
        error: 'Project not found' 
      }, { status: 404 })
    }
    
    const project = currentProject.project
    const liveUrlChanged = updateData.liveUrl && updateData.liveUrl !== project.liveUrl
    
    // Generate new screenshot if liveUrl is provided and changed
    if (liveUrlChanged || (updateData.liveUrl && !project.screenshotUrl)) {
      try {
        console.log(`Generating screenshot for updated project: ${updateData.title || project.title}`)
        
        // Delete old screenshot if exists
        if (project.screenshotPublicId) {
          try {
            await cloudinary.uploader.destroy(project.screenshotPublicId)
            console.log(`Deleted old screenshot: ${project.screenshotPublicId}`)
          } catch (deleteError) {
            console.warn('Failed to delete old screenshot:', deleteError)
          }
        }
        
        const screenshotResult = await generateScreenshot(
          updateData.liveUrl, 
          updateData.title || project.title
        )
        
        if (screenshotResult.success) {
          updateData.screenshotUrl = screenshotResult.screenshotUrl
          updateData.screenshotPublicId = screenshotResult.screenshotPublicId
          console.log(`Screenshot generated successfully for: ${updateData.title || project.title}`)
        } else {
          console.warn(`Screenshot generation failed:`, screenshotResult.error)
        }
      } catch (screenshotError) {
        console.warn(`Screenshot generation error:`, screenshotError)
      }
    }
    
    // If liveUrl was removed, clean up screenshot
    if (updateData.hasOwnProperty('liveUrl') && !updateData.liveUrl && project.screenshotPublicId) {
      try {
        await cloudinary.uploader.destroy(project.screenshotPublicId)
        updateData.screenshotUrl = null
        updateData.screenshotPublicId = null
        console.log(`Cleaned up screenshot for project without liveUrl`)
      } catch (deleteError) {
        console.warn('Failed to clean up screenshot:', deleteError)
      }
    }
    
    const result = await Project.update(id, updateData)
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Project updated successfully',
        screenshotGenerated: !!(updateData.screenshotUrl)
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

// DELETE - Delete project and cleanup screenshots
export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    
    // Get project first to access screenshot info for cleanup
    const projectResult = await Project.getById(id)
    if (projectResult.success && projectResult.project) {
      const project = projectResult.project
      
      // Delete screenshot from Cloudinary if it exists
      if (project.screenshotCloudinaryId || project.screenshotPublicId) {
        try {
          const cloudinaryId = project.screenshotCloudinaryId || project.screenshotPublicId
          await cloudinary.uploader.destroy(cloudinaryId)
          console.log(`Deleted screenshot from Cloudinary: ${cloudinaryId}`)
        } catch (deleteError) {
          console.warn('Failed to delete screenshot from Cloudinary:', deleteError)
          // Continue with project deletion even if screenshot cleanup fails
        }
      }
    }
    
    // Delete the project from database
    const result = await Project.delete(id)
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Project and associated screenshots deleted successfully' 
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
