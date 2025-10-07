'use client'

import { useState } from 'react'
import type { ModuleWithGoals, GoalWithTodos } from '@/types/product-vision'
import { updateModuleChallenge, updateGoal } from '@/lib/supabase/mutations'
import { useRouter } from 'next/navigation'
import TodoList from './TodoList'

interface ModuleTabsProps {
  modules: ModuleWithGoals[]
}

export default function ModuleTabs({ modules }: ModuleTabsProps) {
  const [activeTab, setActiveTab] = useState(0)
  const router = useRouter()

  if (modules.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-yellow-lg p-12 text-center">
        <h2 className="text-xl font-semibold text-charcoal-dark mb-2">
          No Modules Found
        </h2>
        <p className="text-charcoal-light">
          Please check your database connection or seed the initial data.
        </p>
      </div>
    )
  }

  const activeModule = modules[activeTab]

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white rounded-t-lg shadow-yellow">
        <nav className="flex -mb-px" aria-label="Tabs">
          {modules.map((module, index) => (
            <button
              key={module.id}
              onClick={() => setActiveTab(index)}
              className={`
                flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm transition-all
                ${
                  activeTab === index
                    ? 'border-primary-yellow text-primary-yellow bg-accent-yellow'
                    : 'border-transparent text-charcoal hover:text-charcoal-dark hover:border-gray-300'
                }
              `}
            >
              {module.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-lg shadow-yellow-lg p-8">
        {/* Module Header */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-charcoal-dark mb-2">
            {activeModule.name}
          </h2>
          <div className="flex items-center space-x-2 text-sm text-charcoal-light">
            <span>{activeModule.goals.length} Initiatives</span>
            <span>•</span>
            <span>
              {activeModule.goals.reduce((acc, goal) => acc + goal.todos.length, 0)} To-Dos
            </span>
          </div>
        </div>

        {/* Challenge Section */}
        <ChallengeSection module={activeModule} onUpdate={() => router.refresh()} />

        {/* Initiatives Section */}
        <div>
          <h3 className="text-sm font-semibold text-charcoal-dark mb-4 uppercase tracking-wide">
            Krane Solution Initiatives
          </h3>
          <div className="space-y-6">
            {activeModule.goals.map((goal, index) => (
              <GoalSection
                key={goal.id}
                goal={goal}
                index={index}
                onUpdate={() => router.refresh()}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Challenge Section Component
function ChallengeSection({
  module,
  onUpdate,
}: {
  module: ModuleWithGoals
  onUpdate: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [challenge, setChallenge] = useState(module.challenge)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    try {
      await updateModuleChallenge(module.id, challenge)
      setIsEditing(false)
      onUpdate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setChallenge(module.challenge)
    setIsEditing(false)
    setError(null)
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-charcoal-dark uppercase tracking-wide">
          Challenge
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs px-3 py-1 bg-primary-yellow text-charcoal-dark rounded hover:bg-primary-yellow-dark transition-colors font-medium"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            className="w-full min-h-[100px] px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all text-sm text-charcoal"
            placeholder="Enter challenge description..."
          />
          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-primary-yellow text-charcoal-dark rounded hover:bg-primary-yellow-dark transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-200 text-charcoal-dark rounded hover:bg-gray-300 transition-colors font-medium text-sm disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-charcoal leading-relaxed">{module.challenge}</p>
        </div>
      )}
    </div>
  )
}

// Goal Section Component
function GoalSection({
  goal,
  index,
  onUpdate,
}: {
  goal: GoalWithTodos
  index: number
  onUpdate: () => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(goal.title)
  const [currentState, setCurrentState] = useState(goal.current_state || '')
  const [gap, setGap] = useState(goal.gap || '')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    try {
      await updateGoal(goal.id, {
        title,
        current_state: currentState,
        gap,
      })
      setIsEditing(false)
      onUpdate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setTitle(goal.title)
    setCurrentState(goal.current_state || '')
    setGap(goal.gap || '')
    setIsEditing(false)
    setError(null)
  }

  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:border-primary-yellow transition-colors">
      {/* Initiative Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <span className="flex-shrink-0 w-8 h-8 bg-primary-yellow text-white rounded-full flex items-center justify-center text-sm font-bold">
            {index + 1}
          </span>
          <div className="flex-1">
            <div className="text-xs font-semibold text-primary-yellow mb-1">
              INITIATIVE #{index + 1}
            </div>
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all text-base font-semibold text-charcoal-dark"
                placeholder="Initiative title..."
              />
            ) : (
              <h4 className="text-base font-semibold text-charcoal-dark">{goal.title}</h4>
            )}
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="ml-4 text-xs px-3 py-1 bg-primary-yellow-light text-charcoal-dark rounded hover:bg-primary-yellow transition-colors font-medium"
          >
            Edit
          </button>
        )}
      </div>

      {/* Current State */}
      <div className="mb-4 pl-11">
        <p className="text-xs font-semibold text-charcoal-dark mb-2 uppercase tracking-wide">
          Current State
        </p>
        {isEditing ? (
          <textarea
            value={currentState}
            onChange={(e) => setCurrentState(e.target.value)}
            className="w-full min-h-[80px] px-3 py-2 border border-blue-300 rounded focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all text-sm text-charcoal bg-blue-50"
            placeholder="Describe current state..."
          />
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-sm text-charcoal leading-relaxed">
              {goal.current_state || 'No current state defined'}
            </p>
          </div>
        )}
      </div>

      {/* Gap */}
      <div className="mb-4 pl-11">
        <p className="text-xs font-semibold text-charcoal-dark mb-2 uppercase tracking-wide">Gap</p>
        {isEditing ? (
          <textarea
            value={gap}
            onChange={(e) => setGap(e.target.value)}
            className="w-full min-h-[80px] px-3 py-2 border border-yellow-300 rounded focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all text-sm text-charcoal bg-yellow-50"
            placeholder="Describe the gap..."
          />
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <p className="text-sm text-charcoal leading-relaxed">{goal.gap || 'No gap defined'}</p>
          </div>
        )}
      </div>

      {/* Save/Cancel Buttons */}
      {isEditing && (
        <div className="pl-11 mb-4">
          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2 mb-3">
              {error}
            </div>
          )}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-primary-yellow text-charcoal-dark rounded hover:bg-primary-yellow-dark transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-200 text-charcoal-dark rounded hover:bg-gray-300 transition-colors font-medium text-sm disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* To-Dos */}
      <div className="pl-11">
        <TodoList todos={goal.todos} goalId={goal.id} onUpdate={onUpdate} />
      </div>
    </div>
  )
}