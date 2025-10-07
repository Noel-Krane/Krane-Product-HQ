'use client'

import { useState } from 'react'
import type { Sprint } from '@/types/roadmap'
import { createSprint, updateSprint } from '@/lib/supabase/roadmap-mutations'

interface SprintModalProps {
  sprint?: Sprint | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function SprintModal({ sprint, isOpen, onClose, onSuccess }: SprintModalProps) {
  const [name, setName] = useState(sprint?.name || '')
  const [startDate, setStartDate] = useState(sprint?.start_date || '')
  const [endDate, setEndDate] = useState(sprint?.end_date || '')
  const [description, setDescription] = useState(sprint?.description || '')
  const [color, setColor] = useState(sprint?.color || '#F59E0B')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      if (sprint) {
        await updateSprint(sprint.id, { name, start_date: startDate, end_date: endDate, description, color })
      } else {
        await createSprint({ name, start_date: startDate, end_date: endDate, description, color })
      }
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save sprint')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  const colorOptions = [
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F97316' },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-charcoal-dark">
            {sprint ? 'Edit Sprint' : 'Create New Sprint'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Sprint Name */}
          <div>
            <label className="block text-sm font-medium text-charcoal-dark mb-2">
              Sprint Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all"
              placeholder="e.g., Sprint 1, Q1 Launch"
              required
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-dark mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-dark mb-2">
                End Date *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-charcoal-dark mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all"
              placeholder="Optional sprint description..."
              rows={3}
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-charcoal-dark mb-2">
              Color
            </label>
            <div className="flex gap-3">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    color === option.value ? 'ring-4 ring-primary-yellow scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: option.value }}
                  title={option.name}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-2 border border-gray-300 rounded-lg text-charcoal-dark hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-primary-yellow text-charcoal-dark rounded-lg hover:bg-primary-yellow-dark transition-colors font-medium disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : sprint ? 'Update Sprint' : 'Create Sprint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
