import * as Tone from 'tone'
import type { InstrumentConfig, EffectConfig } from '../store/projectStore'
import { usePlaybackStore } from '../store/usePlaybackStore'

import { AudioFactory, type MixerStrip } from './AudioFactory'

export interface AudioNote {
  note: string
  time: string
  duration: string
  velocity: number
  fill?: number // Probability (0-1)
}

// Internal Track representation in Audio Engine
export interface Track {
  id: string
  type: 'sampler' | 'synth'
  sampler?: Tone.Sampler
  loadedSampleUrl?: string // NEW: Store current URL
  polySynth?: Tone.PolySynth
  monoSynth?: Tone.MonoSynth // NEW: MonoSynth support
  part?: Tone.Part
  muteGain: Tone.Gain // Added for explicit muting
  panner: Tone.PanVol // Changed from Tone.Panner to Tone.PanVol for proper Stereo Balance
  destination: Tone.ToneAudioNode // now points to [Input] node of MixerChannel
  // State
  muted: boolean
  solo: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EFFECT_UPDATERS: Record<string, (node: any, params: any) => void> = {
  Reverb: (node, params) => {
    if (params.decay) node.decay = params.decay
    if (params.preDelay) node.preDelay = params.preDelay
  },
  FeedbackDelay: (node, params) => {
    if (params.time) node.delayTime.value = params.time
    if (params.feedback) node.feedback.value = params.feedback
  },
  Distortion: (node, params) => {
    if (params.amount) node.distortion = params.amount
  },
  Chorus: (node, params) => {
    if (params.frequency) node.frequency.value = params.frequency
    if (params.delayTime) node.delayTime = params.delayTime
    if (params.depth) node.depth = params.depth
  },
  BitCrusher: (node, params) => {
    if (params.bits) node.bits.value = params.bits
  },
  AutoFilter: (node, params) => {
    if (params.frequency) node.frequency.value = params.frequency
    if (params.depth) node.depth.value = params.depth
    if (params.baseFrequency) node.baseFrequency = params.baseFrequency
  },
}


class AudioEngine {
  public tracks: Map<string, Track>

  // Mixer Architecture
  // Flow: [Input Gain] -> [FX Chain] -> [PanVol] -> [MuteGain] -> [Split/Meters] -> [Next Stage]

  // 1. MASTER
  public masterInput!: Tone.Gain // Kept for alias logic? actually part of strip now
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public masterStrip: any // Temporarily kept as any to avoid circular dependency or complex refactor
  public masterLimiter!: Tone.Limiter // NEW: Master Limiter (-0.1dB)
  // Legacy mapping helpers (to avoid breaking everything immediately, or we update them)
  // We will update the logic to use masterStrip directly.

  // 2. GROUPS
  public groups: Record<string, MixerStrip> = {}

  // 3. INSERTS
  public inserts: Record<string, MixerStrip> = {}

  // FX Management (Keep references to dispose them)
  // Key: Channel ID (e.g. 'master', 'group-1', 'insert-1')
  public channelEffects: Map<string, Tone.ToneAudioNode[]> = new Map()

  public started: boolean

  constructor() {
    this.tracks = new Map()
    this.started = false

    // --- MAGICAL STABILITY FIX ---
    // 2. Increase Lookahead (Tone.js Scheduling)
    Tone.getContext().lookAhead = 0.2
    
    // Ensure Mixer Strips are ready immediately (offline nodes)
    // This fixes SpectrumAnalyzer connection on mount
    this._ensureChannels()
  }

  /**
   * Ensures Channels exist.
   */
  private _ensureChannels() {
    if (!this.masterStrip) {

      // 1. MASTER
      this.masterStrip = AudioFactory.createMixerStrip('master');
      (this.masterStrip as MixerStrip).muteGain.connect(Tone.getDestination())

      // 2. GROUPS (4)
      ;['group-1', 'group-2', 'group-3', 'group-4'].forEach((id) => {
        const strip = AudioFactory.createMixerStrip(id)
        // Default Routing: Group -> Master Input
        strip.muteGain.connect(this.masterStrip.input)
        this.groups[id] = strip
      })

      // 3. INSERTS (10)
      for (let i = 1; i <= 10; i++) {
        const id = `insert-${i}`
        const strip = AudioFactory.createMixerStrip(id)
        // Default Routing: Insert -> Master Input
        strip.muteGain.connect(this.masterStrip.input)
        this.inserts[id] = strip
      }
    }
  }

