'use client'

import { useState, useEffect } from 'react'
import type { SuccessCriterion } from '@/types/projects'
import {
  updateSuccessCriterion,
  createSuccessCriterion,
  deleteSuccessCriterion,
} from '@/lib/supabase/projects-mutations'

interface SuccessCriteriaListProps {
  criteria: SuccessCriterion[]
  projectId: string
  onUpdate: () => void
}

export default function SuccessCriteriaList({
  criteria,
  projectId,
  onUpdate,
}: SuccessCriteriaListProps) {
  const [editingCriterionId, setEditingCriterionId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [newCriterionText, setNewCriterionText] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [localCriteria, setLocalCriteria] = useState<SuccessCriterion[]>(criteria)

  useEffect(() => {
    setLocalCriteria(criteria)
  }, [criteria])

  const handleCheckboxChange = async (criterionId: string, completed: boolean) => {
    // Optimistic UI update
    setLocalCriteria((prev) =>
      prev.map((criterion) => (criterion.id === criterionId ? { ...criterion, completed } : criterion))
    )
    try {
      await updateSuccessCriterion(criterionId, { completed })
      onUpdate() // Refresh parent data
    } catch (error) {
      console.error('Failed to update criterion:', error)
      onUpdate() // Revert on error by re-fetching
    }
  }

  const handleStartEdit = (criterion: SuccessCriterion) => {
    setEditingCriterionId(criterion.id)
    setEditText(criterion.description)
  }

  const handleSaveEdit = async (criterionId: string) => {
    if (!editText.trim()) return

    setIsSaving(true)
    try {
      await updateSuccessCriterion(criterionId, { description: editText })
      setEditingCriterionId(null)
      onUpdate()
    } catch (error) {
      console.error('Failed to update criterion:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingCriterionId(null)
    setEditText('')
  }

  const handleAddCriterion = async () => {
    if (!newCriterionText.trim()) return

    setIsSaving(true)
    try {
      const nextOrder = localCriteria.length > 0 ? Math.max(...localCriteria.map((c) => c.order_index)) + 1 : 1
      await createSuccessCriterion({
        project_id: projectId,
        description: newCriterionText,
        order_index: nextOrder,
        completed: false,
      })
      setIsAdding(false)
      setNewCriterionText('')
      onUpdate()
    } catch (error) {
      console.error('Failed to create criterion:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCriterion = async (criterionId: string) => {
    if (!confirm('Are you sure you want to delete this success criterion?')) return

    try {
      await deleteSuccessCriterion(criterionId)
      onUpdate()
    } catch (error) {
      console.error('Failed to delete criterion:', error)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-charcoal-dark uppercase tracking-wide">
          Success Criteria
        </p>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-xs px-3 py-1 bg-primary-yellow-light text-charcoal-dark rounded hover:bg-primary-yellow transition-colors font-medium"
          >
            + Add Criterion
          </button>
        )}
      </div>

      <ul className="space-y-3">
        {localCriteria.map((criterion) => (
          <li
            key={criterion.id}
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start space-x-3 p-3">
              <input
                type="checkbox"
                checked={criterion.completed}
                onChange={(e) => handleCheckboxChange(criterion.id, e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-yellow focus:ring-primary-yellow cursor-pointer"
              />
              {editingCriterionId === criterion.id ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full px-3 py-1 border border-gray-300 rounded focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all text-sm text-charcoal"
                    placeholder="Criterion description..."
                    autoFocus
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSaveEdit(criterion.id)}
                      disabled={isSaving}
                      className="text-xs px-3 py-1 bg-primary-yellow text-charcoal-dark rounded hover:bg-primary-yellow-dark transition-colors font-medium disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="text-xs px-3 py-1 bg-gray-200 text-charcoal-dark rounded hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm flex-1 ${
                        criterion.completed ? 'text-charcoal-light line-through' : 'text-charcoal'
                      }`}
                    >
                      {criterion.description}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 ml-4">
                      <button
                        onClick={() => handleStartEdit(criterion)}
                        className="text-xs px-2 py-1 text-charcoal-light hover:text-charcoal hover:bg-gray-100 rounded transition-colors"
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCriterion(criterion.id)}
                        className="text-xs px-2 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}

        {/* Add New Criterion */}
        {isAdding && (
          <li className="flex items-start space-x-3 bg-white rounded-lg shadow-sm p-3">
            <div className="mt-1 h-4 w-4" /> {/* Spacer for alignment */}
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={newCriterionText}
                onChange={(e) => setNewCriterionText(e.target.value)}
                className="w-full px-3 py-1 border border-gray-300 rounded focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all text-sm text-charcoal"
                placeholder="New success criterion..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCriterion()
                  if (e.key === 'Escape') {
                    setIsAdding(false)
                    setNewCriterionText('')
                  }
                }}
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleAddCriterion}
                  disabled={isSaving || !newCriterionText.trim()}
                  className="text-xs px-3 py-1 bg-primary-yellow text-charcoal-dark rounded hover:bg-primary-yellow-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Adding...' : 'Add'}
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false)
                    setNewCriterionText('')
                  }}
                  disabled={isSaving}
                  className="text-xs px-3 py-1 bg-gray-200 text-charcoal-dark rounded hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </li>
        )}
      </ul>

      {localCriteria.length === 0 && !isAdding && (
        <p className="text-sm text-charcoal-light italic mt-4">
          No success criteria yet. Click &quot;+ Add Criterion&quot; to create one.
        </p>
      )}
    </div>
  )
}

