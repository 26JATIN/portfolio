import Project from '../../../lib/models/Project.js'
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
    
    // Fetch the screenshot
    const screenshotResponse = await fetch(screenshotApiUrl)
    if (!screenshotResponse.ok) {
      throw new Error('Failed to generate screenshot')
    }

    // Upload to Cloudinary
    const screenshotBuffer = await screenshotResponse.arrayBuffer()
    const base64Screenshot = Buffer.from(screenshotBuffer).toString('base64')
    const dataUri = `data:image/png;base64,${base64Screenshot}`

    // Create a unique public_id for the screenshot
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
    
    // Generate screenshot if liveUrl is provided
    if (projectData.liveUrl) {
      try {
        console.log(`Generating screenshot for: ${projectData.title}`)
        const screenshotResult = await generateScreenshot(projectData.liveUrl, projectData.title)
        
        if (screenshotResult.success) {
          projectData.screenshotUrl = screenshotResult.screenshotUrl
          projectData.screenshotPublicId = screenshotResult.screenshotPublicId
          console.log(`Screenshot generated successfully for: ${projectData.title}`)
        } else {
          console.warn(`Screenshot generation failed for ${projectData.title}:`, screenshotResult.error)
          // Continue without screenshot - don't fail project creation
        }
      } catch (screenshotError) {
        console.warn(`Screenshot generation error for ${projectData.title}:`, screenshotError)
        // Continue without screenshot - don't fail project creation
      }
    }
    
    const result = await Project.create(projectData)
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        project: result.project,
        id: result.id,
        screenshotGenerated: !!projectData.screenshotUrl
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
