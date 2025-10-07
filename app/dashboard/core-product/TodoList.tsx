'use client'

import { useState } from 'react'
import type { GoalTodo } from '@/types/product-vision'
import {
  updateTodoCompleted,
  updateTodoDescription,
  createTodo,
  deleteTodo,
} from '@/lib/supabase/mutations'

interface TodoListProps {
  todos: GoalTodo[]
  goalId: string
  onUpdate: () => void
}

export default function TodoList({ todos, goalId, onUpdate }: TodoListProps) {
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [newTodoText, setNewTodoText] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleCheckboxChange = async (todoId: string, completed: boolean) => {
    try {
      await updateTodoCompleted(todoId, completed)
      onUpdate()
    } catch (error) {
      console.error('Failed to update todo:', error)
      // Revert on error
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

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-charcoal-dark uppercase tracking-wide">To-Do</p>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-xs px-3 py-1 bg-primary-yellow-light text-charcoal-dark rounded hover:bg-primary-yellow transition-colors font-medium"
          >
            + Add To-Do
          </button>
        )}
      </div>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-start space-x-3 group">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={(e) => handleCheckboxChange(todo.id, e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-yellow focus:ring-primary-yellow cursor-pointer"
            />
            {editingTodoId === todo.id ? (
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full px-3 py-1 border border-gray-300 rounded focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all text-sm text-charcoal"
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
              <>
                <span
                  className={`text-sm flex-1 ${
                    todo.completed ? 'text-charcoal-light line-through' : 'text-charcoal'
                  }`}
                >
                  {todo.description}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                  <button
                    onClick={() => handleStartEdit(todo)}
                    className="text-xs px-2 py-1 text-charcoal-light hover:text-charcoal hover:bg-gray-100 rounded transition-colors"
                    title="Edit"
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
              </>
            )}
          </li>
        ))}

        {/* Add New To-Do */}
        {isAdding && (
          <li className="flex items-start space-x-3">
            <div className="mt-1 h-4 w-4" /> {/* Spacer for alignment */}
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                className="w-full px-3 py-1 border border-gray-300 rounded focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all text-sm text-charcoal"
                placeholder="New to-do description..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTodo()
                  if (e.key === 'Escape') {
                    setIsAdding(false)
                    setNewTodoText('')
                  }
                }}
              />
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleAddTodo}
                  disabled={isSaving || !newTodoText.trim()}
                  className="text-xs px-3 py-1 bg-primary-yellow text-charcoal-dark rounded hover:bg-primary-yellow-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Adding...' : 'Add'}
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false)
                    setNewTodoText('')
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

      {todos.length === 0 && !isAdding && (
        <p className="text-sm text-charcoal-light italic">No to-dos yet. Click &quot;Add To-Do&quot; to create one.</p>
      )}
    </div>
  )
}
