import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { getCollection } from '@/lib/mongodb'
import Project from '@/lib/models/Project'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    if (action === 'cleanup-screenshots') {
      // Delete only screenshots from Cloudinary
      const deleteResult = await cloudinary.api.delete_resources_by_prefix('portfolio/screenshots/', {
        resource_type: 'image'
      })

      // Also clear screenshot URLs from database
      const collection = await getCollection('projects')
      const dbUpdateResult = await collection.updateMany(
        { screenshotUrl: { $exists: true } },
        { 
          $unset: { 
            screenshotUrl: "",
            screenshotPublicId: "",
            screenshotCloudinaryId: "" 
          } 
        }
      )

      return NextResponse.json({
        success: true,
        message: `Cleaned up ${deleteResult.deleted ? Object.keys(deleteResult.deleted).length : 0} screenshots from Cloudinary and updated ${dbUpdateResult.modifiedCount} projects in database`,
        details: {
          cloudinary: deleteResult,
          database: { modifiedCount: dbUpdateResult.modifiedCount }
        }
      })
    }

    if (action === 'list-resources') {
      // List all resources in portfolio folder for preview
      const resources = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'portfolio/',
        max_results: 500
      })

      return NextResponse.json({
        success: true,
        resources: resources.resources.map(resource => ({
          public_id: resource.public_id,
          secure_url: resource.secure_url,
          format: resource.format,
          bytes: resource.bytes,
          created_at: resource.created_at
        })),
        total_count: resources.total_count
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action parameter. Use: cleanup-screenshots or list-resources'
    }, { status: 400 })

  } catch (error) {
    console.error('Cloudinary cleanup error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to cleanup Cloudinary resources',
      details: error.message
    }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'list-resources'
    
    if (action === 'list-resources') {
      // List all resources in portfolio folder
      const resources = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'portfolio/',
        max_results: 500
      })

      const screenshots = resources.resources.filter(r => r.public_id.includes('portfolio/screenshots/'))
      const otherImages = resources.resources.filter(r => !r.public_id.includes('portfolio/screenshots/'))

      return NextResponse.json({
        success: true,
        summary: {
          total: resources.total_count,
          screenshots: screenshots.length,
          other_images: otherImages.length
        },
        resources: {
          screenshots: screenshots.map(resource => ({
            public_id: resource.public_id,
            secure_url: resource.secure_url,
            format: resource.format,
            bytes: resource.bytes,
            created_at: resource.created_at
          })),
          other_images: otherImages.map(resource => ({
            public_id: resource.public_id,
            secure_url: resource.secure_url,
            format: resource.format,
            bytes: resource.bytes,
            created_at: resource.created_at
          }))
        }
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action parameter'
    }, { status: 400 })

  } catch (error) {
    console.error('Error fetching Cloudinary resources:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch Cloudinary resources',
      details: error.message
    }, { status: 500 })
  }
}