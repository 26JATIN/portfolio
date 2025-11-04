// Skill model for MongoDB operations
import { getCollection } from '../mongodb.js'
import { ObjectId } from 'mongodb'

export default class Skill {
  constructor(data) {
    this.title = data.title
    this.description = data.description
    this.icon = data.icon || '' // Small SVG/icon image
    this.certificateImage = data.certificateImage || '' // Certificate image for flip effect
    this.certificateUrl = data.certificateUrl || '' // URL to certificate (optional)
    this.order = data.order || 0
    this.published = data.published !== undefined ? data.published : true
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = new Date()
  }

  // Create a new skill
  static async create(skillData) {
    try {
      const collection = await getCollection('skills')
      const skill = new Skill(skillData)
      const result = await collection.insertOne(skill)
      return { success: true, id: result.insertedId, skill }
    } catch (error) {
      console.error('Error creating skill:', error)
      return { success: false, error: error.message }
    }
  }

  // Get all skills
  static async getAll(query = {}) {
    try {
      const collection = await getCollection('skills')
      const skills = await collection.find(query).sort({ order: 1, createdAt: -1 }).toArray()
      return { success: true, skills }
    } catch (error) {
      console.error('Error fetching skills:', error)
      return { success: false, error: error.message }
    }
  }

  // Get published skills
  static async getPublished() {
    try {
      const collection = await getCollection('skills')
      const skills = await collection.find({ published: true }).sort({ order: 1, createdAt: -1 }).toArray()
      return { success: true, skills }
    } catch (error) {
      console.error('Error fetching published skills:', error)
      return { success: false, error: error.message }
    }
  }

  // Get skill by ID
  static async getById(id) {
    try {
      const collection = await getCollection('skills')
      const skill = await collection.findOne({ _id: new ObjectId(id) })
      if (!skill) {
        return { success: false, error: 'Skill not found' }
      }
      return { success: true, skill }
    } catch (error) {
      console.error('Error fetching skill:', error)
      return { success: false, error: error.message }
    }
  }

  // Update skill
  static async update(id, updateData) {
    try {
      const collection = await getCollection('skills')
      const skill = new Skill(updateData)
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: skill },
        { returnDocument: 'after' }
      )
      if (!result) {
        return { success: false, error: 'Skill not found' }
      }
      return { success: true, skill: result }
    } catch (error) {
      console.error('Error updating skill:', error)
      return { success: false, error: error.message }
    }
  }

  // Delete skill
  static async delete(id) {
    try {
      const collection = await getCollection('skills')
      const result = await collection.deleteOne({ _id: new ObjectId(id) })
      if (result.deletedCount === 0) {
        return { success: false, error: 'Skill not found' }
      }
      return { success: true, message: 'Skill deleted successfully' }
    } catch (error) {
      console.error('Error deleting skill:', error)
      return { success: false, error: error.message }
    }
  }

  // Toggle publish status
  static async togglePublish(id) {
    try {
      const collection = await getCollection('skills')
      const skill = await collection.findOne({ _id: new ObjectId(id) })
      if (!skill) {
        return { success: false, error: 'Skill not found' }
      }
      
      const newPublishStatus = !skill.published
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { published: newPublishStatus, updatedAt: new Date() } },
        { returnDocument: 'after' }
      )
      
      return { 
        success: true, 
        skill: result,
        message: `Skill ${newPublishStatus ? 'published' : 'unpublished'} successfully` 
      }
    } catch (error) {
      console.error('Error toggling skill publish status:', error)
      return { success: false, error: error.message }
    }
  }
}

