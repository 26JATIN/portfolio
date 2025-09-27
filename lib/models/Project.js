// Project model for MongoDB operations
import { getCollection } from '../mongodb.js'

export default class Project {
  constructor(data) {
    this.title = data.title
    this.year = data.year
    this.category = data.category
    this.tags = data.tags || []
    this.gradient = data.gradient
    this.liveUrl = data.liveUrl
    this.screenshotUrl = data.screenshotUrl
    this.screenshotCloudinaryId = data.screenshotCloudinaryId || data.screenshotPublicId // Support both field names
    this.techStack = data.techStack || []
    
    // Structured content fields
    this.projectOverview = data.projectOverview || ''
    this.challenge = data.challenge || ''
    this.designProcess = data.designProcess || ''
    this.keyFeatures = data.keyFeatures || []
    this.technicalImplementation = data.technicalImplementation || ''
    this.results = data.results || ''
    this.resultMetrics = data.resultMetrics || []
    
    this.isPublished = data.isPublished || false
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = new Date()
  }

  // Create a new project
  static async create(projectData) {
    try {
      const collection = await getCollection('projects')
      const project = new Project(projectData)
      const result = await collection.insertOne(project)
      return { success: true, id: result.insertedId, project }
    } catch (error) {
      console.error('Error creating project:', error)
      return { success: false, error: error.message }
    }
  }

  // Get all projects
  static async getAll(query = {}) {
    try {
      const collection = await getCollection('projects')
      const projects = await collection.find(query).sort({ createdAt: -1 }).toArray()
      return { success: true, projects }
    } catch (error) {
      console.error('Error fetching projects:', error)
      return { success: false, error: error.message }
    }
  }

  // Get published projects
  static async getPublished() {
    try {
      const collection = await getCollection('projects')
      const projects = await collection.find({ isPublished: true }).sort({ year: -1, createdAt: -1 }).toArray()
      return { success: true, projects }
    } catch (error) {
      console.error('Error fetching published projects:', error)
      return { success: false, error: error.message }
    }
  }

  // Get project by ID
  static async getById(id) {
    try {
      const collection = await getCollection('projects')
      const { ObjectId } = require('mongodb')
      const project = await collection.findOne({ _id: new ObjectId(id) })
      return { success: true, project }
    } catch (error) {
      console.error('Error fetching project:', error)
      return { success: false, error: error.message }
    }
  }

  // Update project
  static async update(id, updateData) {
    try {
      const collection = await getCollection('projects')
      const { ObjectId } = require('mongodb')
      const updatedData = {
        ...updateData,
        updatedAt: new Date()
      }
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      )
      return { success: true, modifiedCount: result.modifiedCount }
    } catch (error) {
      console.error('Error updating project:', error)
      return { success: false, error: error.message }
    }
  }

  // Delete project
  static async delete(id) {
    try {
      const collection = await getCollection('projects')
      const { ObjectId } = require('mongodb')
      
      // First get the project to access screenshot info
      const project = await collection.findOne({ _id: new ObjectId(id) })
      if (!project) {
        return { success: false, error: 'Project not found' }
      }
      
      // Delete from database first
      const result = await collection.deleteOne({ _id: new ObjectId(id) })
      
      // If database deletion successful and project has screenshot, delete from Cloudinary
      if (result.deletedCount > 0 && project.screenshotPublicId) {
        try {
          const { v2: cloudinary } = require('cloudinary')
          
          // Configure Cloudinary (ensure it's configured)
          if (!cloudinary.config().cloud_name) {
            cloudinary.config({
              cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
              api_key: process.env.CLOUDINARY_API_KEY,
              api_secret: process.env.CLOUDINARY_API_SECRET,
            })
          }
          
          await cloudinary.uploader.destroy(project.screenshotPublicId)
          console.log(`Deleted screenshot from Cloudinary: ${project.screenshotPublicId}`)
        } catch (cloudinaryError) {
          // Log but don't fail the deletion if Cloudinary cleanup fails
          console.warn('Failed to delete screenshot from Cloudinary:', cloudinaryError)
        }
      }
      
      return { success: true, deletedCount: result.deletedCount }
    } catch (error) {
      console.error('Error deleting project:', error)
      return { success: false, error: error.message }
    }
  }

  // Toggle publish status
  static async togglePublish(id) {
    try {
      const collection = await getCollection('projects')
      const { ObjectId } = require('mongodb')
      const project = await collection.findOne({ _id: new ObjectId(id) })
      if (!project) {
        return { success: false, error: 'Project not found' }
      }
      
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            isPublished: !project.isPublished,
            updatedAt: new Date()
          }
        }
      )
      return { success: true, isPublished: !project.isPublished }
    } catch (error) {
      console.error('Error toggling publish status:', error)
      return { success: false, error: error.message }
    }
  }
}
