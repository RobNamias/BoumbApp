import React, { useMemo } from 'react'
import StepCell from '../../molecules/StepCell'
import { usePlaybackStore } from '../../../store/usePlaybackStore'
import '../../../styles/components/_sequencer.scss'

export interface Step {
  active: boolean
  value: number
  volume?: number
  fill?: number
}

export interface SequencerProps {
  steps?: (Step | number)[] // Allow generic/legacy steps
  onStepChange?: (index: number, value?: number) => void
  mode?: 'trigger' | 'volume' | 'fill'
}

const Sequencer: React.FC<SequencerProps> = ({ steps = [], onStepChange, mode = 'trigger' }) => {
  const { playingStep } = usePlaybackStore()
  // Ensure we always have AT LEAST 32 steps visuals (8 beats), or usage of provided steps if longer
  const displaySteps = useMemo(() => {
    // Normalize steps to Step objects
    const normalizedSteps: Step[] = steps.map((s) => {
      if (typeof s === 'number') return { active: s > 0, value: s }
      return s
    })

    if (normalizedSteps.length >= 32) return normalizedSteps

    const safeSteps = [...normalizedSteps]
    while (safeSteps.length < 32) {
      safeSteps.push({ active: false, value: 0 })
    }
    return safeSteps
  }, [steps])

  return (
    <div className="sequencer">
      {displaySteps.map((step, index) => (
        <StepCell
          key={index}
          isActive={step.active}
          value={step.value}
          mode={mode}
          isPlaying={playingStep === index}
          isAltBeat={Math.floor(index / 4) % 2 !== 0}
          onClick={() => onStepChange?.(index)}
          onChange={(val) => onStepChange?.(index, val)}
        />
      ))}
    </div>
  )
}

export default Sequencer
