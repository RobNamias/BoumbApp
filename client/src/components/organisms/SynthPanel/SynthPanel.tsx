import React from 'react';
import styles from '../../../styles/modules/SynthPanel.module.scss';
import Knob from '../../atoms/Knob';
import ADSRGraph from '../../molecules/ADSRGraph';
import { useProjectStore } from '../../../store/projectStore';

import { Triangle, Square, Waves, Activity } from 'lucide-react';

interface SynthPanelProps {
    trackId: string;
}

const SynthPanel: React.FC<SynthPanelProps> = ({ trackId }) => {
    const { project, updateTrackInstrument } = useProjectStore();
    const track = project.tracks[trackId];

    if (!track || track.instrument.type !== 'synth' || !track.instrument.synthParams) {
        return <div className="synth-panel--empty">No Synth Track Selected</div>;
    }

    const { oscillatorType, envelope } = track.instrument.synthParams;

    // Defensive coding: Ensure envelope exists to prevent crash on stale state
    const safeEnvelope = envelope || { attack: 0.05, decay: 0.1, sustain: 0.3, release: 1 };
    const { attack, decay, sustain, release } = safeEnvelope;

    const handleOscChange = (value: string | number) => {
        updateTrackInstrument(trackId, {
            synthParams: { ...track.instrument.synthParams!, oscillatorType: value as any }
        });
    };

    const handleEnvChange = (param: 'attack' | 'decay' | 'sustain' | 'release', value: number) => {
        updateTrackInstrument(trackId, {
            synthParams: {
                ...track.instrument.synthParams!,
                envelope: {
                    ...track.instrument.synthParams!.envelope,
                    [param]: value
                }
            }
        });
    };

    const waveforms = [
        { id: 'triangle', icon: <Triangle size={12} fill="currentColor" />, label: 'Tri' },
        { id: 'sine', icon: <Waves size={12} />, label: 'Sin' },
        { id: 'square', icon: <Square size={12} fill="currentColor" />, label: 'Sqr' },
        { id: 'sawtooth', icon: <Activity size={12} />, label: 'Saw' }
    ];

    return (
        <div className={styles.synthPanel}>
            {/* Body Only: Left (ADSR) | Right (Waveforms) */}
            <div className={styles.body}>

                {/* Left: Graph + Knobs */}
                <div className={styles.adsrSection}>
                    <div className={styles.graphContainer}>
                        <ADSRGraph attack={attack} decay={decay} sustain={sustain} release={release} width={160} height={40} color="#4CAF50" />
                    </div>
                    {/* Aligned Knobs Row */}
                    <div className={styles.knobsRow}>
                        <Knob label="A" size={28} value={attack} min={0.01} max={2} step={0.01} onChange={(v) => handleEnvChange('attack', v)} />
                        <Knob label="D" size={28} value={decay} min={0.01} max={2} step={0.01} onChange={(v) => handleEnvChange('decay', v)} />
                        <Knob label="S" size={28} value={sustain} min={0} max={1} step={0.01} onChange={(v) => handleEnvChange('sustain', v)} />
                        <Knob label="R" size={28} value={release} min={0.01} max={4} step={0.01} onChange={(v) => handleEnvChange('release', v)} />
                    </div>
                </div>

                {/* Right: Waveform Selector (Buttons) */}
                <div className={styles.oscSection}>
                    {waveforms.map(wf => (
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
        </div>
    );
};

export default SynthPanel;
