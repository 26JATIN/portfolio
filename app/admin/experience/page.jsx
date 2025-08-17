"use client"

import { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingExperience, setEditingExperience] = useState(null)
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    period: '',
    logo: '',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    textColor: 'text-blue-600 dark:text-blue-400',
    description: '',
    keyAchievements: [''],
    technologies: [''],
    orderIndex: 0,
    isPublished: false
  })

  // Predefined color schemes
  const colorSchemes = [
    {
      name: 'Blue',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      name: 'Green',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/30',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      name: 'Red',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/30',
      textColor: 'text-red-600 dark:text-red-400'
    },
    {
      name: 'Purple',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      name: 'Orange',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
      textColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      name: 'Cyan',
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
      textColor: 'text-cyan-600 dark:text-cyan-400'
    }
  ]

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/experiences')
      const data = await response.json()
      if (data.success) {
        setExperiences(data.experiences)
      }
    } catch (error) {
      console.error('Error fetching experiences:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const cleanedFormData = {
        ...formData,
        keyAchievements: formData.keyAchievements.filter(achievement => achievement.trim() !== ''),
        technologies: formData.technologies.filter(tech => tech.trim() !== '')
      }

      const url = editingExperience 
        ? `/api/experiences/${editingExperience._id}`
        : '/api/experiences'
      
      const method = editingExperience ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedFormData),
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchExperiences()
        resetForm()
        setShowForm(false)
        setEditingExperience(null)
      } else {
        alert(data.error || 'Failed to save experience')
      }
    } catch (error) {
      console.error('Error saving experience:', error)
      alert('Failed to save experience')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (experience) => {
    setEditingExperience(experience)
    setFormData({
      company: experience.company || '',
      role: experience.role || '',
      period: experience.period || '',
      logo: experience.logo || '',
      color: experience.color || 'from-blue-500 to-blue-600',
      bgColor: experience.bgColor || 'bg-blue-50 dark:bg-blue-950/30',
      textColor: experience.textColor || 'text-blue-600 dark:text-blue-400',
      description: experience.description || '',
      keyAchievements: experience.keyAchievements?.length > 0 ? experience.keyAchievements : [''],
      technologies: experience.technologies?.length > 0 ? experience.technologies : [''],
      orderIndex: experience.orderIndex || 0,
      isPublished: experience.isPublished || false
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this experience?')) {
      return
    }

    try {
      const response = await fetch(`/api/experiences/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchExperiences()
      } else {
        alert(data.error || 'Failed to delete experience')
      }
    } catch (error) {
      console.error('Error deleting experience:', error)
      alert('Failed to delete experience')
    }
  }

  const togglePublish = async (id) => {
    try {
      const response = await fetch(`/api/experiences/${id}/toggle-publish`, {
        method: 'POST',
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchExperiences()
      } else {
        alert(data.error || 'Failed to toggle publish status')
      }
    } catch (error) {
      console.error('Error toggling publish status:', error)
      alert('Failed to toggle publish status')
    }
  }

  const resetForm = () => {
    setFormData({
      company: '',
      role: '',
      period: '',
      logo: '',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      textColor: 'text-blue-600 dark:text-blue-400',
      description: '',
      keyAchievements: [''],
      technologies: [''],
      orderIndex: 0,
      isPublished: false
    })
  }

  const updateArrayField = (field, index, value) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData({ ...formData, [field]: newArray })
  }

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] })
  }

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index)
    setFormData({ ...formData, [field]: newArray })
  }

  const selectColorScheme = (scheme) => {
    setFormData({
      ...formData,
      color: scheme.color,
      bgColor: scheme.bgColor,
      textColor: scheme.textColor
    })
  }

  if (loading && experiences.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Experience Management</h1>
          <p className="text-muted-foreground">Manage your work experiences and career journey</p>
        </div>
        <Button 
          onClick={() => {
            resetForm()
            setEditingExperience(null)
            setShowForm(true)
          }}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Add Experience
        </Button>
      </div>

      {/* Experience List */}
      <div className="grid gap-4">
        {experiences.map((experience) => (
          <div
            key={experience._id}
            className="p-6 border rounded-lg bg-card hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white bg-gradient-to-br ${experience.color} shadow-lg`}>
                  {experience.logo}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{experience.company}</h3>
                  <p className="text-muted-foreground">{experience.role}</p>
                  <p className="text-sm text-muted-foreground">{experience.period}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant={experience.isPublished ? "default" : "secondary"}>
                  {experience.isPublished ? "Published" : "Draft"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Order: {experience.orderIndex}
                </span>
              </div>
            </div>

            {experience.description && (
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {experience.description}
              </p>
            )}

            {experience.technologies && experience.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {experience.technologies.map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(experience)}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => togglePublish(experience._id)}
              >
                {experience.isPublished ? 'Unpublish' : 'Publish'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(experience._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}

        {experiences.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No experiences found</p>
            <Button 
              onClick={() => {
                resetForm()
                setEditingExperience(null)
                setShowForm(true)
              }}
              className="mt-4"
            >
              Add Your First Experience
            </Button>
          </div>
        )}
      </div>

      {/* Experience Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">
                {editingExperience ? 'Edit Experience' : 'Add New Experience'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company *</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full p-2 border rounded-md"
                      placeholder="e.g. Google"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Role *</label>
                    <input
                      type="text"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full p-2 border rounded-md"
                      placeholder="e.g. Senior Frontend Developer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Period *</label>
                    <input
                      type="text"
                      required
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      className="w-full p-2 border rounded-md"
                      placeholder="e.g. 2020-2023"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Logo Letter</label>
                    <input
                      type="text"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      className="w-full p-2 border rounded-md"
                      placeholder="e.g. G"
                      maxLength="2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Order Index</label>
                    <input
                      type="number"
                      value={formData.orderIndex}
                      onChange={(e) => setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 0 })}
                      className="w-full p-2 border rounded-md"
                      min="0"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    />
                    <label htmlFor="isPublished" className="text-sm font-medium">
                      Publish immediately
                    </label>
                  </div>
                </div>

                {/* Visual Settings */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Color Scheme</label>
                    <div className="grid grid-cols-2 gap-2">
                      {colorSchemes.map((scheme) => (
                        <button
                          key={scheme.name}
                          type="button"
                          onClick={() => selectColorScheme(scheme)}
                          className={`p-3 rounded-lg border transition-all ${
                            formData.color === scheme.color
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${scheme.color} mx-auto mb-2`}></div>
                          <span className="text-sm">{scheme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Preview</label>
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br ${formData.color}`}>
                          {formData.logo || '?'}
                        </div>
                        <div>
                          <p className="font-medium">{formData.company || 'Company Name'}</p>
                          <p className="text-sm text-muted-foreground">{formData.role || 'Role'}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{formData.period || 'Period'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border rounded-md h-24 resize-none"
                  placeholder="Brief description of your role and responsibilities..."
                />
              </div>

              {/* Key Achievements */}
              <div>
                <label className="block text-sm font-medium mb-2">Key Achievements</label>
                {formData.keyAchievements.map((achievement, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => updateArrayField('keyAchievements', index, e.target.value)}
                      className="flex-1 p-2 border rounded-md"
                      placeholder="e.g. Led a team of 5 developers..."
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayField('keyAchievements', index)}
                      disabled={formData.keyAchievements.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField('keyAchievements')}
                >
                  Add Achievement
                </Button>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium mb-2">Technologies</label>
                {formData.technologies.map((tech, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={tech}
                      onChange={(e) => updateArrayField('technologies', index, e.target.value)}
                      className="flex-1 p-2 border rounded-md"
                      placeholder="e.g. React"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayField('technologies', index)}
                      disabled={formData.technologies.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField('technologies')}
                >
                  Add Technology
                </Button>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingExperience(null)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingExperience ? 'Update Experience' : 'Add Experience'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}