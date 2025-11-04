"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Save, ImageIcon, Database, RefreshCw, GripVertical } from 'lucide-react'
import Lenis from 'lenis'

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [draggedItem, setDraggedItem] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    liveUrl: '',
    githubUrl: '',
    category: '',
    tags: [],
    isPublished: false
  })
  const [newTag, setNewTag] = useState('')
  const [generatingScreenshots, setGeneratingScreenshots] = useState(false)
  const [cleaningUp, setCleaningUp] = useState(false)
  const [cloudinaryStats, setCloudinaryStats] = useState(null)
  const [generatingIndividualScreenshot, setGeneratingIndividualScreenshot] = useState(null)

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
      liveUrl: '',
      githubUrl: '',
      category: '',
      tags: [],
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
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      category: project.category || '',
      tags: project.tags || [],
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

  // Drag and drop handlers
  const handleDragStart = (e, project, index) => {
    setDraggedItem({ project, index })
    e.dataTransfer.effectAllowed = 'move'
    e.currentTarget.style.opacity = '0.5'
  }

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1'
    setDraggedItem(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, targetProject, targetIndex) => {
    e.preventDefault()
    
    if (!draggedItem || draggedItem.index === targetIndex) return

    const newProjects = [...projects]
    const [removed] = newProjects.splice(draggedItem.index, 1)
    newProjects.splice(targetIndex, 0, removed)

    // Update order property for all affected projects
    const updatedProjects = newProjects.map((project, index) => ({
      ...project,
      order: index
    }))

    setProjects(updatedProjects)

    // Update orders in the database
    try {
      await Promise.all(
        updatedProjects.map(project =>
          fetch(`/api/projects/${project._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              title: project.title,
              liveUrl: project.liveUrl,
              githubUrl: project.githubUrl,
              category: project.category,
              tags: project.tags,
              screenshotUrl: project.screenshotUrl,
              screenshotCloudinaryId: project.screenshotCloudinaryId,
              isPublished: project.isPublished,
              order: project.order
            }),
          })
        )
      )
    } catch (error) {
      console.error('Error updating project order:', error)
      // Revert on error
      fetchProjects()
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
          {projects.map((project, index) => (
            <div 
              key={project._id} 
              draggable
              onDragStart={(e) => handleDragStart(e, project, index)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, project, index)}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg dark:shadow-2xl overflow-hidden border dark:border-gray-800 hover:shadow-xl dark:hover:shadow-3xl transition-all duration-300 cursor-move hover:border-cyan-500"
            >
              {/* Drag Handle */}
              <div className="absolute top-2 left-2 z-10 text-gray-400 bg-white dark:bg-gray-800 rounded p-1">
                <GripVertical className="w-4 h-4" />
              </div>

              {/* Project Preview */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4">
                <div className="bg-white dark:bg-gray-700 rounded-lg aspect-video p-4 shadow-sm">
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
                </div>
                
                {/* Category */}
                {project.category && (
                  <div className="mb-3">
                    <Badge variant="default" className="text-xs bg-blue-600 text-white">
                      {project.category}
                    </Badge>
                  </div>
                )}
                
                {/* URLs */}
                <div className="space-y-2 mb-3">
                  {project.liveUrl && (
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Live: </span>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline truncate block">
                        {project.liveUrl}
                      </a>
                    </div>
                  )}
                  {project.githubUrl && (
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">GitHub: </span>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline truncate block">
                        {project.githubUrl}
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags?.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags?.length > 3 && (
                    <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                      +{project.tags.length - 3}
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-950 border border-zinc-800/50 rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col">
              <div className="p-6 border-b border-zinc-800/50 flex-shrink-0 bg-zinc-950/95 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">
                    {editingProject ? 'Edit Project' : 'New Project'}
                  </h2>
                  <button 
                    onClick={closeModal} 
                    className="p-2 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div 
                ref={modalScrollRef}
                className="flex-1 overflow-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700"
                style={{ height: 'calc(90vh - 80px)' }}
              >
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Project Name */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-zinc-700 bg-zinc-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-zinc-400 transition-all"
                      placeholder="Enter project name"
                      required
                    />
                  </div>

                  {/* Live URL */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Live URL
                    </label>
                    <input
                      type="url"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                      className="w-full px-4 py-3 border border-zinc-700 bg-zinc-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-zinc-400 transition-all"
                      placeholder="https://example.com"
                    />
                  </div>

                  {/* GitHub URL */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                      className="w-full px-4 py-3 border border-zinc-700 bg-zinc-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-zinc-400 transition-all"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-zinc-700 bg-zinc-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-zinc-400 transition-all"
                      placeholder="e.g., Web Development, Mobile App, etc."
                    />
                    <p className="text-xs text-zinc-400 mt-2">
                      Used for filtering projects on the frontend
                    </p>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Tags
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          className="flex-1 px-4 py-3 border border-zinc-700 bg-zinc-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-zinc-400 transition-all"
                          placeholder="Add a tag"
                        />
                        <Button type="button" onClick={addTag} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white font-medium transition-all">Add</Button>
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