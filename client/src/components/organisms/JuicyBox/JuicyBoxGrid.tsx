import React from 'react';
import TrackHeader, { type Track } from '../../molecules/TrackHeader';
import Sequencer from './Sequencer';


import { Plus } from 'lucide-react';
import '../../../styles/components/_juicy-box.scss'; // Adjusted path

import { useAppStore } from '../../../store/useAppStore'; // Adjusted path

export interface JuicyBoxGridProps {
    tracks: Track[];
    onUpdateTrack: (updatedTrack: Track) => void;
    playingStep?: number;
    onTrackVolumeChange?: (trackId: string, volume: number) => void; // New
    onTrackMuteChange?: (trackId: string, muted: boolean) => void; // New
    onTrackSoloChange?: (trackId: string, solo: boolean) => void; // New
    onTrackOutputChange?: (trackId: string, output: number) => void; // New
}

const JuicyBoxGrid: React.FC<JuicyBoxGridProps> = ({
    tracks = [],
    onUpdateTrack,
    playingStep = -1,
    onTrackVolumeChange,
    onTrackMuteChange,
    onTrackSoloChange,
    onTrackOutputChange
}) => {
    // Global State
    // View Mode is now controlled globally via TopBar
    const viewMode = useAppStore(state => state.viewMode);

    const handleStepChange = (trackId: string, stepIndex: number, newValue?: number) => {
        const track = tracks.find(t => t.id === trackId);
        if (!track) return;

        // ... (Existing Logic remains same, referencing 'viewMode')
        const newSteps = [...track.steps];
        let step = newSteps[stepIndex];

        // Normalize Step Object with defaults
        if (typeof step === 'number') {
            step = { active: step > 0, value: step, volume: 0.8, fill: 1 } as any;
        } else {
            step = { ...step } as any;
            if ((step as any).volume === undefined) (step as any).volume = 0.8;
            if ((step as any).fill === undefined) (step as any).fill = 1;
        }

        const typedStep = step as { active: boolean; value: number; volume: number; fill: number };

        // Interaction Logic based on ViewMode
        if (viewMode === 'trigger') {
            // Standard Toggle
            typedStep.active = !typedStep.active;
        } else if (viewMode === 'volume') {
            if (newValue !== undefined) {
                // Drag: Activate and Set Volume
                typedStep.active = true;
                typedStep.volume = newValue;
            } else {
                // Click: Activate if inactive, otherwise do nothing (Safe)
                if (!typedStep.active) {
                    typedStep.active = true;
                    typedStep.volume = 0.8;
                }
            }
        } else if (viewMode === 'fill') {
            if (newValue !== undefined) {
                // Drag (if enabled): Set Fill
                typedStep.active = true;
                typedStep.fill = newValue;
            } else {
                // Click: Cycle Logic
                if (!typedStep.active) {
                    typedStep.active = true;
                    typedStep.fill = 1;
                } else {
                    // Cycle: 1 -> 0.5 -> 0.33 -> 0.25 -> 1
                    if (typedStep.fill >= 0.9) typedStep.fill = 0.5;
                    else if (typedStep.fill >= 0.45) typedStep.fill = 0.33;
                    else if (typedStep.fill >= 0.3) typedStep.fill = 0.25;
                    else typedStep.fill = 1;
                }
            }
        }

        newSteps[stepIndex] = typedStep;

        if (onUpdateTrack) {
            onUpdateTrack({ ...track, steps: newSteps });
        }
    };

    return (
        <div className="juicy-box">
            {/* 
                GLOBAL CONTROL MIGRATION:
                Controls (ViewMode, Master, etc.) have been moved to TopBar.tsx 
                to satisfy "GLOBAL GLOBAL" requirement.
            */}

            <div className="juicy-box__main-layout">
                {/* Left Column: Fixed Headers */}
                <div className="juicy-box__headers">
                    <div className="juicy-timeline-spacer"></div>

                    {tracks.map(track => (
                        <div key={track.id} className="juicy-row-header">
                            <TrackHeader
                                track={track}
                                onVolumeChange={(val) => onTrackVolumeChange?.(track.id, val)}
                                onMuteChange={(muted) => onTrackMuteChange?.(track.id, muted)}
                                onSoloChange={(solo) => onTrackSoloChange?.(track.id, solo)}
                                onOutputChange={(val) => onTrackOutputChange?.(track.id, val)}
                            />
                        </div>
                    ))}
                </div>

                {/* Right Column: Scrollable Sequencers */}
                <div className="juicy-box__sequencers">
                    {/* Timeline Header */}
                    <div className="juicy-timeline-row">
                        {(() => {
                            const maxSteps = Math.max(32, ...tracks.map(t => t.steps.length));
                            return new Array(maxSteps).fill(null).map((_, i) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <div key={`timeline-${i}`} className={`timeline-cell ${i % 4 === 0 ? 'beat-marker' : ''}`}>
                                    {i % 4 === 0 ? (i / 4) + 1 : ''}
                                </div>
                            ));
                        })()}
                    </div>

                    {tracks.map(track => (
                        <div key={track.id} className="juicy-row-sequencer">
                            <Sequencer
                                steps={track.steps.map(s => {
                                    // Dynamic Mapping: Project the correct value to 'value' based on ViewMode
                                    const obj = (typeof s === 'number') ? { active: s > 0, volume: 0.8, fill: 1 } : s;
                                    const typedObj = obj as any;

                                    let displayValue = 1;
                                    if (viewMode === 'volume') displayValue = typedObj.volume ?? 0.8;
                                    else if (viewMode === 'fill') displayValue = typedObj.fill ?? 1;

                                    return { ...((typeof s === 'object' ? s : { active: s > 0 })), value: displayValue };
                                })}
                                onStepChange={(stepIndex, val) => handleStepChange(track.id, stepIndex, val)}
                                playingStep={playingStep}
                                mode={viewMode}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JuicyBoxGrid;
