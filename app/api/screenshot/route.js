import { NextResponse } from 'next/server'
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
    const { url, title } = await request.json()
    
    if (!url) {
      return NextResponse.json({
        success: false,
        error: 'URL is required'
      }, { status: 400 })
    }

    // Add cache-busting timestamp to the target URL
    const timestampedUrl = `${url}${url.includes('?') ? '&' : '?'}_t=${Date.now()}`
    
    // Generate screenshot using Microlink API with extended wait time
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

    const screenshotUrl = `https://api.microlink.io/?${params}`
    
    console.log(`Starting screenshot generation for ${url} at ${new Date().toISOString()}`)
    
    // Fetch the screenshot
    const startTime = Date.now()
    const screenshotResponse = await fetch(screenshotUrl)
    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000
    
    console.log(`Screenshot API completed in ${duration} seconds for ${url}`)
    
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
    const publicId = `portfolio/screenshots/${title ? title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() : 'website'}-${Date.now()}`
    
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      public_id: publicId,
      folder: 'portfolio/screenshots',
      resource_type: 'image',
      format: 'webp', // Convert to WebP for better optimization
      quality: 'auto',
      fetch_format: 'auto'
    })

    return NextResponse.json({
      success: true,
      screenshotUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      message: `Screenshot generated and stored for ${title || url}`
    })

  } catch (error) {
    console.error('Screenshot generation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate screenshot',
      details: error.message
    }, { status: 500 })
  }
}

// GET - Generate screenshot URL for a given URL (without storing)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    const width = parseInt(searchParams.get('width') || '1200')
    const height = parseInt(searchParams.get('height') || '800')
    const quality = parseInt(searchParams.get('quality') || '80')
    
    if (!url) {
      return NextResponse.json({
        success: false,
        error: 'URL parameter is required'
      }, { status: 400 })
    }

    // Add cache-busting timestamp to the target URL
    const timestampedUrl = `${url}${url.includes('?') ? '&' : '?'}_t=${Date.now()}`
    
    // Generate screenshot using Microlink API with extended wait time
    const params = encode({
      url: timestampedUrl,
      screenshot: true,
      meta: false,
      embed: 'screenshot.url',
      colorScheme: 'light',
      'viewport.isMobile': false,
      'viewport.deviceScaleFactor': 2,
      'viewport.width': width,
      'viewport.height': height,
      'screenshot.type': 'png',
      'screenshot.quality': quality,
      waitFor: 30000, // Increased to 30 seconds for complete loading
      waitUntil: ['load', 'networkidle0'], // Wait for load event and network idle
      timeout: 90000, // Increased timeout to 90 seconds
      scroll: true, // Trigger scroll to load lazy content
      animations: false // Disable animations for consistent screenshots
    })

    const screenshotUrl = `https://api.microlink.io/?${params}`

    return NextResponse.json({
      success: true,
      screenshotUrl,
      originalUrl: url
    })

  } catch (error) {
    console.error('Screenshot generation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate screenshot',
      details: error.message
    }, { status: 500 })
  }
}