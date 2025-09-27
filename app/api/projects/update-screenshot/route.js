import { NextResponse } from 'next/server'
import Project from '../../../../lib/models/Project.js'
import { encode } from 'qss'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request) {
  try {
    const { projectId, forceRegenerate = false } = await request.json()
    
    // Get project data
    const projectResult = await Project.getById(projectId)
    if (!projectResult.success || !projectResult.project) {
      return NextResponse.json({
        success: false,
        error: 'Project not found'
      }, { status: 404 })
    }

    const project = projectResult.project
    
    // Check if we need to generate a screenshot
    if (!project.liveUrl) {
      return NextResponse.json({
        success: false,
        error: 'Project has no live URL'
      }, { status: 400 })
    }

    // If screenshot already exists and we're not forcing regeneration, return existing
    if (project.screenshotUrl && !forceRegenerate) {
      return NextResponse.json({
        success: true,
        screenshotUrl: project.screenshotUrl,
        message: 'Using existing screenshot'
      })
    }

    // Add cache-busting timestamp to the target URL
    const timestampedUrl = `${project.liveUrl}${project.liveUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`
    
    // Generate new screenshot using Microlink API with extended wait time
    const params = encode({
      url: timestampedUrl,
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
      waitFor: 30000, // Increased to 30 seconds for complete loading
      waitUntil: ['load', 'networkidle0'], // Wait for load event and network idle
      timeout: 90000, // Increased timeout to 90 seconds
      scroll: true, // Trigger scroll to load lazy content
      animations: false // Disable animations for consistent screenshots
    })

    const screenshotApiUrl = `https://api.microlink.io/?${params}`
    
    console.log(`Starting screenshot generation for ${project.title} at ${new Date().toISOString()}`)
    console.log(`Target URL: ${project.liveUrl}`)
    console.log(`Screenshot API URL: ${screenshotApiUrl}`)
    
    // Fetch the screenshot
    const startTime = Date.now()
    const screenshotResponse = await fetch(screenshotApiUrl)
    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000
    
    console.log(`Screenshot API completed in ${duration} seconds`)
    
    if (!screenshotResponse.ok) {
      const errorText = await screenshotResponse.text()
      console.error(`Microlink API Error (${screenshotResponse.status}):`, errorText)
      throw new Error(`Screenshot API failed with status ${screenshotResponse.status}: ${errorText}`)
    }

    // Add additional delay to ensure screenshot is fully processed
    if (duration < 25) {
      const additionalDelay = 30 - duration
      console.log(`Screenshot completed too quickly (${duration}s), adding ${additionalDelay.toFixed(1)}s additional delay...`)
      await new Promise(resolve => setTimeout(resolve, additionalDelay * 1000))
    }

    // Upload to Cloudinary
    const screenshotBuffer = await screenshotResponse.arrayBuffer()
    const base64Screenshot = Buffer.from(screenshotBuffer).toString('base64')
    const dataUri = `data:image/png;base64,${base64Screenshot}`

    // Create a unique public_id for the screenshot
    const publicId = `portfolio/screenshots/${project.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${Date.now()}`
    
    // Delete old screenshot if exists
    const oldScreenshotId = project.screenshotPublicId || project.screenshotCloudinaryId
    if (oldScreenshotId) {
      try {
        await cloudinary.uploader.destroy(oldScreenshotId)
        console.log(`Deleted old screenshot: ${oldScreenshotId}`)
      } catch (deleteError) {
        console.warn('Failed to delete old screenshot:', deleteError)
      }
    }
    
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      public_id: publicId,
      folder: 'portfolio/screenshots',
      resource_type: 'image',
      format: 'webp', // Convert to WebP for better optimization
      quality: 'auto',
      fetch_format: 'auto'
    })

    // Update project with new screenshot URL and public ID
    const updateResult = await Project.update(projectId, {
      screenshotUrl: uploadResult.secure_url,
      screenshotPublicId: uploadResult.public_id,
      screenshotCloudinaryId: uploadResult.public_id // For compatibility
    })

    if (!updateResult.success) {
      throw new Error('Failed to update project with screenshot URL')
    }

    return NextResponse.json({
      success: true,
      screenshotUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      message: `Screenshot generated and saved for project: ${project.title}`
    })

  } catch (error) {
    console.error('Update screenshot error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update project screenshot',
      details: error.message
    }, { status: 500 })
  }
}

