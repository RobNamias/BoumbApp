import React, { useState } from 'react';
import { useProjectStore } from '../../../store/projectStore';
import type { EffectConfig } from '../../../store/projectStore';
import styles from '../../../styles/modules/FXInspector.module.scss';
import { Trash2, Power, Waves, Mic2, Zap, Radio, Activity, Filter, ChevronDown } from 'lucide-react';

interface FXInspectorProps {
    channelId: string | null;
}

// Helper: Effect Type Config (Color + Icon)
const EFFECT_CONFIGS: Record<EffectConfig['type'], { color: string; icon: React.ElementType; label: string }> = {
    'reverb': { color: '#8B5CF6', icon: Waves, label: 'Space Reverb' },      // Violet
    'delay': { color: '#06B6D4', icon: Activity, label: 'Echo Delay' },      // Cyan
    'distortion': { color: '#F97316', icon: Zap, label: 'Hard Disto' },      // Orange
    'chorus': { color: '#3B82F6', icon: Radio, label: 'Stereo Chorus' },     // Blue
    'bitcrusher': { color: '#EF4444', icon: Mic2, label: 'Bit Crusher' },    // Red
    'autofilter': { color: '#10B981', icon: Filter, label: 'Auto Filter' },  // Emerald
};

const FXInspector: React.FC<FXInspectorProps> = ({ channelId }) => {
    // Local State for Collapsed/Expanded Cards (Set of IDs)
    const [expandedEffects, setExpandedEffects] = useState<Set<string>>(new Set());

    // Select Channel Data
    const channel = useProjectStore(state => {
        if (!channelId) return null;
        const mixer = state.project.mixer;
        if (channelId === 'master') return mixer.master;
        if (channelId.startsWith('group')) return mixer.groups[channelId];
        if (channelId.startsWith('insert')) return mixer.inserts[channelId];
        return null;
    });

    // Actions
    const addEffect = useProjectStore(state => state.addChannelEffect);
    const removeEffect = useProjectStore(state => state.removeChannelEffect);
    const updateEffect = useProjectStore(state => state.updateChannelEffect);

    // Toggle Expansion
    const toggleExpand = (id: string) => {
        const newSet = new Set(expandedEffects);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setExpandedEffects(newSet);
    };

    // Auto-expand new effects (Helper wrapper)
    const handleAddEffect = (type: EffectConfig['type']) => {
        if (!channelId) return;
        // Ideally we'd need the ID of the new effect to expand it. 
        // Store generates ID. We can rely on user expanding it, or just expand all?
        // Let's just add it.
        addEffect(channelId, { type });
    };

    if (!channelId || !channel) {
        return (
            <div className={styles.fxInspector}>
                <h3>The Sauce</h3>
                <div style={{ color: '#666', fontStyle: 'italic', padding: '20px', textAlign: 'center' }}>
                    Choisis une piste pour mettre la Sauce !
                </div>
            </div>
        );
    }

    const handleTypeChange = (effectId: string, newType: EffectConfig['type']) => {
        let defaultParams = {};
        if (newType === 'reverb') defaultParams = { decay: 1.5, preDelay: 0.01, mix: 0.5 };
        else if (newType === 'delay') defaultParams = { time: 0.25, feedback: 0.5, mix: 0.5 };
        else if (newType === 'distortion') defaultParams = { amount: 0.4, mix: 0.5 };
        else if (newType === 'chorus') defaultParams = { frequency: 4, delayTime: 2.5, depth: 0.5, mix: 0.5 };
        else if (newType === 'bitcrusher') defaultParams = { bits: 4, mix: 0.5 };
        else if (newType === 'autofilter') defaultParams = { frequency: 1, depth: 0.5, baseFrequency: 200, mix: 0.5 };

        updateEffect(channelId, effectId, { type: newType, params: defaultParams });
    };

    const handleParamChange = (effectId: string, param: string, value: number) => {
        const effect = channel.effects.find(e => e.id === effectId);
        if (!effect) return;

        const newParams = { ...effect.params, [param]: value };
        updateEffect(channelId, effectId, { params: newParams });
    };

    const toggleEffect = (effectId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card expansion
        const effect = channel.effects.find(e => e.id === effectId);
        if (!effect) return;
        updateEffect(channelId, effectId, { enabled: !effect.enabled });
    };

    const getMaxValue = (key: string): number => {
        if (key === 'amount') return 1;
        if (key === 'decay') return 10;
        if (key === 'preDelay') return 0.5;
        if (key === 'frequency') return 20;
        if (key === 'time') return 1;
        if (key === 'delayTime') return 10;
        if (key === 'feedback') return 1;
        if (key === 'depth') return 1;
        if (key === 'bits') return 8; // BitCrusher bits (1-8 usually, or 1-16)
        if (key === 'baseFrequency') return 1000;
        return 1; // Default assumes 0-1 (mix, etc.)
    };

    const getMinValue = (key: string): number => {
        if (key === 'bits') return 1;
        return 0;
    };

    const getStep = (key: string): number => {
        if (key === 'bits') return 1;
        if (key === 'baseFrequency') return 10;
        return 0.01;
    };

    return (
        <div className={styles.fxInspector}>
            <h3>THE SAUCE: <span style={{ color: '#fff' }}>{channel.name}</span></h3>

            <div className={styles.slotList}>
                {channel.effects.map((fx) => {
                    const config = EFFECT_CONFIGS[fx.type] || EFFECT_CONFIGS.reverb;
                    const Icon = config.icon;
                    const mixVal = fx.params.mix ?? 0.5; // 0 to 1
                    const isExpanded = expandedEffects.has(fx.id);

                    // Dynamic Glassmorphism Logic
                    // User Request: "Moins c'est transparent (plus c'est solide/opaque), moins l'effet est appliqué"
                    // Translation: Low Mix = Opaque/Boring. High Mix = Transparent/Glassy.
                    // Implementation: 
                    // Mix 0 -> Opacity 1 (Solid Dark Grey)
                    // Mix 1 -> Opacity 0.3 (Glassy)
                    // We apply this to the background color's alpha channel approximately using rgba.
                    // Alternatively, we use `rgba(30, 30, 30, ${1 - mixVal * 0.7})`
                    const bgOpacity = 1 - (mixVal * 0.7); // 0 -> 1, 1 -> 0.3
                    const cardStyle = {
                        borderLeftColor: fx.enabled ? config.color : '#444',
                        background: fx.enabled ? `rgba(30, 30, 30, ${bgOpacity})` : '#1a1a1a',
                        filter: fx.enabled ? 'none' : 'grayscale(100%) opacity(0.5)',
                        '--accent-color': config.color
                    } as React.CSSProperties;

                    return (
                        <div
                            key={fx.id}
                            className={`${styles.fxSlot} ${fx.enabled ? styles.glassy : ''} ${!isExpanded ? styles.collapsed : ''}`}
                            style={cardStyle}
                        >
                            {/* Header: Click to Expand */}
                            <div className={styles.header} onClick={() => toggleExpand(fx.id)}>
                                <div className={styles.titleSection}>
                                    <Icon size={16} color={config.color} />

                                    {/* Merged Selector in Title */}
                                    <div className={styles.typeSelectContainer} onClick={(e) => e.stopPropagation()}>
                                        <select
                                            value={fx.type}
                                            onChange={(e) => handleTypeChange(fx.id, e.target.value as EffectConfig['type'])}
                                        >
                                            {Object.keys(EFFECT_CONFIGS).map(type => (
                                                <option key={type} value={type}>{EFFECT_CONFIGS[type as EffectConfig['type']].label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.actions}>
                                    <button onClick={(e) => toggleEffect(fx.id, e)} title="Toggle On/Off">
                                        <Power size={14} color={fx.enabled ? config.color : '#666'} />
                                    </button>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeEffect(channelId, fx.id);
                                        }} title="Remove">
                                        <Trash2 size={14} />
                                    </button>
                                    {/* Chevron */}
                                    <button className={styles.chevron}>
                                        <ChevronDown size={16} color="#aaa" />
                                    </button>
                                </div>
                            </div>

                            {/* Params: Collapsible */}
                            {isExpanded && (
                                <div className={styles.params}>
                                    {Object.entries(fx.params).map(([key, val]) => (
                                        <div key={key} className={styles.paramRow}>
                                            <div className={styles.labelRow}>
                                                <span>{key}</span>
                                                <span>{val.toFixed(2)}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min={getMinValue(key)}
                                                max={getMaxValue(key)}
                                                step={getStep(key)}
                                                value={val}
                                                onChange={(e) => handleParamChange(fx.id, key, Number.parseFloat(e.target.value))}
                                                {...{ 'style': { '--accent-color': config.color } as React.CSSProperties }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                <button
                    className={styles.addBtn}
                    onClick={() => handleAddEffect('reverb')}
                    title="Add Effect"
                >
                    + Add Spice
                </button>
            </div>
        </div>
    );
};

export default FXInspector;