  /**
   * Must be called on User Interaction (Click/Play).
   * Starts the Audio Context.
   */
  async initialize(): Promise<boolean> {
    if (this.started) {
      return true
    }
    try {
      this._ensureChannels()
      await Tone.start()
      this.started = true
      return true
    } catch (error) {
      console.error('[AudioEngine] Failed to initialize:', error)
      return false
    }
  }

  // --- Helpers for Input lookup ---
  private _getChannelInput(id: string): Tone.Gain | undefined {
    if (id === 'master') return this.masterStrip?.input
    if (this.groups[id]) return this.groups[id].input
    if (this.inserts[id]) return this.inserts[id].input
    return undefined
  }

  // Generic get Strip helper
  private _getStrip(id: string): MixerStrip | undefined {
    if (id === 'master') return this.masterStrip
    if (this.groups[id]) return this.groups[id]
    if (this.inserts[id]) return this.inserts[id]
    return undefined
  }

  /**
   * Syncs a Track (Generator) to the Audio Engine.
   */
  async syncTrack(config: {
    id: string
    type: 'sampler' | 'synth'
    instrument: InstrumentConfig
    mixerChannelId: string
  }) {
    this._ensureChannels()

    let track = this.tracks.get(config.id)

    // Determine Destination (Input Node of the Mixer Channel)
    const destId = config.mixerChannelId
    const destNode = this._getChannelInput(destId) || this.masterStrip.input

    if (track) {
      // Update Routing if changed
      if (track.destination !== destNode) {
        track.panner.disconnect().connect(destNode)
        track.destination = destNode
      }
    } else {
      // New Track
      const muteGain = new Tone.Gain(1)
      const panner = new Tone.PanVol(0, 0).connect(destNode) // Pan: 0, Vol: 0dB
      muteGain.connect(panner)

      track = {
        id: config.id,
        type: config.type,
        destination: destNode,
        muteGain: muteGain,
        panner: panner,
        muted: false,
        solo: false,
      }
      this.tracks.set(config.id, track)
    }

    // Instrument Init/Swap
    const sampleUrl = config.instrument.sampleId
    const currentSynthType = track.polySynth ? 'polysynth' : (track.monoSynth ? 'monosynth' : undefined)
    const targetSynthType = config.instrument.synthType === 'monosynth' ? 'monosynth' : 'polysynth'
    const synthChanged = config.type === 'synth' && (currentSynthType !== targetSynthType || track.type !== 'synth')
    
    const samplerChanged =
      config.type === 'sampler' &&
      (!track.sampler || track.type !== 'sampler' || !this._isSameSample(track, sampleUrl))

    if (samplerChanged) {
      track.sampler?.dispose()
      track.polySynth?.dispose()
      track.monoSynth?.dispose()
      track.polySynth = undefined
      track.monoSynth = undefined

      if (config.type === 'sampler') {
        const url = this._resolveSampleUrl(sampleUrl || '')
        track.sampler = new Tone.Sampler({
          urls: { C4: url },
          onload: () => {
            console.log(`[AudioEngine] Loaded ${url} for ${config.id}`)
          },
          onerror: (err) =>
            console.error(`[AudioEngine] Sample Load Failed for ${config.id}:`, err),
        }).connect(track.muteGain) // Connect to MuteGain instead of Panner
        track.loadedSampleUrl = url // NEW: Track it
      }
      track.type = 'sampler'
    } else if (synthChanged) {
      track.sampler?.dispose()
      track.polySynth?.dispose()
      track.monoSynth?.dispose()
      track.sampler = undefined
      track.polySynth = undefined
      track.monoSynth = undefined

      if (targetSynthType === 'monosynth') {
        track.monoSynth = new Tone.MonoSynth(config.instrument.synthParams as unknown as Tone.MonoSynthOptions).connect(
          track.muteGain,
        )
      } else {
        track.polySynth = new Tone.PolySynth(Tone.Synth, config.instrument.synthParams).connect(
          track.muteGain,
        )
      }
      track.type = 'synth'
    }

    // Always update params for Synths (in case of project load with different settings)
    if (config.type === 'synth') {
      this.updateTrackInstrumentParams(config.id, config.instrument)
    }
  }