// PATCH - Regenerate screenshots for all projects with live URLs (in parallel)
export async function PATCH() {
  try {
    const projectsResult = await Project.getAll()
    if (!projectsResult.success) {
      throw new Error('Failed to fetch projects')
    }

    const projects = projectsResult.projects.filter(project => project.liveUrl)
    
    if (projects.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No projects with live URLs found.',
        summary: {
          total: 0,
          successful: 0,
          errors: 0,
          skipped: 0
        },
        details: []
      })
    }

    console.log(`Starting parallel screenshot generation for ${projects.length} projects...`)

    // Create promises for all screenshot generations
    const screenshotPromises = projects.map(async (project, index) => {
      try {
        // Add a small staggered delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, index * 2000)) // 2 second stagger
        
        // Generate screenshot
        // Add cache-busting timestamp to the target URL
        const timestampedUrl = `${project.liveUrl}${project.liveUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`
        
        const params = encode({
          url: timestampedUrl,
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
          waitFor: 30000, // Increased to 30 seconds for complete loading
          waitUntil: ['load', 'networkidle0'], // Wait for load event and network idle
          timeout: 90000, // Increased timeout to 90 seconds
          scroll: true, // Trigger scroll to load lazy content
          animations: false // Disable animations for consistent screenshots
        })

        const screenshotApiUrl = `https://api.microlink.io/?${params}`
        
        console.log(`Starting bulk screenshot for ${project.title} at ${new Date().toISOString()}`)
        
        // Fetch the screenshot
        const startTime = Date.now()
        const screenshotResponse = await fetch(screenshotApiUrl)
        const endTime = Date.now()
        const duration = (endTime - startTime) / 1000
        
        console.log(`Bulk screenshot API completed in ${duration} seconds for ${project.title}`)
        
        if (!screenshotResponse.ok) {
          const errorText = await screenshotResponse.text()
          console.error(`Bulk Microlink API Error (${screenshotResponse.status}):`, errorText)
          throw new Error(`Screenshot API failed with status ${screenshotResponse.status}: ${errorText}`)
        }

        // Add additional delay to ensure screenshot is fully processed
        if (duration < 25) {
          const additionalDelay = 30 - duration
          console.log(`Bulk screenshot completed too quickly (${duration}s), adding ${additionalDelay.toFixed(1)}s additional delay...`)
          await new Promise(resolve => setTimeout(resolve, additionalDelay * 1000))
        }

        // Upload to Cloudinary
        const screenshotBuffer = await screenshotResponse.arrayBuffer()
        const base64Screenshot = Buffer.from(screenshotBuffer).toString('base64')
        const dataUri = `data:image/png;base64,${base64Screenshot}`

        const publicId = `portfolio/screenshots/${project.title ? project.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() : 'website'}-${Date.now()}`
        
        // Delete old screenshot if exists
        const oldScreenshotId = project.screenshotPublicId || project.screenshotCloudinaryId
        if (oldScreenshotId) {
          try {
            await cloudinary.uploader.destroy(oldScreenshotId)
            console.log(`Deleted old screenshot: ${oldScreenshotId}`)
          } catch (deleteError) {
            console.warn('Failed to delete old screenshot:', deleteError)
          }
        }
        
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          public_id: publicId,
          folder: 'portfolio/screenshots',
          resource_type: 'image',
          format: 'webp',
          quality: 'auto',
          fetch_format: 'auto'
        })

        // Update project with new screenshot URL
        const updateResult = await Project.update(project._id, {
          screenshotUrl: uploadResult.secure_url,
          screenshotPublicId: uploadResult.public_id,
          screenshotCloudinaryId: uploadResult.public_id // For compatibility
        })

        if (updateResult.success) {
          return {
            id: project._id,
            title: project.title,
            status: 'success',
            screenshotUrl: uploadResult.secure_url,
            cloudinaryId: uploadResult.public_id
          }
        } else {
          throw new Error('Failed to update database')
        }

      } catch (error) {
        return {
          id: project._id,
          title: project.title,
          status: 'error',
          error: error.message
        }
      }
    })

    // Wait for all screenshots to complete
    const results = await Promise.all(screenshotPromises)
    
    // Count results
    const successCount = results.filter(r => r.status === 'success').length
    const errorCount = results.filter(r => r.status === 'error').length

    console.log(`Screenshot generation completed: ${successCount} successful, ${errorCount} errors`)

    return NextResponse.json({
      success: true,
      message: `Processed ${projects.length} projects simultaneously. ${successCount} successful, ${errorCount} errors.`,
      summary: {
        total: projects.length,
        successful: successCount,
        errors: errorCount,
        skipped: 0
      },
      details: results
    })

  } catch (error) {
    console.error('Bulk screenshot generation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to regenerate screenshots',
      details: error.message
    }, { status: 500 })
  }
}