import { NextResponse } from 'next/server'
import { uploadImage } from '../../../lib/cloudinary.js'
import formidable from 'formidable'
import { promises as fs } from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
}

// POST - Upload image to Cloudinary
export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const folder = formData.get('folder') || 'portfolio'
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Convert buffer to base64 for Cloudinary
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`
    
    // Upload to Cloudinary
    const result = await uploadImage(base64, folder)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        url: result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({
      success: false,
      error: 'Upload failed'
    }, { status: 500 })
  }
}