  private _resolveSampleUrl(id: string): string {
    // If it looks like a path (has slash/dot)
    if (id.includes('/') || id.includes('.')) {
      if (id.startsWith('/')) return id
      if (id.startsWith('samples/')) return `/${id}`
      return `/samples/${id}`
    }

    // Legacy MVP Mapping (Fallbacks)
    // If ID is just "kick", "snare", etc. default to 808
    const defaults: Record<string, string> = {
      kick: 'kits/808/Kick.ogg',
      snare: 'kits/808/Snare.ogg',
      hhc: 'kits/808/ClosedHat.ogg',
      hho: 'kits/808/ClosedHat.ogg', // openHat -> ClosedHat? Typo in original? No, fallback
      hh_closed: 'kits/808/ClosedHat.ogg',
      hh_open: 'kits/808/OpenHat.ogg',
      crash: 'kits/808/Crash.ogg',
      perc: 'kits/808/Crash.ogg',
      perc_02: 'kits/808/ClosedHat.ogg', // Fallback
      tom: 'kits/808/Kick.ogg', // Fallback if no Tom
    }

    // Clean ID (track-kick -> kick)
    const cleanId = id.replace('track-', '').replace('_01', '').toLowerCase()

    if (defaults[cleanId]) return `/samples/${defaults[cleanId]}`

    // Fallback
    return `/samples/${id}.wav`
  }

  private _isSameSample(track: Track, newUrl?: string): boolean {
    if (!newUrl) return true // No new URL, assume same (don't break)
    const resolvedNew = this._resolveSampleUrl(newUrl)
    // Compare with currently loaded URL (if tracked)
    return track.loadedSampleUrl === resolvedNew
  }

  setTrackClips(trackId: string, notes: AudioNote[], loopDurationSteps?: number): void {
    const track = this.tracks.get(trackId)
    if (!track) return

    if (track.part) {
      track.part.stop()
      track.part.dispose()
      track.part = undefined
    }

    if (notes.length === 0) return

    const events = notes.map((n) => ({
      time: n.time,
      note: n.note,
      duration: n.duration,
      velocity: n.velocity,
      probability: n.fill ?? 1,
    }))

    track.part = new Tone.Part((time, value) => {
      if (value.probability < 1 && Math.random() > value.probability) return

      if (track.type === 'sampler' && track.sampler?.loaded) {
        track.sampler.triggerAttack(value.note, time, value.velocity)
      } else if (track.type === 'sampler' && track.sampler && !track.sampler.loaded) {
        // Optional: Log warning or just skip note
        // console.warn(`[AudioEngine] Sampler not loaded for ${trackId}, skipping note`);
      } else if (track.type === 'synth') {
        if (track.polySynth) {
          track.polySynth.triggerAttackRelease(value.note, value.duration, time, value.velocity)
        } else if (track.monoSynth) {
          track.monoSynth.triggerAttackRelease(value.note, value.duration, time, value.velocity)
        }
      }
    }, events)

    if (loopDurationSteps) {
      track.part.loop = true
      const bars = Math.floor(loopDurationSteps / 16)
      track.part.loopEnd = `${bars}:0:0`
    }

    track.part.start(0)
  }

  // --- Mixer Control Methods ---

  setChannelVolume(id: string, vol: number) {
    const strip = this._getStrip(id)
    if (strip) strip.volume.volume.rampTo(Tone.gainToDb(vol), 0.1)
  }
  setChannelPan(id: string, pan: number) {
    const strip = this._getStrip(id)
    if (strip) {
      // Manual Linear Balance Panning (0% - 100%)
      // We use a custom Split -> Gain L/R -> Merge architecture to ensure strictly 2D panning.
      // This avoids the 3D HRTF artifacts usually associated with Tone.Panner.

      // Pan Range: -1 (Left) to +1 (Right)
      // Center (0) -> L=1, R=1
      // Left (-1)  -> L=1, R=0
      // Right (+1) -> L=0, R=1

      let gainL = 1
      let gainR = 1

      if (pan > 0) {
        gainL = 1 - pan
      } else if (pan < 0) {
        gainR = 1 + pan // pan is negative
      }

      strip.panL.gain.rampTo(gainL, 0.1)
      strip.panR.gain.rampTo(gainR, 0.1)
    }
  }
  setChannelMute(id: string, mute: boolean) {
    const strip = this._getStrip(id)
    if (strip) {
      strip.isMuted = mute
      this._updateMixerSoloState()
    }
  }

