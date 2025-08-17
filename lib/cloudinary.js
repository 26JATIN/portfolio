import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

// Helper function to upload image
export async function uploadImage(file, folder = 'portfolio') {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto'
    })
    
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Helper function to delete image
export async function deleteImage(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return {
      success: result.result === 'ok',
      result: result.result
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Helper function to get optimized image URL
export function getOptimizedImageUrl(publicId, options = {}) {
  const defaultOptions = {
    quality: 'auto',
    fetch_format: 'auto',
    ...options
  }
  
  return cloudinary.url(publicId, defaultOptions)
}
