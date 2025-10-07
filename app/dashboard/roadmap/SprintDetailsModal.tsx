'use client'

import { useState } from 'react'
import type { SprintWithOutcomes } from '@/types/roadmap'
import type { GoalTodo } from '@/types/product-vision'
import {
  createOutcome,
  deleteOutcome,
  addTodoToOutcome,
  removeTodoFromOutcome,
} from '@/lib/supabase/roadmap-mutations'
import { format, parseISO } from 'date-fns'

interface SprintDetailsModalProps {
  sprint: SprintWithOutcomes | null
  availableTodos: GoalTodo[]
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export default function SprintDetailsModal({
  sprint,
  availableTodos,
  isOpen,
  onClose,
  onUpdate,
}: SprintDetailsModalProps) {
  const [isAddingOutcome, setIsAddingOutcome] = useState(false)
  const [newOutcomeName, setNewOutcomeName] = useState('')
  const [selectedOutcomeId, setSelectedOutcomeId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  if (!isOpen || !sprint) return null

  const handleAddOutcome = async () => {
    if (!newOutcomeName.trim()) return

    setIsSaving(true)
    try {
      await createOutcome({
        sprint_id: sprint.id,
        name: newOutcomeName,
        order_index: sprint.outcomes.length,
      })
      setNewOutcomeName('')
      setIsAddingOutcome(false)
      onUpdate()
    } catch (error) {
      console.error('Failed to create outcome:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteOutcome = async (outcomeId: string) => {
    if (!confirm('Are you sure you want to delete this outcome?')) return

    try {
      await deleteOutcome(outcomeId)
      onUpdate()
    } catch (error) {
      console.error('Failed to delete outcome:', error)
    }
  }

  const handleAddTodo = async (outcomeId: string, todoId: string) => {
    try {
      await addTodoToOutcome(outcomeId, todoId)
      onUpdate()
    } catch (error) {
      console.error('Failed to add todo:', error)
    }
  }

  const handleRemoveTodo = async (outcomeId: string, todoId: string) => {
    try {
      await removeTodoFromOutcome(outcomeId, todoId)
      onUpdate()
    } catch (error) {
      console.error('Failed to remove todo:', error)
    }
  }

  const getAvailableTodosForOutcome = (outcomeId: string) => {
    const outcome = sprint.outcomes.find((o) => o.id === outcomeId)
    if (!outcome) return availableTodos

    const assignedTodoIds = outcome.todos.map((t) => t.id)
    return availableTodos.filter((t) => !assignedTodoIds.includes(t.id))
  }

  const totalTodos = sprint.outcomes.reduce((sum, o) => sum + o.todos.length, 0)
  const completedTodos = sprint.outcomes.reduce(
    (sum, o) => sum + o.todos.filter((t) => t.completed).length,
    0
  )
  const completionRate = totalTodos > 0 ? ((completedTodos / totalTodos) * 100).toFixed(0) : '0'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: sprint.color }}
                />
                <h2 className="text-2xl font-bold text-charcoal-dark">{sprint.name}</h2>
              </div>
              <div className="flex items-center space-x-4 text-sm text-charcoal-light">
                <span>
                  {format(parseISO(sprint.start_date), 'MMM d, yyyy')} -{' '}
                  {format(parseISO(sprint.end_date), 'MMM d, yyyy')}
                </span>
                <span>•</span>
                <span>{sprint.outcomes.length} outcomes</span>
                <span>•</span>
                <span>{totalTodos} tasks</span>
                <span>•</span>
                <span className="font-semibold text-primary-yellow">{completionRate}% complete</span>
              </div>
              {sprint.description && (
                <p className="mt-2 text-sm text-charcoal">{sprint.description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-charcoal-light hover:text-charcoal-dark transition-colors text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Outcomes List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-charcoal-dark">Outcomes</h3>
              {!isAddingOutcome && (
                <button
                  onClick={() => setIsAddingOutcome(true)}
                  className="px-4 py-2 bg-primary-yellow text-charcoal-dark rounded-lg hover:bg-primary-yellow-dark transition-colors font-medium text-sm"
                >
                  + Add Outcome
                </button>
              )}
            </div>

            {/* Add Outcome Form */}
            {isAddingOutcome && (
              <div className="mb-4 p-4 bg-accent-yellow rounded-lg border border-primary-yellow">
                <input
                  type="text"
                  value={newOutcomeName}
                  onChange={(e) => setNewOutcomeName(e.target.value)}
                  placeholder="Outcome name..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all mb-3"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddOutcome()
                    if (e.key === 'Escape') {
                      setIsAddingOutcome(false)
                      setNewOutcomeName('')
                    }
                  }}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddOutcome}
                    disabled={isSaving || !newOutcomeName.trim()}
                    className="px-4 py-2 bg-primary-yellow text-charcoal-dark rounded-lg hover:bg-primary-yellow-dark transition-colors font-medium text-sm disabled:opacity-50"
                  >
                    {isSaving ? 'Adding...' : 'Add'}
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingOutcome(false)
                      setNewOutcomeName('')
                    }}
                    className="px-4 py-2 bg-gray-200 text-charcoal-dark rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Outcomes */}
            {sprint.outcomes.length === 0 ? (
              <div className="text-center py-8 text-charcoal-light">
                <p>No outcomes yet. Add your first outcome to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sprint.outcomes.map((outcome, index) => {
                  const isExpanded = selectedOutcomeId === outcome.id
                  const availableTodos = getAvailableTodosForOutcome(outcome.id)

                  return (
                    <div
                      key={outcome.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary-yellow transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3 flex-1">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary-yellow text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-charcoal-dark">{outcome.name}</h4>
                            <p className="text-sm text-charcoal-light mt-1">
                              {outcome.todos.length} tasks •{' '}
                              {outcome.todos.filter((t) => t.completed).length} completed
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              setSelectedOutcomeId(isExpanded ? null : outcome.id)
                            }
                            className="px-3 py-1 text-xs bg-gray-100 text-charcoal-dark rounded hover:bg-gray-200 transition-colors font-medium"
                          >
                            {isExpanded ? 'Hide' : 'Manage'} Tasks
                          </button>
                          <button
                            onClick={() => handleDeleteOutcome(outcome.id)}
                            className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Assigned Todos */}
                      {outcome.todos.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {outcome.todos.map((todo) => (
                            <div
                              key={todo.id}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded"
                            >
                              <div className="flex items-center space-x-2 flex-1">
                                <input
                                  type="checkbox"
                                  checked={todo.completed}
                                  readOnly
                                  className="h-4 w-4 rounded border-gray-300 text-primary-yellow"
                                />
                                <span
                                  className={`text-sm ${
                                    todo.completed
                                      ? 'text-charcoal-light line-through'
                                      : 'text-charcoal'
                                  }`}
                                >
                                  {todo.description}
                                </span>
                                <span className="text-xs text-charcoal-light">
                                  (Score: {todo.rice_score.toFixed(1)})
                                </span>
                              </div>
                              {isExpanded && (
                                <button
                                  onClick={() => handleRemoveTodo(outcome.id, todo.id)}
                                  className="text-xs text-red-600 hover:text-red-700 px-2"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Todo Dropdown */}
                      {isExpanded && availableTodos.length > 0 && (
                        <div className="pt-3 border-t border-gray-200">
                          <p className="text-xs font-medium text-charcoal-dark mb-2">
                            Add tasks to this outcome:
                          </p>
                          <div className="max-h-48 overflow-y-auto space-y-1">
                            {availableTodos.map((todo) => (
                              <button
                                key={todo.id}
                                onClick={() => handleAddTodo(outcome.id, todo.id)}
                                className="w-full text-left px-3 py-2 text-sm bg-white border border-gray-200 rounded hover:border-primary-yellow hover:bg-accent-yellow transition-colors"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="flex-1">{todo.description}</span>
                                  <span className="text-xs text-primary-yellow font-semibold ml-2">
                                    {todo.rice_score.toFixed(1)}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {isExpanded && availableTodos.length === 0 && outcome.todos.length > 0 && (
                        <div className="pt-3 border-t border-gray-200 text-xs text-charcoal-light text-center">
                          All available tasks have been assigned
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
