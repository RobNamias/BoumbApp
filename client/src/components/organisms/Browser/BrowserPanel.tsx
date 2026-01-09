import React, { useEffect, useState } from 'react';
import styles from '../../../styles/modules/BrowserPanel.module.scss';
import { Package, FileAudio, ChevronDown, ChevronRight } from 'lucide-react';
import DraggableResource from '../../molecules/DraggableResource';
import audioInstance from '../../../audio/AudioEngine';
import { useLoadingStore } from '../../../store/loadingStore';

interface KitSampleMap {
    [key: string]: string;
}

interface KitData {
    name: string;
    samples: KitSampleMap;
}

interface KitsManifest {
    kits: Record<string, KitData>;
}

// Translation Map
const SAMPLE_TYPE_TRANSLATIONS: Record<string, string> = {
    'kick': 'Grosse Caisse',
    'snare': 'Caisse Claire',
    'closedHat': 'Hi-Hat Fermé',
    'openHat': 'Hi-Hat Ouvert',
    'crash': 'Cymbale Crash',
    'tom': 'Tom',
    'perc': 'Percussion'
};

const BrowserPanel: React.FC = () => {
    const [kits, setKits] = useState<Record<string, KitData>>({});
    // State for expanded categories
    // Default: Only first category expanded to save space
    const [expandedKits, setExpandedKits] = useState<Record<string, boolean>>({});

    useEffect(() => {
        console.log("BrowserPanel: Mounting and fetching kits...");

        // Fetch kits.json from public folder
        useLoadingStore.getState().setLoading(true, 'Chargement de la bibliothèque...');
        const baseUrl = import.meta.env.BASE_URL;
        // Ensure valid path concatenation
        const manifestUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}samples/kits.json`;

        console.log("Fetching manifest from:", manifestUrl);

        fetch(manifestUrl)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then((data: KitsManifest) => {
                console.log("BrowserPanel: Kits Loaded", data);
                setKits(data.kits);
                // Expand all by default for now
                const initialExpanded: Record<string, boolean> = {};
                // Only expand the first kit by default
                const keys = Object.keys(data.kits);
                if (keys.length > 0) {
                    initialExpanded[keys[0]] = true;
                }
                setExpandedKits(initialExpanded);
            })
            .catch(err => {
                console.error("Failed to load kits.json", err);
                // Fallback for Debugging
                setKits({
                    'debug': {
                        name: 'DEBUG KIT (Fetch Failed)',
                        samples: { 'kick': 'debug_kick' }
                    }
                });
                setExpandedKits({ 'debug': true });
            })
            .finally(() => {
                useLoadingStore.getState().setLoading(false);
            });
    }, []);

    const toggleKit = (id: string) => {
        setExpandedKits(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className={styles.browserPanel}>
            <div className={styles.header}>
                <h3>Bibliothèque</h3>
            </div>
            <div className={styles.content}>

                {Object.entries(kits).map(([kitId, kit]) => (
                    <div key={kitId} className={styles.kitSection}>
                        {/* Kit Header (NOT Draggable anymore) */}
                        <div className={styles.kitHeader} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '6px' }}>
                            <div
                                role="button"
                                tabIndex={0}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, outline: 'none' }}
                                onClick={(e) => { e.stopPropagation(); toggleKit(kitId); }}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleKit(kitId); }}
                            >
                                {expandedKits[kitId] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                <Package size={14} color="#ff5722" /> {/* JuicyBox Orange for Kits */}
                                <span style={{ fontWeight: 600, fontSize: '13px' }}>{kit.name}</span>
                            </div>
                        </div>

                        {/* Samples List */}
                        {expandedKits[kitId] && (
                            <div className={styles.sampleList}>
                                {Object.entries(kit.samples).map(([type, path]) => {
                                    // Prepend BASE_URL to ensure path is absolute relative to app root
                                    const baseUrl = import.meta.env.BASE_URL;
                                    // Remove leading slash from path if present to avoid double slash if needed, 
                                    // but kits.json usually has relative paths like "samples/..."
                                    // If baseUrl is "/" and path is "samples/...", result "/samples/..."
                                    // If baseUrl is "/BoumbApp/" and path is "samples/...", result "/BoumbApp/samples/..."
                                    const fullPath = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}${path}`;

                                    return (
                                        <DraggableResource
                                            key={`${kitId}-${type}`}
                                            id={`sample-${kitId}-${type}`}
                                            data={{ type: 'sample', kitId, sampleType: type, path: fullPath }}
                                            className={styles.sampleItem}
                                        >
                                            <div
                                                style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}
                                                onClick={() => audioInstance.previewSample(fullPath)} // Preview on Click
                                            >
                                                <FileAudio size={12} color="#888" />
                                                <span>{SAMPLE_TYPE_TRANSLATIONS[type] || type}</span>
                                            </div>
                                        </DraggableResource>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}

            </div>
        </div>
    );
};

export default BrowserPanel;