  setChannelSolo(id: string, solo: boolean) {
    const strip = this._getStrip(id)
    if (strip) {
      strip.isSolo = solo
      this._updateMixerSoloState()
    }
  }

  /**
   * Unified Logic for Mixer Mute/Solo
   * Rules:
   * 1. If ANY channel is Soloed, ONLY Soloed channels are audible.
   * 2. If NO channel is Soloed, Logic falls back to Mute state (Muted = Silent).
   */
  private _updateMixerSoloState() {
    const allStrips = [...Object.values(this.groups), ...Object.values(this.inserts)]

    // 1. Check Global Solo State
    const isAnySolo = allStrips.some((s) => s.isSolo)

    // 2. Apply Gains
    allStrips.forEach((strip) => {
      let shouldBeAudible = true

      if (isAnySolo) {
        // Solo Mode: You must be Solo to be heard
        shouldBeAudible = strip.isSolo
      } else {
        // Standard Mode: You must NOT be Muted to be heard
        shouldBeAudible = !strip.isMuted
      }

      // Apply to MuteGain (Soft Ramp)
      const targetGain = shouldBeAudible ? 1 : 0
      // Avoid rescheduling if already at target? Tone.js handles this well usually,
      // but cancelScheduledValues is safer for rapid toggling.
      strip.muteGain.gain.cancelScheduledValues(Tone.now())
      strip.muteGain.gain.rampTo(targetGain, 0.05)
    })
  }

  // Routing Update (Channel -> Next Input)
  // Routing Update (Channel -> Next Input)
  setChannelOutput(sourceId: string, targetId: string) {
    const sourceStrip = this._getStrip(sourceId) // Output Stage is muteGain
    const targetInput = this._getChannelInput(targetId || 'master') // Target Input Stage

    if (sourceStrip && targetInput) {
      // Disconnect standard output
      sourceStrip.muteGain.disconnect()

      // Reconnect to new target
      sourceStrip.muteGain.connect(targetInput)

      // Re-connect Splitter (Meters) because .disconnect() wipes everything
      sourceStrip.muteGain.connect(sourceStrip.split)
    }
  }

  setTrackOutput(trackId: string, insertId: string) {
    const track = this.tracks.get(trackId)
    const destNode = this._getChannelInput(insertId) || this.masterStrip.input

    if (track && track.destination !== destNode) {
      track.panner.disconnect().connect(destNode)
      track.destination = destNode
    }
  }

  setTrackVolume(trackId: string, volume: number) {
    const track = this.tracks.get(trackId)
    if (track) {
      const db = Tone.gainToDb(Math.max(0.001, volume))
      if (track.sampler) track.sampler.volume.rampTo(db, 0.1)
      if (track.polySynth) track.polySynth.volume.rampTo(db, 0.1)
      if (track.monoSynth) track.monoSynth.volume.rampTo(db, 0.1)
    }
  }

  setTrackPan(trackId: string, pan: number) {
    const track = this.tracks.get(trackId)
    if (track) {
      track.panner.pan.rampTo(Math.max(-1, Math.min(1, pan)), 0.1)
    }
  }

  setTrackMute(trackId: string, muted: boolean) {
    const track = this.tracks.get(trackId)
    if (!track) return

    track.muted = muted
    this._updateSoloState()

    // Also stop sequencer to save CPU
    if (muted) {
      if (track.part) track.part.mute = true
      if (track.polySynth) track.polySynth.releaseAll()
      if (track.monoSynth) track.monoSynth.triggerRelease()
    } else if (track.part) {
      track.part.mute = false
    }
  }

  setTrackSolo(trackId: string, solo: boolean) {
    const track = this.tracks.get(trackId)
    if (track) {
      track.solo = solo
      this._updateSoloState()
    }
  }

