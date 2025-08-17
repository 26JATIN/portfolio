// Project model for MongoDB operations
import { getCollection } from '../mongodb.js'

export default class Project {
  constructor(data) {
    this.title = data.title
    this.year = data.year
    this.category = data.category
    this.tags = data.tags || []
    this.gradient = data.gradient
    this.description = data.description
    this.type = data.type
    this.liveUrl = data.liveUrl
    this.techStack = data.techStack || []
    this.heroImage = data.heroImage
    this.gallery = data.gallery || []
    
    // Structured content fields
    this.projectOverview = data.projectOverview || ''
    this.challenge = data.challenge || ''
    this.designProcess = data.designProcess || ''
    this.keyFeatures = data.keyFeatures || []
    this.technicalImplementation = data.technicalImplementation || ''
    this.results = data.results || ''
    this.resultMetrics = data.resultMetrics || []
    
    // Preview card customization
    this.previewTitle = data.previewTitle || data.title
    this.previewSubtitle = data.previewSubtitle || data.description
    this.previewColor = data.previewColor || '#3B82F6'
    this.previewButtonText = data.previewButtonText || 'View Project'
    this.previewSecondButtonText = data.previewSecondButtonText || 'Learn More'
    
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
      const result = await collection.deleteOne({ _id: new ObjectId(id) })
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
