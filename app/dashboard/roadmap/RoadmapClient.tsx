'use client'

import { useState } from 'react'
import type { TimeView, SprintWithOutcomes } from '@/types/roadmap'
import type { GoalTodo } from '@/types/product-vision'
import { useRouter } from 'next/navigation'
import GanttChart from './GanttChart'
import SprintModal from './SprintModal'
import SprintDetailsModal from './SprintDetailsModal'

interface RoadmapClientProps {
  initialSprints: SprintWithOutcomes[]
  initialTodos: GoalTodo[]
}

export default function RoadmapClient({ initialSprints, initialTodos }: RoadmapClientProps) {
  const router = useRouter()
  const [timeView, setTimeView] = useState<TimeView>('weeks')
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false)
  const [selectedSprint, setSelectedSprint] = useState<SprintWithOutcomes | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const handleSprintClick = (sprint: SprintWithOutcomes) => {
    setSelectedSprint(sprint)
    setIsDetailsModalOpen(true)
  }

  const handleUpdate = () => {
    router.refresh()
  }

  const totalTasks = initialSprints.reduce(
    (sum, s) => sum + s.outcomes.reduce((oSum, o) => oSum + o.todos.length, 0),
    0
  )
  const completedTasks = initialSprints.reduce(
    (sum, s) =>
      sum + s.outcomes.reduce((oSum, o) => oSum + o.todos.filter((t) => t.completed).length, 0),
    0
  )

  return (
    <main className="max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal-dark mb-2">Roadmap</h1>
        <p className="text-charcoal-light">Sprint planning and timeline visualization</p>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-lg shadow-yellow p-4 mb-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          {/* Time View Switcher */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-charcoal-dark mr-2">View:</span>
            {(['months', 'weeks', 'days'] as TimeView[]).map((view) => (
              <button
                key={view}
                onClick={() => setTimeView(view)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  timeView === view
                    ? 'bg-primary-yellow text-charcoal-dark'
                    : 'bg-gray-100 text-charcoal hover:bg-gray-200'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6 text-sm">
            <div>
              <span className="text-charcoal-light">Sprints:</span>
              <span className="ml-2 font-semibold text-charcoal-dark">{initialSprints.length}</span>
            </div>
            <div>
              <span className="text-charcoal-light">Tasks:</span>
              <span className="ml-2 font-semibold text-charcoal-dark">
                {completedTasks}/{totalTasks}
              </span>
            </div>
          </div>

          {/* Create Sprint Button */}
          <button
            onClick={() => setIsSprintModalOpen(true)}
            className="px-6 py-2 bg-primary-yellow text-charcoal-dark rounded-lg hover:bg-primary-yellow-dark transition-colors font-medium"
          >
            + Create Sprint
          </button>
        </div>
      </div>

      {/* Gantt Chart */}
      <GanttChart sprints={initialSprints} timeView={timeView} onSprintClick={handleSprintClick} />

      {/* Empty State */}
      {initialSprints.length === 0 && (
        <div className="bg-white rounded-lg shadow-yellow-lg p-12 text-center mt-6">
          <div className="text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-bold text-charcoal-dark mb-2">No Sprints Yet</h2>
          <p className="text-charcoal-light mb-6">
            Create your first sprint to start planning your roadmap
          </p>
          <button
            onClick={() => setIsSprintModalOpen(true)}
            className="px-6 py-3 bg-primary-yellow text-charcoal-dark rounded-lg hover:bg-primary-yellow-dark transition-colors font-medium"
          >
            Create First Sprint
          </button>
        </div>
      )}

      {/* Modals */}
      <SprintModal
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        onSuccess={handleUpdate}
      />

      <SprintDetailsModal
        sprint={selectedSprint}
        availableTodos={initialTodos}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedSprint(null)
        }}
        onUpdate={handleUpdate}
      />
    </main>
  )
}
