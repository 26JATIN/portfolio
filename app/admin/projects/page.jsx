"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Save, ImageIcon, Database, RefreshCw } from 'lucide-react'
import Lenis from 'lenis'

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
    gradient: '',
    liveUrl: '',
    techStack: [],
    
    // Structured content fields
    projectOverview: '',
    challenge: '',
    designProcess: '',
    keyFeatures: [],
    technicalImplementation: '',
    results: '',
    resultMetrics: [],
    
    isPublished: false
  })
  const [newTag, setNewTag] = useState('')
  const [newTech, setNewTech] = useState('')
  const [newKeyFeature, setNewKeyFeature] = useState({ title: '', description: '' })
  const [newResultMetric, setNewResultMetric] = useState('')
  const [generatingScreenshots, setGeneratingScreenshots] = useState(false)
  const [cleaningUp, setCleaningUp] = useState(false)
  const [cloudinaryStats, setCloudinaryStats] = useState(null)
  const [generatingIndividualScreenshot, setGeneratingIndividualScreenshot] = useState(null)

  const gradientOptions = [
    { value: '', label: 'None', preview: 'bg-gray-100 dark:bg-gray-800' },
    { value: 'from-blue-100 to-blue-200', label: 'Blue', preview: 'bg-gradient-to-br from-blue-100 to-blue-200' },
    { value: 'from-green-100 to-green-200', label: 'Green', preview: 'bg-gradient-to-br from-green-100 to-green-200' },
    { value: 'from-purple-100 to-purple-200', label: 'Purple', preview: 'bg-gradient-to-br from-purple-100 to-purple-200' },
    { value: 'from-amber-100 to-amber-200', label: 'Amber', preview: 'bg-gradient-to-br from-amber-100 to-amber-200' },
    { value: 'from-pink-100 to-pink-200', label: 'Pink', preview: 'bg-gradient-to-br from-pink-100 to-pink-200' },
    { value: 'from-indigo-100 to-indigo-200', label: 'Indigo', preview: 'bg-gradient-to-br from-indigo-100 to-indigo-200' },
  ]

  const modalScrollRef = useRef(null)
  const lenisRef = useRef(null)

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
    fetchCloudinaryStats()
  }, [])

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      year: new Date().getFullYear().toString(),
      category: '',
      tags: [],
      gradient: '',
      liveUrl: '',
      techStack: [],
      
      // Structured content fields
      projectOverview: '',
      challenge: '',
      designProcess: '',
      keyFeatures: [],
      technicalImplementation: '',
      results: '',
      resultMetrics: [],
      
      isPublished: false
    })
    setEditingProject(null)
    setNewTag('')
  }

  // Generate screenshots for all projects
  const generateAllScreenshots = async () => {
    setGeneratingScreenshots(true)
    try {
      const response = await fetch('/api/projects/update-screenshot', {
        method: 'PATCH'
      })
      const data = await response.json()
      
      if (data.success) {
        // Refresh projects list to show new screenshots
        await fetchProjects()
        alert(`Screenshot generation complete!\n${data.summary.successful} successful, ${data.summary.errors} errors, ${data.summary.skipped} skipped.`)
      } else {
        throw new Error(data.error || 'Failed to generate screenshots')
      }
    } catch (error) {
      console.error('Error generating screenshots:', error)
      alert('Failed to generate screenshots: ' + error.message)
    } finally {
      setGeneratingScreenshots(false)
    }
  }

  // Fetch Cloudinary stats
  const fetchCloudinaryStats = async () => {
    try {
      const response = await fetch('/api/cloudinary-cleanup?action=list-resources')
      const data = await response.json()
      
      if (data.success) {
        setCloudinaryStats(data.summary)
      }
    } catch (error) {
      console.error('Error fetching Cloudinary stats:', error)
    }
  }

  // Clean up only screenshots
  const cleanupScreenshots = async () => {
    if (!confirm('Are you sure you want to delete all website screenshot images from Cloudinary?')) {
      return
    }

    setCleaningUp(true)
    try {
      const response = await fetch('/api/cloudinary-cleanup?action=cleanup-screenshots', {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.success) {
        alert(data.message)
        await fetchCloudinaryStats() // Refresh stats
        // Add a small delay to ensure database changes propagate
        setTimeout(async () => {
          await fetchProjects() // Refresh projects to clear screenshot URLs
          window.location.reload() // Force a complete page refresh to clear all caches
        }, 1000)
      } else {
        throw new Error(data.error || 'Failed to cleanup screenshots')
      }
    } catch (error) {
      console.error('Error cleaning up screenshots:', error)
      alert('Failed to cleanup screenshots: ' + error.message)
    } finally {
      setCleaningUp(false)
    }
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
      liveUrl: project.liveUrl || '',
      techStack: project.techStack || [],
      
      // Structured content fields
      projectOverview: project.projectOverview || '',
      challenge: project.challenge || '',
      designProcess: project.designProcess || '',
      keyFeatures: project.keyFeatures || [],
      technicalImplementation: project.technicalImplementation || '',
      results: project.results || '',
      resultMetrics: project.resultMetrics || [],
      
      isPublished: project.isPublished || false
    })
    setEditingProject(project)
    setShowModal(true)
  }

  // Close modal
  const closeModal = () => {
    // Destroy Lenis instance when closing modal
    if (lenisRef.current) {
      lenisRef.current.destroy()
      lenisRef.current = null
    }
    setShowModal(false)
    resetForm()
  }

  // Initialize Lenis for modal when it opens
  useEffect(() => {
    if (showModal && modalScrollRef.current) {
      // Create new Lenis instance for the modal
      lenisRef.current = new Lenis({
        wrapper: modalScrollRef.current,
        content: modalScrollRef.current.firstChild,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.8,
        touchMultiplier: 2,
        infinite: false,
      })

      // Animation frame for Lenis
      function raf(time) {
        lenisRef.current?.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)

      // Cleanup function
      return () => {
        if (lenisRef.current) {
          lenisRef.current.destroy()
          lenisRef.current = null
        }
      }
    }
  }, [showModal])



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

  // Generate screenshot for individual project
  const generateProjectScreenshot = async (projectId, projectTitle) => {
    setGeneratingIndividualScreenshot(projectId)
    try {
      const response = await fetch('/api/projects/update-screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: projectId,
          forceRegenerate: true
        })
      })
      const data = await response.json()
      
      if (data.success) {
        // Refresh projects list to show new screenshot
        await fetchProjects()
        await fetchCloudinaryStats() // Also refresh stats
        alert(`Screenshot generated for "${projectTitle}"!`)
      } else {
        throw new Error(data.error || 'Failed to generate screenshot')
      }
    } catch (error) {
      console.error('Error generating screenshot:', error)
      alert('Failed to generate screenshot: ' + error.message)
    } finally {
      setGeneratingIndividualScreenshot(null)
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
      <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg dark:shadow-2xl border dark:border-gray-800">
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
            {cloudinaryStats && (
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Cloudinary: {cloudinaryStats.total} images ({cloudinaryStats.screenshots} screenshots, {cloudinaryStats.other_images} other)</span>
                <button 
                  onClick={fetchCloudinaryStats}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  title="Refresh stats"
                >
                  <RefreshCw size={12} />
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={generateAllScreenshots} 
              disabled={generatingScreenshots}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 shadow-lg disabled:opacity-50 text-xs sm:text-sm"
            >
              <ImageIcon size={16} />
              {generatingScreenshots ? 'Generating Simultaneously...' : 'Generate All Screenshots'}
            </Button>
            <Button 
              onClick={cleanupScreenshots} 
              disabled={cleaningUp}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 shadow-lg disabled:opacity-50 text-xs sm:text-sm"
            >
              <Database size={16} />
              {cleaningUp ? 'Cleaning...' : 'Clean Website Screenshots'}
            </Button>
            <Button onClick={openNewProjectModal} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg text-xs sm:text-sm">
              <Plus size={16} />
              Add New Project
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg dark:shadow-2xl overflow-hidden border dark:border-gray-800 hover:shadow-xl dark:hover:shadow-3xl transition-all duration-300">
              {/* Project Preview */}
              <div className={`bg-gradient-to-br ${project.gradient} p-4`}>
                <div className="bg-white dark:bg-gray-800 rounded-lg aspect-video p-4 shadow-sm">
                  {project.screenshotUrl ? (
                    <div className="relative w-full h-full">
                      <img 
                        key={`${project._id}-${project.screenshotUrl}-${Date.now()}`} 
                        src={`${project.screenshotUrl}?t=${Date.now()}`}
                        alt={`${project.title} screenshot`}
                        className="w-full h-full object-cover rounded"
                        onError={(e) => {
                          // If image fails to load, hide it
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Screenshot
                      </div>
                    </div>
                  ) : project.liveUrl ? (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded flex flex-col items-center justify-center">
                      <ImageIcon className="text-gray-400 dark:text-gray-500 mb-2" size={24} />
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        <div>Screenshot available</div>
                        <div>Generate to preview</div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded flex flex-col items-center justify-center">
                      <ImageIcon className="text-gray-400 dark:text-gray-500 mb-2" size={32} />
                      <div className="text-xs text-gray-500 dark:text-gray-400">No preview available</div>
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
                  {project.projectOverview || project.category}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags?.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags?.length > 2 && (
                    <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                      +{project.tags.length - 2}
                    </Badge>
                  )}
                </div>

                {/* Status and Screenshot Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {project.isPublished ? (
                      <Eye size={16} className="text-green-600 dark:text-green-400" />
                    ) : (
                      <EyeOff size={16} className="text-gray-400 dark:text-gray-500" />
                    )}
                    <span className={`text-sm ${project.isPublished ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                      {project.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    {project.screenshotUrl ? (
                      <span className="text-green-600 dark:text-green-400">📸 Screenshot</span>
                    ) : project.liveUrl ? (
                      <span className="text-orange-600 dark:text-orange-400">🔄 Can generate</span>
                    ) : (
                      <span>❌ No URL</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {/* First row - Main actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditProjectModal(project)}
                      className="flex-1 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant={project.isPublished ? "destructive" : "default"}
                      onClick={() => togglePublish(project._id)}
                      className={project.isPublished ? "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600" : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"}
                    >
                      {project.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteProject(project._id)}
                      className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  {/* Second row - Screenshot action */}
                  {project.liveUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generateProjectScreenshot(project._id, project.title)}
                      className="w-full border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 disabled:opacity-50"
                      disabled={!project.liveUrl || generatingIndividualScreenshot === project._id}
                    >
                      <ImageIcon size={14} className={`mr-1 ${generatingIndividualScreenshot === project._id ? 'animate-spin' : ''}`} />
                      {generatingIndividualScreenshot === project._id 
                        ? 'Generating...' 
                        : project.screenshotUrl 
                          ? 'Regenerate Screenshot' 
                          : 'Generate Screenshot'
                      }
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <ImageIcon size={64} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No projects yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first project to get started
            </p>
            <Button onClick={openNewProjectModal} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
              <Plus size={20} className="mr-2" />
              Add New Project
            </Button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-80 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-black rounded-xl max-w-4xl w-full max-h-[90vh] shadow-2xl border dark:border-gray-800 flex flex-col">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {editingProject ? 'Edit Project' : 'New Project'}
                  </h2>
                  <Button variant="ghost" onClick={closeModal} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    <X size={20} />
                  </Button>
                </div>
              </div>

              <div 
                ref={modalScrollRef}
                className="flex-1 overflow-hidden"
                style={{ height: 'calc(90vh - 80px)' }}
              >
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
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
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
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
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
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                        placeholder="e.g., WEB DESIGN & BRANDING"
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
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                        placeholder="https://example.com"
                      />
                    </div>
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
                              : 'border-gray-300 dark:border-gray-700'
                          } flex items-center justify-center relative overflow-hidden`}
                          title={option.label}
                        >
                          {option.value === '' && (
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              None
                            </span>
                          )}
                        </button>
                      ))}
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
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                          placeholder="Add a tag"
                        />
                        <Button type="button" onClick={addTag} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
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
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                          placeholder="Add a technology"
                        />
                        <Button type="button" onClick={addTech} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.techStack.map((tech, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400">
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



                  {/* Structured Content */}
                  <div className="space-y-6 p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Details</h3>
                    
                    {/* Project Overview */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Project Overview
                      </label>
                      <textarea
                        value={formData.projectOverview}
                        onChange={(e) => setFormData(prev => ({ ...prev, projectOverview: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
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
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
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
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
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
                            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                            placeholder="Feature title"
                          />
                          <input
                            type="text"
                            value={newKeyFeature.description}
                            onChange={(e) => setNewKeyFeature(prev => ({ ...prev, description: e.target.value }))}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                            placeholder="Feature description"
                          />
                        </div>
                        <Button type="button" onClick={addKeyFeature} className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
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
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
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
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
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
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                            placeholder="Add a result metric"
                          />
                          <Button type="button" onClick={addResultMetric} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.resultMetrics.map((metric, index) => (
                            <Badge key={index} variant="outline" className="flex items-center gap-1 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400">
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
                      className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
                    />
                    <label htmlFor="published" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Publish immediately
                    </label>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <Button type="button" variant="outline" onClick={closeModal} className="flex-1 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                      <Save size={16} />
                      {editingProject ? 'Update Project' : 'Create Project'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}