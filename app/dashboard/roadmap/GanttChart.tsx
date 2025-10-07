'use client'

import { useMemo } from 'react'
import type { SprintWithOutcomes, TimeView } from '@/types/roadmap'
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  format,
  differenceInDays,
  parseISO,
  addDays,
} from 'date-fns'

interface GanttChartProps {
  sprints: SprintWithOutcomes[]
  timeView: TimeView
  onSprintClick: (sprint: SprintWithOutcomes) => void
}

export default function GanttChart({ sprints, timeView, onSprintClick }: GanttChartProps) {
  // Calculate date range
  const dateRange = useMemo(() => {
    if (sprints.length === 0) {
      const today = new Date()
      return {
        start: startOfMonth(today),
        end: endOfMonth(addDays(today, 90)),
      }
    }

    const allDates = sprints.flatMap((s) => [parseISO(s.start_date), parseISO(s.end_date)])
    const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())))
    const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())))

    return {
      start: startOfMonth(minDate),
      end: endOfMonth(maxDate),
    }
  }, [sprints])

  // Generate time columns based on view
  const timeColumns = useMemo(() => {
    switch (timeView) {
      case 'months':
        return eachMonthOfInterval(dateRange).map((date) => ({
          date,
          label: format(date, 'MMM yyyy'),
          width: 120,
        }))
      case 'weeks':
        return eachWeekOfInterval(dateRange, { weekStartsOn: 1 }).map((date) => ({
          date,
          label: format(date, 'MMM d'),
          width: 80,
        }))
      case 'days':
        return eachDayOfInterval(dateRange).map((date) => ({
          date,
          label: format(date, 'd'),
          width: 40,
        }))
    }
  }, [dateRange, timeView])

  // Calculate sprint bar position and width
  const getSprintPosition = (sprint: SprintWithOutcomes) => {
    const sprintStart = parseISO(sprint.start_date)
    const sprintEnd = parseISO(sprint.end_date)
    const totalDays = differenceInDays(dateRange.end, dateRange.start)
    const startOffset = differenceInDays(sprintStart, dateRange.start)
    const duration = differenceInDays(sprintEnd, sprintStart) + 1

    const columnWidth = timeColumns[0]?.width || 80
    const totalWidth = timeColumns.length * columnWidth

    return {
      left: (startOffset / totalDays) * totalWidth,
      width: (duration / totalDays) * totalWidth,
    }
  }

  // Calculate completion percentage
  const getCompletionRate = (sprint: SprintWithOutcomes) => {
    const allTodos = sprint.outcomes.flatMap((o) => o.todos)
    if (allTodos.length === 0) return 0
    const completed = allTodos.filter((t) => t.completed).length
    return (completed / allTodos.length) * 100
  }

  const totalWidth = timeColumns.reduce((sum, col) => sum + col.width, 0)

  return (
    <div className="bg-white rounded-lg shadow-yellow border border-gray-200 overflow-hidden">
      {/* Timeline Header */}
      <div className="border-b border-gray-200 bg-gray-50 overflow-x-auto">
        <div className="flex" style={{ minWidth: `${totalWidth + 200}px` }}>
          <div className="w-[200px] flex-shrink-0 px-4 py-3 font-semibold text-sm text-charcoal-dark border-r border-gray-200">
            Sprint Name
          </div>
          <div className="flex">
            {timeColumns.map((col, index) => (
              <div
                key={index}
                className="border-r border-gray-200 px-2 py-3 text-xs text-center text-charcoal-light font-medium"
                style={{ width: `${col.width}px` }}
              >
                {col.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gantt Rows */}
      <div className="overflow-x-auto">
        {sprints.length === 0 ? (
          <div className="p-12 text-center text-charcoal-light">
            <p className="text-lg mb-2">No sprints yet</p>
            <p className="text-sm">Create your first sprint to get started</p>
          </div>
        ) : (
          <div style={{ minWidth: `${totalWidth + 200}px` }}>
            {sprints.map((sprint) => {
              const position = getSprintPosition(sprint)
              const completionRate = getCompletionRate(sprint)
              const todoCount = sprint.outcomes.reduce((sum, o) => sum + o.todos.length, 0)

              return (
                <div
                  key={sprint.id}
                  className="flex border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {/* Sprint Name Column */}
                  <div className="w-[200px] flex-shrink-0 px-4 py-4 border-r border-gray-200">
                    <div className="text-sm font-medium text-charcoal-dark mb-1">
                      {sprint.name}
                    </div>
                    <div className="text-xs text-charcoal-light">
                      {sprint.outcomes.length} outcomes • {todoCount} tasks
                    </div>
                    <div className="text-xs text-charcoal-light mt-1">
                      {format(parseISO(sprint.start_date), 'MMM d')} -{' '}
                      {format(parseISO(sprint.end_date), 'MMM d, yyyy')}
                    </div>
                  </div>

                  {/* Timeline Column */}
                  <div className="flex-1 relative py-4" style={{ height: '80px' }}>
                    {/* Gantt Bar */}
                    <button
                      onClick={() => onSprintClick(sprint)}
                      className="absolute top-1/2 -translate-y-1/2 h-12 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer group"
                      style={{
                        left: `${position.left}px`,
                        width: `${position.width}px`,
                        backgroundColor: sprint.color,
                      }}
                    >
                      {/* Progress Bar */}
                      <div
                        className="absolute inset-0 bg-white/30 rounded-lg transition-all"
                        style={{ width: `${completionRate}%` }}
                      />

                      {/* Sprint Label */}
                      <div className="relative h-full flex items-center justify-center px-3">
                        <span className="text-xs font-semibold text-white truncate">
                          {sprint.name}
                        </span>
                      </div>

                      {/* Tooltip on Hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="bg-charcoal-dark text-white text-xs rounded px-3 py-2 whitespace-nowrap shadow-lg">
                          <div className="font-semibold mb-1">{sprint.name}</div>
                          <div>{completionRate.toFixed(0)}% complete</div>
                          <div>
                            {sprint.outcomes.length} outcomes, {todoCount} tasks
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
