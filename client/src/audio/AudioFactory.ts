import * as Tone from 'tone';
import type { EffectConfig } from '../store/projectStore';

// NEW: Mixer Strip Architecture (Replaces Tone.Channel to fix Stereo behavior)
export interface MixerStrip {
    input: Tone.Gain;      // Entry point (Pre-FX)
    volume: Tone.Volume;   // Volume Stage
    panL: Tone.Gain;       // Left Pan Gain
    panR: Tone.Gain;       // Right Pan Gain
    merge: Tone.Merge;     // Stereo Merger
    muteGain: Tone.Gain;   // Mute / Output Stage
    split: Tone.Split;     // Stereo Splitter (Post-Fader Metering)
    meterL: Tone.Meter;    // Left Meter
    meterR: Tone.Meter;    // Right Meter
    // State Tracking for Solo Logic
    isMuted: boolean;
    isSolo: boolean;
}

export class AudioFactory {
    /**
     * Helper to create a Mixer Strip
     */
    static createMixerStrip(_id: string): MixerStrip {
        // FORCE Stereo: prevents Tone.js from downmixing to Mono if input is Mono (e.g. Sampler)
        // We set properties explicitly after instantiation since Tone.Gain constructor types are strict.
        const input = new Tone.Gain(1);
        input.channelCount = 2;
        input.channelCountMode = 'explicit';

        // CUSTOM PANNER ARCHITECTURE (Split -> Gain L/R -> Merge)
        // This ensures strictly 2D Balance without any 3D spatialization artifacts.
        const volume = new Tone.Volume(0); // Restored definition
        const pannerSplit = new Tone.Split(2);
        const panL = new Tone.Gain(1); // Left Channel Gain
        const panR = new Tone.Gain(1); // Right Channel Gain
        const merge = new Tone.Merge(2);

        // Wiring Panner: Volume -> Split -> Gains -> Merge
        volume.connect(pannerSplit);
        pannerSplit.connect(panL, 0); // Split L -> PanL
        pannerSplit.connect(panR, 1); // Split R -> PanR
        panL.connect(merge, 0, 0);    // PanL -> Merge L
        panR.connect(merge, 0, 1);    // PanR -> Merge R

        // Force output gain to stereo as well
        const muteGain = new Tone.Gain(1);
        muteGain.channelCount = 2;
        muteGain.channelCountMode = 'explicit';
        const split = new Tone.Split(2);
        const meterL = new Tone.Meter();
        const meterR = new Tone.Meter();

        // Wiring Global: Input -> Volume -> [PannerChain] -> Merge -> MuteGain -> Split -> [Meters]
        input.connect(volume);
        // volume connected to pannerSplit above
        merge.connect(muteGain);
        muteGain.connect(split);
        split.connect(meterL, 0);
        split.connect(meterR, 1);

        // NOTE: muteGain is the "Output" of the strip that goes to the next stage

        return {
            input, volume, panL, panR, merge, muteGain, split, meterL, meterR,
            isMuted: false,
            isSolo: false
        };
    }

    static createEffectNode(fx: EffectConfig): Tone.ToneAudioNode | null {
        try {
            switch (fx.type) {
                case 'reverb':
                    return new Tone.Reverb({
                        decay: fx.params.decay || 1.5,
                        preDelay: fx.params.preDelay || 0.01,
                        wet: fx.params.mix ?? 1
                    });

                case 'delay':
                    return new Tone.FeedbackDelay({
                        delayTime: fx.params.time || 0.25,
                        feedback: fx.params.feedback || 0.5,
                        wet: fx.params.mix ?? 1
                    });

                case 'distortion':
                    let distAmount = 0.4;
                    if (fx.params.amount !== undefined) distAmount = fx.params.amount;
                    else if (fx.params.distortion !== undefined) distAmount = fx.params.distortion;

                    return new Tone.Distortion({
                        distortion: distAmount,
                        wet: fx.params.mix ?? 1,
                        oversample: '2x'
                    });

                case 'chorus':
                    return new Tone.Chorus({
                        frequency: fx.params.frequency || 4,
                        delayTime: fx.params.delayTime || 2.5,
                        depth: fx.params.depth || 0.5,
                        wet: fx.params.mix ?? 1
                    }).start(); // Chorus needs start()!

                case 'bitcrusher': {
                    // Tone.BitCrusher constructor options might be strict in this version
                    const bc = new Tone.BitCrusher(fx.params.bits || 4);
                    bc.wet.value = fx.params.mix ?? 1;
                    return bc;
                }

                case 'autofilter':
                    return new Tone.AutoFilter({
                        frequency: fx.params.frequency || 1,
                        depth: fx.params.depth || 0.5,
                        baseFrequency: fx.params.baseFrequency || 200,
                        wet: fx.params.mix ?? 1
                    }).start(); // AutoFilter needs start()

                default:
                    return null;
            }
        } catch (e) {
            console.error(`[AudioFactory] Error creating effect ${fx.type}:`, e);
            return null;
        }
    }
}
