"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload, GripVertical } from 'lucide-react'

// Prebuilt SVG icons for skills
const PREBUILT_ICONS = {
  'UI/UX Design': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="text-purple-500"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l8 4v8.82c0 4.52-3.17 8.77-8 9.98-4.83-1.21-8-5.46-8-9.98V8.18l8-4zM11 7v2h2V7h-2zm0 4v6h2v-6h-2z"/></svg>`,
  'Frontend Development': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="text-blue-500"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>`,
  'Backend Development': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="text-green-500"><path d="M4 6h16v2H4V6m0 5h16v2H4v-2m0 5h16v2H4v-2z"/></svg>`,
  'Mobile App': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="text-pink-500"><path d="M17 19H7V5h10m0-2H7c-1.11 0-2 .89-2 2v18c0 1.11.89 2 2 2h10c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2z"/></svg>`,
  'Database': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="text-orange-500"><path d="M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4zM4 9v3c0 2.21 3.58 4 8 4s8-1.79 8-4V9c0 2.21-3.58 4-8 4s-8-1.79-8-4zm0 5v3c0 2.21 3.58 4 8 4s8-1.79 8-4v-3c0 2.21-3.58 4-8 4s-8-1.79-8-4z"/></svg>`,
  'Cloud': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="text-cyan-500"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>`,
  'AI/ML': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="text-indigo-500"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>`,
  'DevOps': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="text-red-500"><path d="M12 2L1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4m0 6v2h2v-2"/></svg>`,
  'Security': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="text-yellow-500"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>`,
  'API': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="text-teal-500"><path d="M8 3v2H6v2H4v2H2v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2h-2V7h-2V5h-2V3H8m2 4h2v2h2v2h-2v2h-2v-2H8V9h2V7z"/></svg>`,
  'Testing': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="text-lime-500"><path d="M7 2v2h1v14c0 2.21 1.79 4 4 4s4-1.79 4-4V4h1V2H7m2 2h6v3h-2V5h-2v2H9V4m0 5h2v2h2v-2h2v9c0 1.1-.9 2-2 2s-2-.9-2-2V9z"/></svg>`,
  'Analytics': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="text-violet-500"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>`
}

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingSkill, setEditingSkill] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [pdfjsLib, setPdfjsLib] = useState(null)
  const [pdfLibLoading, setPdfLibLoading] = useState(true)
  const [draggedItem, setDraggedItem] = useState(null)
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: '',
    certificateImage: '',
    certificateUrl: '',
    order: 0,
    published: true,
  })

  useEffect(() => {
    fetchSkills()
    
    // Load PDF.js from CDN instead of npm package
    if (typeof window !== 'undefined' && !window.pdfjsLib) {
      setPdfLibLoading(true)
      
      // Load PDF.js from CDN
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
      script.async = true
      
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
          setPdfjsLib(window.pdfjsLib)
          setPdfLibLoading(false)
          console.log('PDF.js loaded successfully from CDN')
        } else {
          console.error('PDF.js loaded but not available')
          setPdfLibLoading(false)
        }
      }
      
      script.onerror = (err) => {
        console.error('Failed to load PDF.js from CDN:', err)
        setPdfLibLoading(false)
      }
      
      document.head.appendChild(script)
      
      return () => {
        // Cleanup
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
      }
    } else if (window.pdfjsLib) {
      // Already loaded
      setPdfjsLib(window.pdfjsLib)
      setPdfLibLoading(false)
    }
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/skills')
      const data = await response.json()
      if (data.success) {
        setSkills(data.skills)
      }
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingSkill ? `/api/skills/${editingSkill._id}` : '/api/skills'
      const method = editingSkill ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.success) {
        fetchSkills()
        resetForm()
      }
    } catch (error) {
      console.error('Error saving skill:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this skill?')) return

    try {
      const response = await fetch(`/api/skills/${id}`, { method: 'DELETE' })
      const data = await response.json()
      if (data.success) {
        fetchSkills()
      }
    } catch (error) {
      console.error('Error deleting skill:', error)
    }
  }

  const togglePublish = async (id) => {
    try {
      const response = await fetch(`/api/skills/${id}/toggle-publish`, { method: 'PATCH' })
      const data = await response.json()
      if (data.success) {
        fetchSkills()
      }
    } catch (error) {
      console.error('Error toggling publish status:', error)
    }
  }

  const handleEdit = (skill) => {
    setEditingSkill(skill)
    setFormData({
      title: skill.title,
      description: skill.description,
      icon: skill.icon || '',
      certificateImage: skill.certificateImage || '',
      certificateUrl: skill.certificateUrl || '',
      order: skill.order,
      published: skill.published,
    })
    setShowForm(true)
  }

  const handleCertificateUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    console.log('File selected:', file.name, file.type)

    // Check if PDF library is needed and loaded
    if (file.type === 'application/pdf') {
      if (pdfLibLoading) {
        alert('PDF library is still loading. Please wait a moment and try again.')
        e.target.value = ''
        return
      }
      if (!pdfjsLib) {
        alert('PDF library failed to load. Please refresh the page and try again.')
        e.target.value = ''
        return
      }
    }

    setUploading(true)

    try {
      let fileToUpload = file

      // If it's a PDF, convert to image first
      if (file.type === 'application/pdf') {
        console.log('PDF detected, converting to image...')
        fileToUpload = await convertPdfToImage(file)
        console.log('PDF converted successfully')
      }

      const uploadFormData = new FormData()
      uploadFormData.append('file', fileToUpload)

      console.log('Uploading file...')
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await response.json()
      console.log('Upload response:', data)
      
      if (data.success) {
        setFormData(prev => ({ ...prev, certificateImage: data.url }))
        alert('Certificate uploaded successfully!')
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error uploading certificate:', error)
      alert('Error uploading certificate: ' + error.message)
    } finally {
      setUploading(false)
      // Reset file input
      e.target.value = ''
    }
  }

  const handleIconUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await response.json()
      
      if (data.success) {
        setFormData(prev => ({ ...prev, icon: data.url }))
        alert('Icon uploaded successfully!')
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error uploading icon:', error)
      alert('Error uploading icon: ' + error.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const convertPdfToImage = async (pdfFile) => {
    if (!pdfjsLib) {
      throw new Error('PDF library not loaded')
    }
    
    return new Promise(async (resolve, reject) => {
      // Add timeout
      const timeout = setTimeout(() => {
        reject(new Error('PDF conversion timed out after 30 seconds'))
      }, 30000)

      try {
        console.log('Reading PDF file...')
        const arrayBuffer = await pdfFile.arrayBuffer()
        console.log('ArrayBuffer size:', arrayBuffer.byteLength)
        
        console.log('Loading PDF document...')
        const loadingTask = pdfjsLib.getDocument({ 
          data: arrayBuffer,
          verbosity: 0 
        })
        
        loadingTask.onProgress = (progress) => {
          console.log('Loading progress:', progress.loaded, '/', progress.total)
        }
        
        const pdf = await loadingTask.promise
        console.log('PDF loaded, pages:', pdf.numPages)
        
        console.log('Getting first page...')
        const page = await pdf.getPage(1)
        console.log('Page retrieved')

        // Set scale for better quality (2x for high resolution)
        const scale = 2
        const viewport = page.getViewport({ scale })
        console.log('Viewport size:', viewport.width, 'x', viewport.height)

        console.log('Creating canvas...')
        // Create canvas
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = viewport.width
        canvas.height = viewport.height

        console.log('Rendering PDF to canvas...')
        // Render PDF page to canvas
        const renderTask = page.render({
          canvasContext: context,
          viewport: viewport,
        })
        
        await renderTask.promise
        console.log('Rendering complete')

        console.log('Converting to JPEG...')
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          clearTimeout(timeout)
          if (blob) {
            console.log('JPEG created successfully, size:', blob.size)
            // Create a File object from the blob
            const imageFile = new File([blob], pdfFile.name.replace('.pdf', '.jpg'), {
              type: 'image/jpeg',
            })
            resolve(imageFile)
          } else {
            reject(new Error('Failed to convert PDF to image'))
          }
        }, 'image/jpeg', 0.95) // 95% quality
      } catch (error) {
        clearTimeout(timeout)
        console.error('PDF conversion error:', error)
        reject(error)
      }
    })
  }

  const resetForm = () => {
    setEditingSkill(null)
    setShowForm(false)
    setFormData({
      title: '',
      description: '',
      icon: '',
      certificateImage: '',
      certificateUrl: '',
      order: 0,
      published: true,
    })
  }

  // Drag and drop handlers
  const handleDragStart = (e, skill, index) => {
    setDraggedItem({ skill, index })
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

  const handleDrop = async (e, targetSkill, targetIndex) => {
    e.preventDefault()
    
    if (!draggedItem || draggedItem.index === targetIndex) return

    const newSkills = [...skills]
    const [removed] = newSkills.splice(draggedItem.index, 1)
    newSkills.splice(targetIndex, 0, removed)

    // Update order property for all affected skills
    const updatedSkills = newSkills.map((skill, index) => ({
      ...skill,
      order: index
    }))

    setSkills(updatedSkills)

    // Update orders in the database
    try {
      await Promise.all(
        updatedSkills.map(skill =>
          fetch(`/api/skills/${skill._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              title: skill.title,
              description: skill.description,
              icon: skill.icon,
              certificateImage: skill.certificateImage,
              certificateUrl: skill.certificateUrl,
              order: skill.order,
              published: skill.published
            }),
          })
        )
      )
    } catch (error) {
      console.error('Error updating skill order:', error)
      // Revert on error
      fetchSkills()
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Skills</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 border">
          <h2 className="text-xl font-bold mb-4">
            {editingSkill ? 'Edit Skill' : 'Add New Skill'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded h-24"
                required
              />
            </div>

            {/* Icon Upload Section */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-4">Icon (Optional)</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Small Icon/Logo</label>
                  <div className="space-y-2">
                    {formData.icon && (
                      <div className="w-16 h-16 border rounded p-2 bg-gray-50 dark:bg-gray-900">
                        <div
                          dangerouslySetInnerHTML={{ __html: formData.icon }}
                          className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                        />
                      </div>
                    )}
                    <div className="flex gap-2 flex-wrap">
                      <input
                        type="file"
                        accept="image/svg+xml,image/png,image/jpeg,image/webp"
                        onChange={handleIconUpload}
                        className="hidden"
                        id="icon-upload"
                        disabled={uploading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowIconPicker(!showIconPicker)}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Choose Prebuilt
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('icon-upload').click()}
                        disabled={uploading}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Upload Custom'}
                      </Button>
                      {formData.icon && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setFormData({ ...formData, icon: '' })}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    {/* Icon Picker */}
                    {showIconPicker && (
                      <div className="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                        <h4 className="text-sm font-semibold mb-3">Select a Prebuilt Icon</h4>
                        <div className="grid grid-cols-4 gap-3">
                          {Object.entries(PREBUILT_ICONS).map(([name, svg]) => (
                            <button
                              key={name}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, icon: svg })
                                setShowIconPicker(false)
                              }}
                              className="flex flex-col items-center gap-2 p-3 border rounded hover:bg-white dark:hover:bg-gray-800 hover:border-cyan-500 transition-colors group"
                              title={name}
                            >
                              <div
                                dangerouslySetInnerHTML={{ __html: svg }}
                                className="w-12 h-12 [&>svg]:w-full [&>svg]:h-full"
                              />
                              <span className="text-xs text-center text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200">
                                {name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-1">
                      Choose from prebuilt icons or upload your own (SVG, PNG, JPG, WebP). Recommended size: 48x48px or 64x64px.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certificate Upload Section */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-4">Certificate (Optional)</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Certificate Image</label>
                  <div className="space-y-2">
                    {formData.certificateImage && (
                      <div className="relative w-full max-w-md" style={{ paddingBottom: '77.27%' }}>
                        <img
                          src={formData.certificateImage}
                          alt="Certificate Preview"
                          className="absolute inset-0 w-full h-full object-contain rounded border bg-gray-50 dark:bg-gray-900"
                        />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleCertificateUpload}
                        className="hidden"
                        id="certificate-upload"
                        disabled={uploading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('certificate-upload').click()}
                        disabled={uploading}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading ? 'Converting & Uploading...' : 'Upload Certificate (Image or PDF)'}
                      </Button>
                      {formData.certificateImage && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setFormData({ ...formData, certificateImage: '' })}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports images (JPG, PNG) and PDFs. PDFs will be automatically converted to images.
                      {pdfLibLoading && <span className="text-yellow-600"> (PDF support loading...)</span>}
                      {!pdfLibLoading && pdfjsLib && <span className="text-green-600"> ✓ PDF ready</span>}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Certificate URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.certificateUrl}
                    onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="https://..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Link to verify or view the certificate online</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                id="published"
              />
              <label htmlFor="published" className="text-sm font-medium">Published</label>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {editingSkill ? 'Update' : 'Create'} Skill
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {skills.map((skill, index) => (
          <div
            key={skill._id}
            draggable
            onDragStart={(e) => handleDragStart(e, skill, index)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, skill, index)}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border flex gap-6 cursor-move hover:border-cyan-500 transition-colors"
          >
            {/* Drag Handle */}
            <div className="flex items-center text-gray-400">
              <GripVertical className="w-5 h-5" />
            </div>

            {/* Icon and Certificate Preview */}
            <div className="flex flex-col gap-4 flex-shrink-0">
              {/* Icon Preview */}
              {skill.icon && (
                <div className="w-16 h-16 border rounded p-2 bg-gray-50 dark:bg-gray-900">
                  {skill.icon.startsWith('<svg') ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: skill.icon }}
                      className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                    />
                  ) : (
                    <img
                      src={skill.icon}
                      alt={`${skill.title} Icon`}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              )}
              
              {/* Certificate Preview */}
              {skill.certificateImage && (
                <div className="flex-shrink-0 w-40 relative" style={{ paddingBottom: '77.27%' }}>
                  <img
                    src={skill.certificateImage}
                    alt={`${skill.title} Certificate`}
                    className="absolute inset-0 w-full h-full object-contain rounded border bg-gray-50 dark:bg-gray-900"
                  />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-xl font-semibold">{skill.title}</h3>
                {!skill.published && (
                  <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                    Unpublished
                  </span>
                )}
                {skill.icon && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                    With Icon
                  </span>
                )}
                {skill.certificateImage && (
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                    With Certificate
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{skill.description}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <div>Order: {skill.order}</div>
                {skill.certificateUrl && (
                  <div className="flex items-center gap-2">
                    <span>Certificate URL:</span>
                    <a 
                      href={skill.certificateUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline truncate max-w-xs"
                    >
                      {skill.certificateUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 items-start">
              <Button
                size="sm"
                variant="outline"
                onClick={() => togglePublish(skill._id)}
              >
                {skill.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleEdit(skill)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(skill._id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No skills yet. Add your first skill to get started!
        </div>
      )}
    </div>
  )
}
