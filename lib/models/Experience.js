// Experience model for MongoDB operations
import { getCollection } from '../mongodb.js'

export default class Experience {
  constructor(data) {
    this.company = data.company
    this.role = data.role
    this.period = data.period
    this.logo = data.logo
    this.color = data.color
    this.bgColor = data.bgColor
    this.textColor = data.textColor
    this.description = data.description || ''
    this.keyAchievements = data.keyAchievements || []
    this.technologies = data.technologies || []
    this.orderIndex = data.orderIndex || 0
    this.isPublished = data.isPublished || false
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = new Date()
  }

  // Create a new experience
  static async create(experienceData) {
    try {
      const collection = await getCollection('experiences')
      const experience = new Experience(experienceData)
      const result = await collection.insertOne(experience)
      return { success: true, id: result.insertedId, experience }
    } catch (error) {
      console.error('Error creating experience:', error)
      return { success: false, error: error.message }
    }
  }

  // Get all experiences
  static async getAll(query = {}) {
    try {
      const collection = await getCollection('experiences')
      const experiences = await collection.find(query).sort({ orderIndex: 1, createdAt: -1 }).toArray()
      return { success: true, experiences }
    } catch (error) {
      console.error('Error fetching experiences:', error)
      return { success: false, error: error.message }
    }
  }

  // Get published experiences only
  static async getPublished() {
    try {
      const collection = await getCollection('experiences')
      const experiences = await collection.find({ isPublished: true }).sort({ orderIndex: 1, createdAt: -1 }).toArray()
      return { success: true, experiences }
    } catch (error) {
      console.error('Error fetching published experiences:', error)
      return { success: false, error: error.message }
    }
  }

  // Get experience by ID
  static async getById(id) {
    try {
      const { ObjectId } = await import('mongodb')
      const collection = await getCollection('experiences')
      const experience = await collection.findOne({ _id: new ObjectId(id) })
      return { success: true, experience }
    } catch (error) {
      console.error('Error fetching experience by ID:', error)
      return { success: false, error: error.message }
    }
  }

  // Update experience
  static async update(id, updateData) {
    try {
      const { ObjectId } = await import('mongodb')
      const collection = await getCollection('experiences')
      const experience = new Experience({ ...updateData, updatedAt: new Date() })
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: experience }
      )
      
      if (result.matchedCount === 0) {
        return { success: false, error: 'Experience not found' }
      }
      
      return { success: true, experience }
    } catch (error) {
      console.error('Error updating experience:', error)
      return { success: false, error: error.message }
    }
  }

  // Delete experience
  static async delete(id) {
    try {
      const { ObjectId } = await import('mongodb')
      const collection = await getCollection('experiences')
      const result = await collection.deleteOne({ _id: new ObjectId(id) })
      
      if (result.deletedCount === 0) {
        return { success: false, error: 'Experience not found' }
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error deleting experience:', error)
      return { success: false, error: error.message }
    }
  }

  // Toggle publish status
  static async togglePublish(id) {
    try {
      const { ObjectId } = await import('mongodb')
      const collection = await getCollection('experiences')
      
      // First get the current experience
      const experience = await collection.findOne({ _id: new ObjectId(id) })
      if (!experience) {
        return { success: false, error: 'Experience not found' }
      }
      
      // Toggle the publish status
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            isPublished: !experience.isPublished,
            updatedAt: new Date()
          }
        }
      )
      
      return { success: true, isPublished: !experience.isPublished }
    } catch (error) {
      console.error('Error toggling experience publish status:', error)
      return { success: false, error: error.message }
    }
  }

  // Update order index for multiple experiences
  static async updateOrder(orderUpdates) {
    try {
      const { ObjectId } = await import('mongodb')
      const collection = await getCollection('experiences')
      
      const bulkOps = orderUpdates.map(({ id, orderIndex }) => ({
        updateOne: {
          filter: { _id: new ObjectId(id) },
          update: { $set: { orderIndex, updatedAt: new Date() } }
        }
      }))
      
      await collection.bulkWrite(bulkOps)
      return { success: true }
    } catch (error) {
      console.error('Error updating experience order:', error)
      return { success: false, error: error.message }
    }
  }
}
