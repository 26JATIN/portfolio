"use client"

import { useState, useEffect } from 'react'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Plus, Edit2, Trash2, Eye, EyeOff, Upload, X, Save, ImageIcon } from 'lucide-react'

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear().toString(),
    category: '',
    tags: [],
    gradient: 'from-blue-100 to-blue-200',
    description: '',
    type: '',
    liveUrl: '',
    techStack: [],
    heroImage: '',
    gallery: [],
    
    // Structured content fields
    projectOverview: '',
    challenge: '',
    designProcess: '',
    keyFeatures: [],
    technicalImplementation: '',
    results: '',
    resultMetrics: [],
    
    // Preview customization
    previewTitle: '',
    previewSubtitle: '',
    previewColor: '#3B82F6',
    previewButtonText: 'View Project',
    previewSecondButtonText: 'Learn More',
    
    isPublished: false
  })
  const [uploading, setUploading] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [newTech, setNewTech] = useState('')
  const [newGalleryItem, setNewGalleryItem] = useState({ src: '', alt: '', caption: '' })
  const [newKeyFeature, setNewKeyFeature] = useState({ title: '', description: '' })
  const [newResultMetric, setNewResultMetric] = useState('')

  const gradientOptions = [
    { value: 'from-blue-100 to-blue-200', label: 'Blue', preview: 'bg-gradient-to-br from-blue-100 to-blue-200' },
    { value: 'from-green-100 to-green-200', label: 'Green', preview: 'bg-gradient-to-br from-green-100 to-green-200' },
    { value: 'from-purple-100 to-purple-200', label: 'Purple', preview: 'bg-gradient-to-br from-purple-100 to-purple-200' },
    { value: 'from-amber-100 to-amber-200', label: 'Amber', preview: 'bg-gradient-to-br from-amber-100 to-amber-200' },
    { value: 'from-pink-100 to-pink-200', label: 'Pink', preview: 'bg-gradient-to-br from-pink-100 to-pink-200' },
    { value: 'from-indigo-100 to-indigo-200', label: 'Indigo', preview: 'bg-gradient-to-br from-indigo-100 to-indigo-200' },
  ]

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      const data = await response.json()
      if (data.success) {
        setProjects(data.projects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      year: new Date().getFullYear().toString(),
      category: '',
      tags: [],
      gradient: 'from-blue-100 to-blue-200',
      description: '',
      type: '',
      liveUrl: '',
      techStack: [],
      heroImage: '',
      gallery: [],
      
      // Structured content fields
      projectOverview: '',
      challenge: '',
      designProcess: '',
      keyFeatures: [],
      technicalImplementation: '',
      results: '',
      resultMetrics: [],
      
      // Preview customization
      previewTitle: '',
      previewSubtitle: '',
      previewColor: '#3B82F6',
      previewButtonText: 'View Project',
      previewSecondButtonText: 'Learn More',
      
      isPublished: false
    })
    setEditingProject(null)
    setNewTag('')
    setNewTech('')
    setNewGalleryItem({ src: '', alt: '', caption: '' })
    setNewKeyFeature({ title: '', description: '' })
    setNewResultMetric('')
  }

  // Open modal for new project
  const openNewProjectModal = () => {
    resetForm()
    setShowModal(true)
  }

  // Open modal for editing project
  const openEditProjectModal = (project) => {
    setFormData({
      title: project.title || '',
      year: project.year || new Date().getFullYear().toString(),
      category: project.category || '',
      tags: project.tags || [],
      gradient: project.gradient || 'from-blue-100 to-blue-200',
      description: project.description || '',
      type: project.type || '',
      liveUrl: project.liveUrl || '',
      techStack: project.techStack || [],
      heroImage: project.heroImage || '',
      gallery: project.gallery || [],
      
      // Structured content fields
      projectOverview: project.projectOverview || '',
      challenge: project.challenge || '',
      designProcess: project.designProcess || '',
      keyFeatures: project.keyFeatures || [],
      technicalImplementation: project.technicalImplementation || '',
      results: project.results || '',
      resultMetrics: project.resultMetrics || [],
      
      // Preview customization
      previewTitle: project.previewTitle || project.title || '',
      previewSubtitle: project.previewSubtitle || project.description || '',
      previewColor: project.previewColor || '#3B82F6',
      previewButtonText: project.previewButtonText || 'View Project',
      previewSecondButtonText: project.previewSecondButtonText || 'Learn More',
      
      isPublished: project.isPublished || false
    })
    setEditingProject(project)
    setShowModal(true)
  }

  // Close modal
  const closeModal = () => {
    setShowModal(false)
    resetForm()
  }

  // Handle file upload
  const handleFileUpload = async (file, isGallery = false) => {
    if (!file) return null

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'portfolio/projects')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (data.success) {
        return data.url
      } else {
        alert('Upload failed: ' + data.error)
        return null
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
      return null
    } finally {
      setUploading(false)
    }
  }

  // Handle hero image upload
  const handleHeroImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = await handleFileUpload(file)
      if (url) {
        setFormData(prev => ({ ...prev, heroImage: url }))
      }
    }
  }

  // Handle gallery image upload
  const handleGalleryImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const url = await handleFileUpload(file, true)
      if (url) {
        setNewGalleryItem(prev => ({ ...prev, src: url }))
      }
    }
  }

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // Add tech
  const addTech = () => {
    if (newTech.trim() && !formData.techStack.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, newTech.trim()]
      }))
      setNewTech('')
    }
  }

  // Remove tech
  const removeTech = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter(tech => tech !== techToRemove)
    }))
  }

  // Add gallery item
  const addGalleryItem = () => {
    if (newGalleryItem.src.trim()) {
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, { ...newGalleryItem }]
      }))
      setNewGalleryItem({ src: '', alt: '', caption: '' })
    }
  }

  // Remove gallery item
  const removeGalleryItem = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }))
  }

  // Add key feature
  const addKeyFeature = () => {
    if (newKeyFeature.title.trim() && newKeyFeature.description.trim()) {
      setFormData(prev => ({
        ...prev,
        keyFeatures: [...prev.keyFeatures, { ...newKeyFeature }]
      }))
      setNewKeyFeature({ title: '', description: '' })
    }
  }

  // Remove key feature
  const removeKeyFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index)
    }))
  }

  // Add result metric
  const addResultMetric = () => {
    if (newResultMetric.trim()) {
      setFormData(prev => ({
        ...prev,
        resultMetrics: [...prev.resultMetrics, newResultMetric.trim()]
      }))
      setNewResultMetric('')
    }
  }

  // Remove result metric
  const removeResultMetric = (index) => {
    setFormData(prev => ({
      ...prev,
      resultMetrics: prev.resultMetrics.filter((_, i) => i !== index)
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = editingProject 
        ? `/api/projects/${editingProject._id}`
        : '/api/projects'
      
      const method = editingProject ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        await fetchProjects()
        closeModal()
        alert(editingProject ? 'Project updated successfully!' : 'Project created successfully!')
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Error saving project')
    }
  }

  // Toggle publish status
  const togglePublish = async (projectId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/toggle-publish`, {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        await fetchProjects()
        alert(data.message)
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error toggling publish status:', error)
      alert('Error updating publish status')
    }
  }

  // Delete project
  const deleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        await fetchProjects()
        alert('Project deleted successfully!')
      } else {
        alert('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Error deleting project')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <Button onClick={openNewProjectModal} className="flex items-center gap-2">
            <Plus size={20} />
            Add New Project
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              {/* Project Preview */}
              <div className={`bg-gradient-to-br ${project.gradient} p-4`}>
                <div className="bg-white rounded-lg aspect-video p-4 shadow-sm">
                  {project.heroImage ? (
                    <img 
                      src={project.heroImage} 
                      alt={project.title}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                      <ImageIcon className="text-gray-400" size={32} />
                    </div>
                  )}
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {project.title}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {project.year}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags?.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags?.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.tags.length - 2}
                    </Badge>
                  )}
                </div>

                {/* Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {project.isPublished ? (
                      <Eye size={16} className="text-green-600" />
                    ) : (
                      <EyeOff size={16} className="text-gray-400" />
                    )}
                    <span className={`text-sm ${project.isPublished ? 'text-green-600' : 'text-gray-400'}`}>
                      {project.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditProjectModal(project)}
                    className="flex-1"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant={project.isPublished ? "destructive" : "default"}
                    onClick={() => togglePublish(project._id)}
                  >
                    {project.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteProject(project._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ImageIcon size={64} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No projects yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first project to get started
            </p>
            <Button onClick={openNewProjectModal}>
              <Plus size={20} className="mr-2" />
              Add New Project
            </Button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {editingProject ? 'Edit Project' : 'New Project'}
                  </h2>
                  <Button variant="ghost" onClick={closeModal}>
                    <X size={20} />
                  </Button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Year *
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., WEB DESIGN & BRANDING"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Type *
                    </label>
                    <input
                      type="text"
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="e.g., wellness, ecommerce, agency"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Live URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com"
                  />
                </div>

                {/* Gradient Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gradient Color
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {gradientOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, gradient: option.value }))}
                        className={`h-12 rounded-lg ${option.preview} border-2 ${
                          formData.gradient === option.value 
                            ? 'border-blue-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        title={option.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Hero Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hero Image
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroImageUpload}
                        className="hidden"
                        id="hero-upload"
                      />
                      <label
                        htmlFor="hero-upload"
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Upload size={16} />
                        {uploading ? 'Uploading...' : 'Upload Hero Image'}
                      </label>
                    </div>
                    {formData.heroImage && (
                      <div className="relative">
                        <img
                          src={formData.heroImage}
                          alt="Hero preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, heroImage: '' }))}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Add a tag"
                      />
                      <Button type="button" onClick={addTag}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X size={12} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Technology Stack
                  </label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTech}
                        onChange={(e) => setNewTech(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Add a technology"
                      />
                      <Button type="button" onClick={addTech}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.techStack.map((tech, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTech(tech)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X size={12} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Gallery
                  </label>
                  <div className="space-y-4">
                    {/* Add new gallery item */}
                    <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleGalleryImageUpload}
                          className="hidden"
                          id="gallery-upload"
                        />
                        <label
                          htmlFor="gallery-upload"
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <Upload size={16} />
                          Upload Image
                        </label>
                      </div>
                      
                      {newGalleryItem.src && (
                        <div className="space-y-3">
                          <img
                            src={newGalleryItem.src}
                            alt="Gallery preview"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={newGalleryItem.alt}
                              onChange={(e) => setNewGalleryItem(prev => ({ ...prev, alt: e.target.value }))}
                              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              placeholder="Alt text"
                            />
                            <input
                              type="text"
                              value={newGalleryItem.caption}
                              onChange={(e) => setNewGalleryItem(prev => ({ ...prev, caption: e.target.value }))}
                              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              placeholder="Caption"
                            />
                          </div>
                          <Button type="button" onClick={addGalleryItem} className="w-full">
                            Add to Gallery
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Gallery items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.gallery.map((item, index) => (
                        <div key={index} className="relative">
                          <img
                            src={item.src}
                            alt={item.alt}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryItem(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                          {item.caption && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                              {item.caption}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preview Card Customization */}
                <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preview Card Customization</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preview Title
                      </label>
                      <input
                        type="text"
                        value={formData.previewTitle}
                        onChange={(e) => setFormData(prev => ({ ...prev, previewTitle: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Title for preview card"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preview Color
                      </label>
                      <input
                        type="color"
                        value={formData.previewColor}
                        onChange={(e) => setFormData(prev => ({ ...prev, previewColor: e.target.value }))}
                        className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Preview Subtitle
                    </label>
                    <textarea
                      value={formData.previewSubtitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, previewSubtitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      rows={2}
                      placeholder="Subtitle for preview card"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        First Button Text
                      </label>
                      <input
                        type="text"
                        value={formData.previewButtonText}
                        onChange={(e) => setFormData(prev => ({ ...prev, previewButtonText: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="First button text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Second Button Text
                      </label>
                      <input
                        type="text"
                        value={formData.previewSecondButtonText}
                        onChange={(e) => setFormData(prev => ({ ...prev, previewSecondButtonText: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Second button text"
                      />
                    </div>
                  </div>
                </div>

                {/* Structured Content */}
                <div className="space-y-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Details</h3>
                  
                  {/* Project Overview */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Overview
                    </label>
                    <textarea
                      value={formData.projectOverview}
                      onChange={(e) => setFormData(prev => ({ ...prev, projectOverview: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      rows={4}
                      placeholder="Comprehensive overview of the project..."
                    />
                  </div>

                  {/* Challenge */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      The Challenge
                    </label>
                    <textarea
                      value={formData.challenge}
                      onChange={(e) => setFormData(prev => ({ ...prev, challenge: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      rows={3}
                      placeholder="What challenges did this project address..."
                    />
                  </div>

                  {/* Design Process */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Design Process
                    </label>
                    <textarea
                      value={formData.designProcess}
                      onChange={(e) => setFormData(prev => ({ ...prev, designProcess: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      rows={4}
                      placeholder="Describe the design and development process..."
                    />
                  </div>

                  {/* Key Features */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Key Features
                    </label>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={newKeyFeature.title}
                          onChange={(e) => setNewKeyFeature(prev => ({ ...prev, title: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Feature title"
                        />
                        <input
                          type="text"
                          value={newKeyFeature.description}
                          onChange={(e) => setNewKeyFeature(prev => ({ ...prev, description: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Feature description"
                        />
                      </div>
                      <Button type="button" onClick={addKeyFeature} className="w-full">
                        Add Key Feature
                      </Button>
                      <div className="space-y-2">
                        {formData.keyFeatures.map((feature, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{feature.title}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeKeyFeature(index)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Technical Implementation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Technical Implementation
                    </label>
                    <textarea
                      value={formData.technicalImplementation}
                      onChange={(e) => setFormData(prev => ({ ...prev, technicalImplementation: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      rows={3}
                      placeholder="Technical details and implementation approach..."
                    />
                  </div>

                  {/* Results */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Results & Impact
                    </label>
                    <textarea
                      value={formData.results}
                      onChange={(e) => setFormData(prev => ({ ...prev, results: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      rows={3}
                      placeholder="Project outcomes and impact..."
                    />
                  </div>

                  {/* Result Metrics */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Result Metrics
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newResultMetric}
                          onChange={(e) => setNewResultMetric(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResultMetric())}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Add a result metric"
                        />
                        <Button type="button" onClick={addResultMetric}>Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.resultMetrics.map((metric, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            {metric}
                            <button
                              type="button"
                              onClick={() => removeResultMetric(index)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X size={12} />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Publish Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="published" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Publish immediately
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 flex items-center gap-2" disabled={uploading}>
                    <Save size={16} />
                    {editingProject ? 'Update Project' : 'Create Project'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}