  private _updateSoloState() {
    const anySolo = Array.from(this.tracks.values()).some((t) => t.solo)
    this.tracks.forEach((t) => {
      const shouldMute = anySolo ? !t.solo : t.muted

      // Apply to Audio Path (The real mute)
      t.muteGain.gain.cancelScheduledValues(Tone.now())
      t.muteGain.gain.rampTo(shouldMute ? 0 : 1, 0.05)

      // Apply to Sequencer (CPU saving)
      if (t.part) {
        t.part.mute = shouldMute
      }
    })
  }

  // --- Dynamic FX Chain Implementation ---

  rebuildChannelChain(channelId: string, effects: EffectConfig[]) {
    const strip = this._getStrip(channelId)
    if (!strip) return

    const input = strip.input
    const output = strip.volume // Chain inputs to Volume

    // 1. Cleanup Old FX
    const oldNodes = this.channelEffects.get(channelId) || []

    // Disconnect Input from wherever it was going
    input.disconnect()

    // Dispose old effects
    oldNodes.forEach((node) => node.dispose())

    // 2. Build New FX Nodes
    const newNodes: Tone.ToneAudioNode[] = []

    effects.forEach((fx) => {
      if (!fx.enabled) return
      const node = AudioFactory.createEffectNode(fx)
      if (node) newNodes.push(node)
    })

    // 3. Chain Connection: Input -> FX1 -> FX2 -> PanVol
      if (newNodes.length > 0) {
      input.chain(...newNodes, output)
    } else {
      // No effects: Input -> PanVol
      input.connect(output)
    }

    // 4. Register new nodes
    this.channelEffects.set(channelId, newNodes)
  }



  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateEffectNodeParams(node: any, params: any) {
    // Generic Param Updater based on Node Type
    if (params.mix !== undefined && node.wet) node.wet.value = params.mix

    const updater = EFFECT_UPDATERS[node.name]
    if (updater) {
      updater(node, params)
    }
  }

  // Actual Public Method
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateChannelEffect(channelId: string, effectIndex: number, params: any) {
    const nodes = this.channelEffects.get(channelId)
    if (!nodes?.[effectIndex]) return

    this.updateEffectNodeParams(nodes[effectIndex], params)
  }

  // --- Transport Logic ---

  // --- Global Transport Controls ---

  // --- Step Tracking & Looping ---

  private _trackingId: number | null = null

  /**
   * Set Loop Points
   */
  setLoop(startBar: number, endBar: number, loop: boolean) {
    Tone.getTransport().loop = loop
    Tone.getTransport().loopStart = `${startBar}:0:0`
    Tone.getTransport().loopEnd = `${endBar}:0:0`
  }

  private _startStepTracker() {
    if (this._trackingId !== null) return

    // Schedule a repeating event every 16th note to track progress
    this._trackingId = Tone.getTransport().scheduleRepeat((time) => {
      // Calculate current 16th step
      // Tone.Transport.position is like "0:0:0"
      // We can resolve it to ticks or steps.
      // 1 bar = 16 steps. 1 beat = 4 steps.
      // Let's use Tone.Transport.position string parsing or seconds conversion.
      // Simpler: use ticks.
      // PPQ (Pulses Per Quarter) defaults to 192.
      // 16th note = PPQ / 4 = 48 ticks.

      // To be robust, let's parse the Bars:Beats:Sixteenths
      const position = Tone.getTransport().position as string
      const [bars, beats, sixteenths] = position.split(':').map(Number.parseFloat)

      const totalSteps = bars * 16 + beats * 4 + sixteenths

      // Fire callback (don't perform heavy logic here, just state update)
      Tone.getDraw().schedule(() => {
        usePlaybackStore.getState().setPlayingStep(Math.floor(totalSteps))
      }, time)
    }, '16n')
  }

  async start(): Promise<void> {
    await this.initialize()
    this._startStepTracker()
    Tone.getTransport().start()
  }

  stop(): void {
    Tone.getTransport().stop()
    this.tracks.forEach((t) => {
      t.polySynth?.releaseAll()
      t.monoSynth?.triggerRelease()
    })
    // Reset step in UI
    usePlaybackStore.getState().setPlayingStep(-1)
  }

  pause(): void {
    Tone.getTransport().pause()
  }
  seekToTime(seconds: number): void {
    Tone.getTransport().seconds = seconds
  }
  getCurrentTime(): number {
    return Tone.getTransport().seconds
  }
  setBpm(bpm: number): void {
    Tone.getTransport().bpm.value = bpm
  }

