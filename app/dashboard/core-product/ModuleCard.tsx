'use client'

import { useState } from 'react'
import type { ModuleWithGoals } from '@/types/product-vision'

interface ModuleCardProps {
  module: ModuleWithGoals
}

export default function ModuleCard({ module }: ModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow-yellow-lg overflow-hidden hover:shadow-yellow-xl transition-all duration-200">
      {/* Module Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 bg-accent-yellow border-b border-primary-yellow flex items-center justify-between hover:bg-primary-yellow-light transition-colors"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">
            {module.name === 'Submittals' && '📋'}
            {module.name === 'Materials' && '📦'}
            {module.name === 'Schedule' && '📅'}
            {module.name === 'Delivery' && '🚚'}
          </span>
          <h3 className="text-lg font-semibold text-charcoal-dark">{module.name}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs px-2 py-1 bg-white rounded-full text-charcoal">
            {module.goals.length} {module.goals.length === 1 ? 'goal' : 'goals'}
          </span>
          <span className={`text-charcoal transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>

      {/* Module Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Challenge Section */}
          <div>
            <h4 className="text-sm font-semibold text-charcoal-dark mb-2 flex items-center">
              <span className="mr-2">🎯</span>
              Challenge
            </h4>
            <p className="text-sm text-charcoal leading-relaxed bg-gray-50 p-3 rounded-lg">
              {module.challenge}
            </p>
          </div>

          {/* Goals Section */}
          <div>
            <h4 className="text-sm font-semibold text-charcoal-dark mb-3 flex items-center">
              <span className="mr-2">✨</span>
              Krane Solution Goals
            </h4>
            <div className="space-y-4">
              {module.goals.map((goal, index) => (
                <div
                  key={goal.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-yellow transition-colors"
                >
                  {/* Goal Title */}
                  <div className="flex items-start space-x-2 mb-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-yellow text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <h5 className="text-sm font-semibold text-charcoal-dark flex-1">
                      {goal.title}
                    </h5>
                  </div>

                  {/* Current State */}
                  {goal.current_state && (
                    <div className="mb-3 pl-8">
                      <p className="text-xs font-medium text-charcoal-light mb-1">Current State:</p>
                      <p className="text-xs text-charcoal bg-blue-50 p-2 rounded">
                        {goal.current_state}
                      </p>
                    </div>
                  )}

                  {/* Gap */}
                  {goal.gap && (
                    <div className="mb-3 pl-8">
                      <p className="text-xs font-medium text-charcoal-light mb-1">Gap:</p>
                      <p className="text-xs text-charcoal bg-yellow-50 p-2 rounded">
                        {goal.gap}
                      </p>
                    </div>
                  )}

                  {/* To-Dos */}
                  {goal.todos.length > 0 && (
                    <div className="pl-8">
                      <p className="text-xs font-medium text-charcoal-light mb-2">To-Do:</p>
                      <ul className="space-y-1">
                        {goal.todos.map((todo) => (
                          <li key={todo.id} className="flex items-start space-x-2">
                            <input
                              type="checkbox"
                              checked={todo.completed}
                              readOnly
                              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-yellow focus:ring-primary-yellow cursor-pointer"
                            />
                            <span
                              className={`text-xs ${
                                todo.completed
                                  ? 'text-charcoal-light line-through'
                                  : 'text-charcoal'
                              }`}
                            >
                              {todo.description}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
