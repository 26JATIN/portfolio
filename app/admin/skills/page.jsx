"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload } from 'lucide-react'

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingSkill, setEditingSkill] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [pdfjsLib, setPdfjsLib] = useState(null)
  const [pdfLibLoading, setPdfLibLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
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
      certificateImage: '',
      certificateUrl: '',
      order: 0,
      published: true,
    })
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
        {skills.map((skill) => (
          <div
            key={skill._id}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border flex gap-6"
          >
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
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-xl font-semibold">{skill.title}</h3>
                {!skill.published && (
                  <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                    Unpublished
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
