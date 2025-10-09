'use client'

import { useState } from 'react'
import type { ProjectWithCriteria } from '@/types/projects'
import { updateProject, deleteProject } from '@/lib/supabase/projects-mutations'
import { useRouter } from 'next/navigation'
import SuccessCriteriaList from './SuccessCriteriaList'

interface ProjectTabsProps {
  projects: ProjectWithCriteria[]
}

export default function ProjectTabs({ projects }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState(0)
  const router = useRouter()

  if (projects.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-yellow-lg p-12 text-center">
        <h2 className="text-xl font-semibold text-charcoal-dark mb-2">No Projects Found</h2>
        <p className="text-charcoal-light mb-6">
          Get started by creating your first project.
        </p>
      </div>
    )
  }

  const activeProject = projects[activeTab]

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white rounded-t-lg shadow-yellow">
        <nav className="flex -mb-px overflow-x-auto" aria-label="Tabs">
          {projects.map((project, index) => (
            <button
              key={project.id}
              onClick={() => setActiveTab(index)}
              className={`
                flex-shrink-0 py-4 px-6 text-center border-b-2 font-medium text-sm transition-all
                ${
                  activeTab === index
                    ? 'border-primary-yellow text-primary-yellow bg-accent-yellow'
                    : 'border-transparent text-charcoal hover:text-charcoal-dark hover:border-gray-300'
                }
              `}
            >
              {project.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-lg shadow-yellow-lg p-8">
        {/* Project Header */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-charcoal-dark mb-1">{activeProject.name}</h2>
              {activeProject.company_name && (
                <p className="text-sm text-charcoal-light mb-2">
                  Company: {activeProject.company_name}
                </p>
              )}
              <div className="flex items-center space-x-2 text-sm text-charcoal-light">
                <span>{activeProject.criteria.length} Success Criteria</span>
                <span>•</span>
                <span>
                  {activeProject.criteria.filter((c) => c.completed).length} Completed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Description Section */}
        <ProjectDescriptionSection project={activeProject} onUpdate={() => router.refresh()} />

        {/* Success Criteria Section */}
        <div className="mt-8">
          <SuccessCriteriaList
            criteria={activeProject.criteria}
            projectId={activeProject.id}
            onUpdate={() => router.refresh()}
          />
        </div>

        {/* Delete Project Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <DeleteProjectButton project={activeProject} onUpdate={() => router.refresh()} />
        </div>
      </div>
    </div>
  )
}

// Project Description Section Component
function ProjectDescriptionSection({
  project,
  onUpdate,
}: {
  project: ProjectWithCriteria
  onUpdate: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [description, setDescription] = useState(project.description || '')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    try {
      await updateProject(project.id, { description })
      setIsEditing(false)
      onUpdate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setDescription(project.description || '')
    setIsEditing(false)
    setError(null)
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-charcoal-dark uppercase tracking-wide">
          Description
        </p>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs px-3 py-1 bg-primary-yellow-light text-charcoal-dark rounded hover:bg-primary-yellow transition-colors font-medium"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all text-sm text-charcoal"
            placeholder="Project description..."
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="text-xs px-3 py-1 bg-primary-yellow text-charcoal-dark rounded hover:bg-primary-yellow-dark transition-colors font-medium disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="text-xs px-3 py-1 bg-gray-200 text-charcoal-dark rounded hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-charcoal whitespace-pre-wrap">
          {project.description || 'No description provided.'}
        </p>
      )}
    </div>
  )
}

// Delete Project Button Component
function DeleteProjectButton({
  project,
  onUpdate,
}: {
  project: ProjectWithCriteria
  onUpdate: () => void
}) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete "${project.name}"? This will also delete all success criteria.`
      )
    )
      return

    setIsDeleting(true)
    try {
      await deleteProject(project.id)
      onUpdate()
    } catch (error) {
      console.error('Failed to delete project:', error)
      alert('Failed to delete project. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isDeleting ? 'Deleting...' : 'Delete Project'}
    </button>
  )
}
