import React, { useMemo } from 'react';
import StepCell from '../../molecules/StepCell';
import '../../../styles/components/_sequencer.scss';

export interface Step {
    active: boolean;
    value: number;
}

export interface SequencerProps {
    steps?: (Step | number)[]; // Allow generic/legacy steps
    onStepChange?: (index: number, value?: number) => void;
    playingStep?: number;
    mode?: 'trigger' | 'volume' | 'fill';
}

const Sequencer: React.FC<SequencerProps> = ({
    steps = [],
    onStepChange,
    playingStep = -1,
    mode = 'trigger'
}) => {
    // Ensure we always have AT LEAST 32 steps visuals (8 beats), or usage of provided steps if longer
    const displaySteps = useMemo(() => {
        // Normalize steps to Step objects
        const normalizedSteps: Step[] = steps.map(s => {
            if (typeof s === 'number') return { active: s > 0, value: s };
            return s;
        });

        if (normalizedSteps.length >= 32) return normalizedSteps;

        const safeSteps = [...normalizedSteps];
        while (safeSteps.length < 32) {
            safeSteps.push({ active: false, value: 0 });
        }
        return safeSteps;
    }, [steps]);

    return (
        <div className="sequencer">
            {displaySteps.map((step, index) => (
                <StepCell
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    isActive={step.active}
                    value={step.value}
                    mode={mode}
                    isPlaying={playingStep === index}
                    isAltBeat={Math.floor(index / 4) % 2 !== 0} // True for Beats 2, 4, 6, 8...
                    onClick={() => onStepChange?.(index)}
                    onChange={(val) => onStepChange?.(index, val)}
                />
            ))}
        </div>
    );
};

export default Sequencer;
