'use client'

import { useState } from 'react'
import type { TodoWithContext } from '@/lib/supabase/queries'
import { updateTodoCompleted, updateTodoRiceScores } from '@/lib/supabase/mutations'
import RiceScoreSlider from '../core-product/RiceScoreSlider'

interface PriorityTodoCardProps {
  todo: TodoWithContext
  rank: number
  onUpdate: () => void
}

export default function PriorityTodoCard({ todo, rank, onUpdate }: PriorityTodoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleCheckboxChange = async (completed: boolean) => {
    setIsUpdating(true)
    try {
      await updateTodoCompleted(todo.id, completed)
      onUpdate()
    } catch (error) {
      console.error('Failed to update todo:', error)
      onUpdate()
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRiceScoreChange = async (scores: {
    reach: number
    impact: number
    confidence: number
    effort: number
  }) => {
    try {
      await updateTodoRiceScores(todo.id, scores)
      onUpdate()
    } catch (error) {
      console.error('Failed to update RICE scores:', error)
    }
  }

  // Get priority badge color based on score
  const getPriorityColor = (score: number) => {
    if (score >= 50) return 'bg-red-500'
    if (score >= 25) return 'bg-orange-500'
    if (score >= 10) return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  const getPriorityLabel = (score: number) => {
    if (score >= 50) return 'Critical'
    if (score >= 25) return 'High'
    if (score >= 10) return 'Medium'
    return 'Low'
  }

  return (
    <div
      className={`border rounded-lg p-5 transition-all ${
        todo.completed
          ? 'bg-gray-50 border-gray-200 opacity-75'
          : 'bg-white border-gray-300 hover:border-primary-yellow hover:shadow-yellow'
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* Rank Badge */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-primary-yellow flex items-center justify-center">
            <span className="text-xl font-bold text-white">#{rank}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start space-x-3 flex-1">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={(e) => handleCheckboxChange(e.target.checked)}
                disabled={isUpdating}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-primary-yellow focus:ring-primary-yellow cursor-pointer disabled:opacity-50"
              />
              <div className="flex-1">
                <h3
                  className={`text-lg font-semibold mb-1 ${
                    todo.completed ? 'text-gray-400 line-through' : 'text-charcoal-dark'
                  }`}
                >
                  {todo.description}
                </h3>
                <div className="flex items-center space-x-3 text-sm text-charcoal-light">
                  <span className="flex items-center space-x-1">
                    <span className="font-medium">Module:</span>
                    <span>{todo.module_name}</span>
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center space-x-1">
                    <span className="font-medium">Goal:</span>
                    <span>{todo.goal_title}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Priority Badge */}
            <div className="flex flex-col items-end space-y-2 ml-4">
              <div
                className={`${getPriorityColor(
                  todo.rice_score
                )} text-white px-3 py-1 rounded-full text-xs font-bold uppercase`}
              >
                {getPriorityLabel(todo.rice_score)}
              </div>
              <div className="text-right">
                <div className="text-xs text-charcoal-light">Priority Score</div>
                <div className="text-2xl font-bold text-primary-yellow">
                  {todo.rice_score.toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          {/* RICE Metrics Summary */}
          <div className="flex items-center space-x-4 mb-3 text-xs">
            <div className="flex items-center space-x-1">
              <span className="text-charcoal-light">Reach:</span>
              <span className="font-semibold text-blue-600">{todo.reach}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-charcoal-light">Impact:</span>
              <span className="font-semibold text-green-600">{todo.impact}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-charcoal-light">Confidence:</span>
              <span className="font-semibold text-purple-600">{todo.confidence}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-charcoal-light">Effort:</span>
              <span className="font-semibold text-orange-600">{todo.effort}</span>
            </div>
          </div>

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs px-3 py-1.5 bg-gray-100 text-charcoal-dark rounded hover:bg-gray-200 transition-colors font-medium"
          >
            {isExpanded ? '▼ Hide Priority Details' : '▶ Adjust Priority'}
          </button>

          {/* Expandable RICE Scoring */}
          {isExpanded && (
            <div className="mt-4">
              <RiceScoreSlider
                reach={todo.reach}
                impact={todo.impact}
                confidence={todo.confidence}
                effort={todo.effort}
                onChange={handleRiceScoreChange}
                disabled={todo.completed}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
