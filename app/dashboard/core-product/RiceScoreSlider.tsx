'use client'

import { useState, useEffect } from 'react'

interface RiceScoreSliderProps {
  reach: number
  impact: number
  confidence: number
  effort: number
  onChange: (scores: { reach: number; impact: number; confidence: number; effort: number }) => void
  disabled?: boolean
}

export default function RiceScoreSlider({
  reach: initialReach,
  impact: initialImpact,
  confidence: initialConfidence,
  effort: initialEffort,
  onChange,
  disabled = false,
}: RiceScoreSliderProps) {
  const [reach, setReach] = useState(initialReach)
  const [impact, setImpact] = useState(initialImpact)
  const [confidence, setConfidence] = useState(initialConfidence)
  const [effort, setEffort] = useState(initialEffort)

  // Calculate RICE score
  const riceScore = effort > 0 ? ((reach * impact * confidence) / effort).toFixed(1) : '0.0'

  // Update parent when values change
  useEffect(() => {
    onChange({ reach, impact, confidence, effort })
  }, [reach, impact, confidence, effort, onChange])

  const sliders = [
    {
      label: 'Reach',
      value: reach,
      setValue: setReach,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      description: 'How many people/items will this impact?',
    },
    {
      label: 'Impact',
      value: impact,
      setValue: setImpact,
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      description: 'How much will it improve things?',
    },
    {
      label: 'Confidence',
      value: confidence,
      setValue: setConfidence,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100',
      description: 'How confident are we? (0-10 = 0-100%)',
    },
    {
      label: 'Effort',
      value: effort,
      setValue: setEffort,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-100',
      description: 'How much work is required? (person-months)',
    },
  ]

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      {/* RICE Score Display */}
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-charcoal-dark uppercase tracking-wide">
          Priority Score (RICE)
        </h4>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-charcoal-light">Score:</span>
          <span className="text-2xl font-bold text-primary-yellow">{riceScore}</span>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        {sliders.map((slider) => (
          <div key={slider.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-charcoal-dark">
                {slider.label}
              </label>
              <span className="text-sm font-semibold text-charcoal px-2 py-0.5 bg-white rounded border border-gray-300 min-w-[2rem] text-center">
                {slider.value}
              </span>
            </div>
            
            {/* Custom Slider */}
            <div className="relative">
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={slider.value}
                onChange={(e) => slider.setValue(Number(e.target.value))}
                disabled={disabled}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: `linear-gradient(to right, ${slider.color.replace('bg-', '#')} 0%, ${slider.color.replace('bg-', '#')} ${slider.value * 10}%, ${slider.lightColor.replace('bg-', '#')} ${slider.value * 10}%, ${slider.lightColor.replace('bg-', '#')} 100%)`,
                }}
              />
              {/* Tick marks */}
              <div className="flex justify-between mt-1 px-0.5">
                {[0, 2, 4, 6, 8, 10].map((tick) => (
                  <span key={tick} className="text-xs text-gray-400">
                    {tick}
                  </span>
                ))}
              </div>
            </div>
            
            <p className="text-xs text-charcoal-light italic">{slider.description}</p>
          </div>
        ))}
      </div>

      {/* Formula Explanation */}
      <div className="mt-4 pt-4 border-t border-gray-300">
        <p className="text-xs text-charcoal-light text-center">
          <span className="font-mono bg-white px-2 py-1 rounded border border-gray-300">
            RICE = (Reach × Impact × Confidence) ÷ Effort
          </span>
        </p>
        <p className="text-xs text-charcoal-light text-center mt-2">
          Higher scores = Higher priority
        </p>
      </div>
    </div>
  )
}
