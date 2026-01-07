import React, { useState } from 'react';
import styles from '../../../styles/modules/MixerBoard.module.scss';
import ChannelStrip from '../../molecules/ChannelStrip';
import FXInspector from './FXInspector';
import SpectrumAnalyzer from '../../atoms/SpectrumAnalyzer';
import ModuleHeader from '../../molecules/ModuleHeader';
import { Sliders } from 'lucide-react';
import Fader from '../../atoms/Fader';
import Knob from '../../atoms/Knob';
import VUMeter from '../../atoms/VUMeter';
import { useProjectStore } from '../../../store/projectStore';

const MixerBoard: React.FC = () => {
    const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>
            <ModuleHeader
                title="The Sauce"
                icon={Sliders}
                color="#d32f2f"
            />

            <div className={styles.mixerBoard} style={{ flex: 1, overflow: 'hidden' }}>
                {/* 1. Master Channel (Left) */}
                <div className={styles.masterSection} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '4px 2px', minWidth: '220px', height: '100%' }}>
                    <SpectrumAnalyzer width={210} height={120} />
                    {/* Symmetrical Master Strip */}
                    <div style={{ flex: 1, minHeight: 0, width: '100%', display: 'flex', flexDirection: 'row', gap: 10, padding: '0 8px' }}>
                        {/* LEFT METER */}
                        <div style={{ width: 12, height: '100%', border: '1px solid #333', background: '#000', padding: 1, borderRadius: 2 }}>
                            <VUMeter trackId="master" channel="left" width={10} />
                        </div>

                        {/* CENTER CONTROLS (Fader) */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', gap: 8, background: '#111', border: '1px solid #333', borderRadius: 4, padding: '8px 4px' }}>
                            {/* Header */}
                            <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#888', background: '#000', padding: '2px 6px', borderRadius: 2 }}>MASTER</div>

                            {/* Pan Knob (Manual integration since we removed ChannelStrip) */}
                            <MasterPanKnob />

                            {/* Fader */}
                            <div style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <MasterFader />
                            </div>

                            {/* Mute Btn */}
                            <MasterMuteButton />
                        </div>

                        {/* RIGHT METER */}
                        <div style={{ width: 12, height: '100%', border: '1px solid #333', background: '#000', padding: 1, borderRadius: 2 }}>
                            <VUMeter trackId="master" channel="right" width={10} />
                        </div>
                    </div>
                </div>

                {/* 2. Combined Groups & Channels (Center) */}
                <div className={styles.channelsContainer}>
                    {/* Groups */}
                    {['group-1', 'group-2', 'group-3', 'group-4'].map((grpId, i) => (
                        <ChannelStrip
                            key={grpId}
                            trackId={grpId}
                            label={`CG ${i + 1}`}
                            isSelected={selectedChannelId === grpId}
                            onSelect={() => setSelectedChannelId(grpId)}
                        />
                    ))}

                    {/* Separator */}
                    <div style={{ width: 1, backgroundColor: '#444', margin: '0 8px', height: '100%' }}></div>

                    {/* Inserts (1-10) */}
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((idx) => {
                        const insertId = `insert-${idx}`;
                        return (
                            <ChannelStrip
                                key={insertId}
                                trackId={insertId}
                                label={`CI ${idx}`}
                                isSelected={selectedChannelId === insertId}
                                onSelect={() => setSelectedChannelId(insertId)}
                            />
                        );
                    })}
                </div>

                {/* 3. FX Inspector (Right) */}
                <div className={`${styles.inspectorSection} ${!selectedChannelId ? styles.collapsed : ''}`}>
                    <FXInspector channelId={selectedChannelId} />
                </div>
            </div>
        </div>
    );
};

// --- Master Control Helpers ---

const MasterPanKnob: React.FC = () => {
    const pan = useProjectStore(state => state.project.mixer.master.pan);
    const update = useProjectStore(state => state.updateMixerChannel);
    return <Knob value={pan} min={-1} max={1} size={40} onChange={(v) => update('master', { pan: v })} />;
};

const MasterFader: React.FC = () => {
    const vol = useProjectStore(state => state.project.mixer.master.volume);
    const update = useProjectStore(state => state.updateMixerChannel);
    return <Fader value={vol} min={0} max={1} onChange={(v) => update('master', { volume: v })} height="100%" />;
};

const MasterMuteButton: React.FC = () => {
    const muted = useProjectStore(state => state.project.mixer.master.muted);
    const update = useProjectStore(state => state.updateMixerChannel);
    return (
        <button
            onClick={() => update('master', { muted: !muted })}
            style={{
                width: 24, height: 24, borderRadius: 2, border: '1px solid #333',
                background: muted ? '#f00' : '#222', color: muted ? '#fff' : '#666',
                cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
        >
            M
        </button>
    );
};

export default MixerBoard;
