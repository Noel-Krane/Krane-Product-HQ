'use client'

import { useState } from 'react'
import { createProject } from '@/lib/supabase/projects-mutations'
import { useRouter } from 'next/navigation'

export default function CreateProjectButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!projectName.trim()) {
      setError('Project name is required.')
      return
    }

    setIsSaving(true)
    try {
      await createProject({
        name: projectName,
        company_name: companyName || null,
        description: description || null,
      })
      setIsModalOpen(false)
      setCompanyName('')
      setProjectName('')
      setDescription('')
      router.refresh()
    } catch (err) {
      console.error('Failed to create project:', err)
      setError('Failed to create project. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-5 py-2 bg-primary-yellow text-charcoal-dark rounded-lg hover:bg-primary-yellow-dark transition-colors font-medium shadow-yellow"
      >
        + Create Project
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-charcoal-dark">Create New Project</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label htmlFor="companyName" className="block text-sm font-medium text-charcoal-dark mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all text-charcoal"
                  placeholder="e.g., Acme Corporation"
                  autoFocus
                />
              </div>

              <div className="mb-4">
                <label htmlFor="projectName" className="block text-sm font-medium text-charcoal-dark mb-1">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all text-charcoal"
                  placeholder="e.g., Downtown Office Tower"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-charcoal-dark mb-1"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all text-charcoal"
                  placeholder="Brief description of the project..."
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setCompanyName('')
                    setProjectName('')
                    setDescription('')
                    setError(null)
                  }}
                  className="px-5 py-2 bg-gray-200 text-charcoal-dark rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-yellow text-charcoal-dark rounded-lg hover:bg-primary-yellow-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSaving}
                >
                  {isSaving ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
