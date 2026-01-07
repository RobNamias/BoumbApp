import React from 'react';
import { useProjectStore } from '../../store/projectStore';

import styles from '../../styles/modules/ChannelStrip.module.scss';
import Fader from '../atoms/Fader';
import VUMeter from '../atoms/VUMeter';
import Knob from '../atoms/Knob';

interface ChannelStripProps {
    trackId: string; // Actually channelId (master, group-x, insert-x)
    label: string;
    isSelected: boolean;
    onSelect: () => void;
}

const ChannelStrip: React.FC<ChannelStripProps> = ({ trackId, label, isSelected, onSelect }) => {
    // 1. Fetch Channel Data from Store
    const channel = useProjectStore(state => {
        const mixer = state.project.mixer;
        if (trackId === 'master') return mixer.master;
        if (mixer.groups[trackId]) return mixer.groups[trackId];
        if (mixer.inserts[trackId]) return mixer.inserts[trackId];
        return null;
    });

    const updateMixerChannel = useProjectStore(state => state.updateMixerChannel);

    if (!channel) return <div className={styles.channelStrip}>Unknown</div>;

    // 2. Determine Type
    const isMaster = trackId === 'master';

    const isInsert = trackId.startsWith('insert-');

    // 3. Handlers
    const handleVolumeChange = (val: number) => {
        updateMixerChannel(trackId, { volume: val });
    };

    const handlePanChange = (val: number) => {
        updateMixerChannel(trackId, { pan: val });
    };

    const toggleMute = () => {
        updateMixerChannel(trackId, { muted: !channel.muted });
    };

    const toggleSolo = () => {
        updateMixerChannel(trackId, { solo: !channel.solo });
    };

    const cycleOutput = () => {
        // Logic: Insert -> Group 1..4 -> Master
        // Current: channel.output
        if (isMaster) return;

        let nextOutput = 'master';
        if (isInsert) {
            // Cycle: master -> group-1 -> group-2 -> group-3 -> group-4 -> master
            if (channel.output === 'master') nextOutput = 'group-1';
            else if (channel.output === 'group-1') nextOutput = 'group-2';
            else if (channel.output === 'group-2') nextOutput = 'group-3';
            else if (channel.output === 'group-3') nextOutput = 'group-4';
            // else defaults to 'master' (group-4 or unknown)
        }
        // Groups -> Master only

        updateMixerChannel(trackId, { output: nextOutput });
    };

    // Format Output Label
    const getOutputLabel = (out: string) => {
        if (out === 'master') return 'MST';
        if (out.startsWith('group-')) return `G${out.split('-')[1]}`;
        return out;
    };

    return (
        <div
            className={`${styles.channelStrip} ${isSelected ? styles.selected : ''} ${isMaster ? styles.master : ''}`}
            onClick={onSelect}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(); }}
        >
            <div className={styles.header}>{label}</div>

            {/* Pan Knob */}
            <div className={styles.panSection}>
                <Knob
                    value={channel.pan}
                    min={-1}
                    max={1}
                    size={isMaster ? 40 : 32}
                    onChange={handlePanChange}
                />
            </div>

            <div className={styles.mainSection} style={{ height: '100%', minHeight: 0 }}>
                {/* Fader (Tall) */}
                <div style={{ height: '100%', flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <Fader
                        value={channel.volume}
                        onChange={handleVolumeChange}
                        height="100%"
                        min={0}
                        max={1}
                    />
                </div>

                {/* Meter */}
                <div className={styles.meterContainer} style={{ height: '100%' }}>
                    <VUMeter
                        trackId={trackId}
                        width={isMaster ? 16 : 8} // Wider for Master Stereo
                        stereo={isMaster}
                    />
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.buttonRow}>
                    <button
                        className={`${styles.muteBtn} ${channel.muted ? styles.active : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                        title="Mute"
                    >
                        M
                    </button>
                    {!isMaster && (
                        <button
                            className={`${styles.soloBtn} ${channel.solo ? styles.active : ''}`}
                            onClick={(e) => { e.stopPropagation(); toggleSolo(); }}
                            title="Solo"
                        >
                            S
                        </button>
                    )}
                </div>

                {/* Output Routing Selector */}
                {!isMaster && (
                    <button
                        className={styles.routing}
                        onClick={(e) => { e.stopPropagation(); cycleOutput(); }}
                        title={`Output: ${channel.output}`}
                    >
                        <div className={styles.routingIcon}>▼</div>
                        <span style={{ fontSize: '9px', color: '#666', marginLeft: 4 }}>
                            {getOutputLabel(channel.output)}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default ChannelStrip;
