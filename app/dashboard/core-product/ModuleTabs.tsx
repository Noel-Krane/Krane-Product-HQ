'use client'

import { useState } from 'react'
import type { ModuleWithGoals } from '@/types/product-vision'

interface ModuleTabsProps {
  modules: ModuleWithGoals[]
}

export default function ModuleTabs({ modules }: ModuleTabsProps) {
  const [activeTab, setActiveTab] = useState(0)

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
            <span>{activeModule.goals.length} Goals</span>
            <span>•</span>
            <span>
              {activeModule.goals.reduce((acc, goal) => acc + goal.todos.length, 0)} To-Dos
            </span>
          </div>
        </div>

        {/* Challenge Section */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-charcoal-dark mb-3 uppercase tracking-wide">
            Challenge
          </h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-charcoal leading-relaxed">
              {activeModule.challenge}
            </p>
          </div>
        </div>

        {/* Goals Section */}
        <div>
          <h3 className="text-sm font-semibold text-charcoal-dark mb-4 uppercase tracking-wide">
            Krane Solution Goals
          </h3>
          <div className="space-y-6">
            {activeModule.goals.map((goal, index) => (
              <div
                key={goal.id}
                className="border border-gray-200 rounded-lg p-6 hover:border-primary-yellow transition-colors"
              >
                {/* Goal Header */}
                <div className="flex items-start space-x-3 mb-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-primary-yellow text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <h4 className="text-base font-semibold text-charcoal-dark flex-1 pt-1">
                    {goal.title}
                  </h4>
                </div>

                {/* Current State */}
                {goal.current_state && (
                  <div className="mb-4 pl-11">
                    <p className="text-xs font-semibold text-charcoal-dark mb-2 uppercase tracking-wide">
                      Current State
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <p className="text-sm text-charcoal leading-relaxed">
                        {goal.current_state}
                      </p>
                    </div>
                  </div>
                )}

                {/* Gap */}
                {goal.gap && (
                  <div className="mb-4 pl-11">
                    <p className="text-xs font-semibold text-charcoal-dark mb-2 uppercase tracking-wide">
                      Gap
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <p className="text-sm text-charcoal leading-relaxed">
                        {goal.gap}
                      </p>
                    </div>
                  </div>
                )}

                {/* To-Dos */}
                {goal.todos.length > 0 && (
                  <div className="pl-11">
                    <p className="text-xs font-semibold text-charcoal-dark mb-3 uppercase tracking-wide">
                      To-Do
                    </p>
                    <ul className="space-y-2">
                      {goal.todos.map((todo) => (
                        <li key={todo.id} className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            readOnly
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-yellow focus:ring-primary-yellow cursor-pointer"
                          />
                          <span
                            className={`text-sm flex-1 ${
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
    </div>
  )
}
