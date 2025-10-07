'use client'

import { useState } from 'react'
import type { GoalTodo } from '@/types/product-vision'
import {
  updateTodoCompleted,
  updateTodoDescription,
  updateTodoRiceScores,
  createTodo,
  deleteTodo,
} from '@/lib/supabase/mutations'
import RiceScoreSlider from './RiceScoreSlider'

interface TodoListProps {
  todos: GoalTodo[]
  goalId: string
  onUpdate: () => void
}

export default function TodoList({ todos, goalId, onUpdate }: TodoListProps) {
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null)
  const [expandedTodoId, setExpandedTodoId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [newTodoText, setNewTodoText] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Sort todos by RICE score (highest first)
  const sortedTodos = [...todos].sort((a, b) => b.rice_score - a.rice_score)

  const handleCheckboxChange = async (todoId: string, completed: boolean) => {
    try {
      await updateTodoCompleted(todoId, completed)
      onUpdate()
    } catch (error) {
      console.error('Failed to update todo:', error)
      onUpdate()
    }
  }

  const handleStartEdit = (todo: GoalTodo) => {
    setEditingTodoId(todo.id)
    setEditText(todo.description)
  }

  const handleSaveEdit = async (todoId: string) => {
    if (!editText.trim()) return

    setIsSaving(true)
    try {
      await updateTodoDescription(todoId, editText)
      setEditingTodoId(null)
      onUpdate()
    } catch (error) {
      console.error('Failed to update todo:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingTodoId(null)
    setEditText('')
  }

  const handleRiceScoreChange = async (
    todoId: string,
    scores: { reach: number; impact: number; confidence: number; effort: number }
  ) => {
    try {
      await updateTodoRiceScores(todoId, scores)
      onUpdate()
    } catch (error) {
      console.error('Failed to update RICE scores:', error)
    }
  }

  const handleAddTodo = async () => {
    if (!newTodoText.trim()) return

    setIsSaving(true)
    try {
      const nextOrder = todos.length > 0 ? Math.max(...todos.map((t) => t.order)) + 1 : 1
      await createTodo(goalId, newTodoText, nextOrder)
      setIsAdding(false)
      setNewTodoText('')
      onUpdate()
    } catch (error) {
      console.error('Failed to create todo:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteTodo = async (todoId: string) => {
    if (!confirm('Are you sure you want to delete this to-do?')) return

    try {
      await deleteTodo(todoId)
      onUpdate()
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  const toggleExpand = (todoId: string) => {
    setExpandedTodoId(expandedTodoId === todoId ? null : todoId)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-charcoal-dark uppercase tracking-wide">
          To-Do (Sorted by Priority)
        </p>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-xs px-3 py-1 bg-primary-yellow-light text-charcoal-dark rounded hover:bg-primary-yellow transition-colors font-medium"
          >
            + Add To-Do
          </button>
        )}
      </div>

      <ul className="space-y-3">
        {sortedTodos.map((todo, index) => (
          <li
            key={todo.id}
            className="border border-gray-200 rounded-lg p-3 hover:border-primary-yellow transition-colors bg-white"
          >
            <div className="flex items-start space-x-3">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={(e) => handleCheckboxChange(todo.id, e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-yellow focus:ring-primary-yellow cursor-pointer flex-shrink-0"
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Description */}
                {editingTodoId === todo.id ? (
                  <div className="space-y-2 mb-3">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all text-sm text-charcoal"
                      placeholder="To-do description..."
                      autoFocus
                    />
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleSaveEdit(todo.id)}
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
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start space-x-2 flex-1">
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-primary-yellow text-white rounded-full text-xs font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span
                        className={`text-sm ${
                          todo.completed ? 'text-charcoal-light line-through' : 'text-charcoal'
                        }`}
                      >
                        {todo.description}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <button
                        onClick={() => handleStartEdit(todo)}
                        className="text-xs px-2 py-1 text-charcoal-light hover:text-charcoal hover:bg-gray-100 rounded transition-colors"
                        title="Edit description"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="text-xs px-2 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}

                {/* RICE Score Badge */}
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-charcoal-light">Priority Score:</span>
                    <span className="text-sm font-bold text-primary-yellow">
                      {todo.rice_score.toFixed(1)}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleExpand(todo.id)}
                    className="text-xs px-3 py-1 bg-gray-100 text-charcoal-dark rounded hover:bg-gray-200 transition-colors font-medium"
                  >
                    {expandedTodoId === todo.id ? '▼ Hide Scoring' : '▶ Adjust Priority'}
                  </button>
                </div>

                {/* Expandable RICE Scoring */}
                {expandedTodoId === todo.id && (
                  <div className="mt-3">
                    <RiceScoreSlider
                      reach={todo.reach}
                      impact={todo.impact}
                      confidence={todo.confidence}
                      effort={todo.effort}
                      onChange={(scores) => handleRiceScoreChange(todo.id, scores)}
                    />
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}

        {/* Add New To-Do */}
        {isAdding && (
          <li className="border border-primary-yellow rounded-lg p-4 bg-accent-yellow">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-charcoal-dark">New To-Do</h4>
              <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all text-sm text-charcoal"
                placeholder="Enter to-do description..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTodo()
                  if (e.key === 'Escape') {
                    setIsAdding(false)
                    setNewTodoText('')
                  }
                }}
              />
              <p className="text-xs text-charcoal-light italic">
                Default priority scores (5/10) will be applied. You can adjust them after creating.
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleAddTodo}
                  disabled={isSaving || !newTodoText.trim()}
                  className="text-xs px-4 py-2 bg-primary-yellow text-charcoal-dark rounded hover:bg-primary-yellow-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Adding...' : 'Add To-Do'}
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false)
                    setNewTodoText('')
                  }}
                  disabled={isSaving}
                  className="text-xs px-4 py-2 bg-gray-200 text-charcoal-dark rounded hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </li>
        )}
      </ul>

      {todos.length === 0 && !isAdding && (
        <p className="text-sm text-charcoal-light italic">
          No to-dos yet. Click &quot;Add To-Do&quot; to create one.
        </p>
      )}
    </div>
  )
}