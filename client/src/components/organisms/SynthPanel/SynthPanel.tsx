import React from 'react'
import styles from '../../../styles/modules/SynthPanel.module.scss'
import Knob from '../../atoms/Knob'
import ADSRGraph from '../../molecules/ADSRGraph'
import { useProjectStore } from '../../../store/projectStore'

import { Triangle, Square, Waves, Activity } from 'lucide-react'

interface SynthPanelProps {
  trackId: string
}

const SynthPanel: React.FC<SynthPanelProps> = ({ trackId }) => {
  const { project, updateTrackInstrument } = useProjectStore()
  const track = project.tracks[trackId]

  if (!track || track.instrument.type !== 'synth' || !track.instrument.synthParams) {
    return <div className="synth-panel--empty">No Synth Track Selected</div>
  }

  const { oscillatorType, envelope } = track.instrument.synthParams

  // Defensive coding: Ensure envelope exists to prevent crash on stale state
  const safeEnvelope = envelope || { attack: 0.05, decay: 0.1, sustain: 0.3, release: 1 }
  const { attack, decay, sustain, release } = safeEnvelope

  // Default filter values
  const safeFilter = track.instrument.synthParams.filter || { type: 'lowpass', rolloff: -24, Q: 1 }
  const safeFilterEnv = track.instrument.synthParams.filterEnvelope || {
    attack: 0.1,
    decay: 0.2,
    sustain: 0.5,
    release: 1,
    baseFrequency: 200,
    octaves: 4,
  }
  const safePortamento = track.instrument.synthParams.portamento || 0

  const handleTypeChange = (type: 'polysynth' | 'monosynth') => {
    updateTrackInstrument(trackId, {
      synthType: type,
      synthParams: {
        ...track.instrument.synthParams!,
        // Apply default monosynth params if switching to mono
        ...(type === 'monosynth' && !track.instrument.synthParams?.filterEnvelope
          ? {
              portamento: 0.05,
              filter: { type: 'lowpass', rolloff: -24, Q: 2 },
              filterEnvelope: {
                attack: 0.05,
                decay: 0.2,
                sustain: 0.2,
                release: 0.5,
                baseFrequency: 150,
                octaves: 4,
              },
            }
          : {}),
      },
    })
  }

  const handleOscChange = (value: string | number) => {
    updateTrackInstrument(trackId, {
      synthParams: {
        ...track.instrument.synthParams!,
        oscillatorType: value as 'triangle' | 'sine' | 'square' | 'sawtooth',
      },
    })
  }

  const handleEnvChange = (param: 'attack' | 'decay' | 'sustain' | 'release', value: number) => {
    updateTrackInstrument(trackId, {
      synthParams: {
        ...track.instrument.synthParams!,
        envelope: {
          ...safeEnvelope,
          [param]: value,
        },
      },
    })
  }

  const handleFilterChange = (param: 'baseFrequency' | 'Q' | 'octaves', value: number) => {
    updateTrackInstrument(trackId, {
      synthParams: {
        ...track.instrument.synthParams!,
        ...(param === 'Q'
          ? { filter: { ...safeFilter, Q: value } }
          : { filterEnvelope: { ...safeFilterEnv, [param]: value } }),
      },
    })
  }

  const handleGlideChange = (value: number) => {
    updateTrackInstrument(trackId, {
      synthParams: {
        ...track.instrument.synthParams!,
        portamento: value,
      },
    })
  }

  const waveforms = [
    { id: 'triangle', icon: <Triangle size={12} fill="currentColor" />, label: 'Tri' },
    { id: 'sine', icon: <Waves size={12} />, label: 'Sin' },
    { id: 'square', icon: <Square size={12} fill="currentColor" />, label: 'Sqr' },
    { id: 'sawtooth', icon: <Activity size={12} />, label: 'Saw' },
  ]

  return (
    <div className={styles.synthPanel}>
      {/* Engine Selector */}
      <div className={styles.engineSelector}>
        <button
          className={track.instrument.synthType === 'polysynth' ? styles.active : ''}
          onClick={() => handleTypeChange('polysynth')}
        >
          Poly (Basic)
        </button>
        <button
          className={track.instrument.synthType === 'monosynth' ? styles.active : ''}
          onClick={() => handleTypeChange('monosynth')}
        >
          Mono (Acid)
        </button>
      </div>

      {/* Body Only: Left (ADSR) | Right (Waveforms) */}
      <div className={styles.body}>
        {/* Left: Graph + Knobs */}
        <div className={styles.adsrSection}>
          <div className={styles.graphContainer}>
            <ADSRGraph
              attack={attack}
              decay={decay}
              sustain={sustain}
              release={release}
              width={160}
              height={40}
              color="#4CAF50"
            />
          </div>
          {/* Aligned Knobs Row */}
          <div className={styles.knobsRow}>
            <Knob
              label="A"
              size={28}
              value={attack}
              min={0.01}
              max={2}
              onChange={(v) => handleEnvChange('attack', v)}
            />
            <Knob
              label="D"
              size={28}
              value={decay}
              min={0.01}
              max={2}
              onChange={(v) => handleEnvChange('decay', v)}
            />
            <Knob
              label="S"
              size={28}
              value={sustain}
              min={0}
              max={1}
              onChange={(v) => handleEnvChange('sustain', v)}
            />
            <Knob
              label="R"
              size={28}
              value={release}
              min={0.01}
              max={4}
              onChange={(v) => handleEnvChange('release', v)}
            />
          </div>
        </div>

        {/* Right: Waveform Selector (Buttons) */}
        <div className={styles.oscSection}>
          {waveforms.map((wf) => (
            <button
              key={wf.id}
              type="button"
              className={`${styles.oscBtn} ${oscillatorType === wf.id ? styles.active : ''}`}
              onClick={() => handleOscChange(wf.id)}
              title={wf.label}
            >
              {wf.icon}
            </button>
          ))}
        </div>
      </div>

      {/* MonoSynth Specific Controls */}
      {track.instrument.synthType === 'monosynth' && (
        <div className={styles.monoSection}>
          <div className={styles.sectionTitle}>Filter & Glide</div>
          <div className={styles.filterKnobs}>
            <Knob
              label="Cutoff"
              size={32}
              value={safeFilterEnv.baseFrequency}
              min={20}
              max={2000}
              onChange={(v) => handleFilterChange('baseFrequency', v)}
            />
            <Knob
              label="Res"
              size={32}
              value={safeFilter.Q}
              min={0}
              max={20}
              onChange={(v) => handleFilterChange('Q', v)}
            />
            <Knob
              label="Env"
              size={32}
              value={safeFilterEnv.octaves}
              min={0}
              max={8}
              onChange={(v) => handleFilterChange('octaves', v)}
            />
            <Knob
              label="Glide"
              size={32}
              value={safePortamento}
              min={0}
              max={1}
              onChange={handleGlideChange}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default SynthPanel