  triggerTrack(id: string): void {
    const track = this.tracks.get(id)
    if (track?.sampler) track.sampler.triggerAttack('C4')
    if (track?.polySynth) track.polySynth.triggerAttackRelease('C4', '8n')
    if (track?.monoSynth) track.monoSynth.triggerAttackRelease('C4', '8n')
  }

  /**
   * Get Stereo Levels for ANY Channel (Master, Group, Insert)
   */
  getStereoLevels(id: string): { l: number; r: number } {
    const strip = this._getStrip(id)
    if (!strip) return { l: -100, r: -100 }

    try {
      const l = strip.meterL.getValue()
      const r = strip.meterR.getValue()
      return {
        l: typeof l === 'number' ? l : l[0],
        r: typeof r === 'number' ? r : r[0],
      }
    } catch {
      // Ignore error when reading meters if disconnected
      return { l: -100, r: -100 }
    }
  }

  /**
   * Get Stereo Levels for Master (Alias)
   */
  getMasterStereoLevels(): { l: number; r: number } {
    return this.getStereoLevels('master')
  }

  /**
   * Previews a sample URL (One-shot)
   */
  previewSample(url: string): void {
    const resolvedUrl = this._resolveSampleUrl(url)

    // Simple One-Shot Player
    // We create it, load it, play it, dispose it.
    // Tone.Player is lighter than Sampler for this.
    const player = new Tone.Player({
      url: resolvedUrl,
      autostart: true,
      volume: -10, // Lower volume for preview
      onload: () => {},
      onstop: () => {
        player.dispose()
      },
    }).toDestination()
  }

  // Legacy/Synth updates
  updateTrackInstrumentParams(trackId: string, instrument: InstrumentConfig) {
    const track = this.tracks.get(trackId)
    if (!track || track?.type !== 'synth') return
    
    if (track.polySynth) {
      if (instrument.synthParams?.oscillatorType) {
        track.polySynth.set({ oscillator: { type: instrument.synthParams.oscillatorType } })
      }
      if (instrument.synthParams?.envelope) {
        track.polySynth.set({ envelope: instrument.synthParams.envelope })
      }
    } else if (track.monoSynth) {
      if (instrument.synthParams?.oscillatorType) {
        track.monoSynth.set({ oscillator: { type: instrument.synthParams.oscillatorType } })
      }
      if (instrument.synthParams?.envelope) {
        track.monoSynth.set({ envelope: instrument.synthParams.envelope })
      }
      // Nouveaux paramètres (Filtre, Glide, etc.)
      const optionsStr: Partial<Tone.MonoSynthOptions> = {}
      if (instrument.synthParams?.filter) {
        optionsStr.filter = instrument.synthParams.filter as Tone.FilterOptions
      }
      if (instrument.synthParams?.filterEnvelope) {
        optionsStr.filterEnvelope = instrument.synthParams.filterEnvelope as unknown as Tone.FrequencyEnvelopeOptions
      }
      
      track.monoSynth.set(optionsStr)

      if (instrument.synthParams?.portamento !== undefined) {
        track.monoSynth.portamento = instrument.synthParams.portamento
      }
    }
  }
  // --- Lifecycle / Reset ---

  /**
   * Clears all tracks, parts, and audio nodes.
   * Must be called before loading a new project.
   */
  reset() {
    // 1. Stop Transport
    Tone.getTransport().stop()
    Tone.getTransport().cancel(0) // Clear all scheduled events on Transport

    // Clear tracker
    if (this._trackingId !== null) {
      Tone.getTransport().clear(this._trackingId)
      this._trackingId = null
    }

    // 2. Dispose Tracks (Instruments & Parts)
    this.tracks.forEach((track) => {
      track.sampler?.dispose()
      track.polySynth?.dispose()
      track.monoSynth?.dispose()
      track.part?.dispose()
      if (track.muteGain) track.muteGain.dispose()
      if (track.panner) track.panner.dispose()
    })
    this.tracks.clear()

    // 3. Reset Mixer Effects
    this.channelEffects.forEach((chain) => {
      chain.forEach((node) => node.dispose())
    })
    this.channelEffects.clear()

    console.log('[AudioEngine] Reset Complete')
  }
}

const audioInstance = new AudioEngine()
export default audioInstance
