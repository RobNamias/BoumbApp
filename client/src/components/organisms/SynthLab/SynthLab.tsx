import React, { useEffect, useState, useRef } from "react";
import styles from "../../../styles/modules/SynthLab.module.scss";
import { useProjectStore } from "../../../store/projectStore";
import { useProjectAudio } from "../../../hooks/useProjectAudio";
import PatternSelector from "../JuicyBox/PatternSelector";

import PianoRoll from "../PianoRoll/PianoRoll";
import SynthPanel from "../SynthPanel/SynthPanel";
import { Plus, ChevronRight, FlaskConical } from "lucide-react";
import Knob from "../../atoms/Knob";
import Led from "../../atoms/Led";
import DragInput from "../../atoms/DragInput";
import ModuleHeader from "../../molecules/ModuleHeader";

const SynthLab: React.FC = () => {
  // --- Store Access ---
  const {
    project,
    activePatterns,
    createPattern,
    setActivePattern,
    addTrack,
    updateTrackVolume,
    toggleTrackMute,
    updateTrackRouting,
  } = useProjectStore();

  // --- Audio Sync ---
  useProjectAudio(); // Essential for Audio Engine to run!

  // --- Local State ---
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const hasAutoSelected = useRef(false);

  // --- Initialization & Pattern Management ---
  const currentPatternId = activePatterns.melody;
  const currentPattern = currentPatternId
    ? project.melodicPatterns[currentPatternId]
    : null;

  // Ensure we have at least one pattern active
  useEffect(() => {
    if (!currentPatternId) {
      // Check if any exists
      const existingIds = Object.keys(project.melodicPatterns);
      if (existingIds.length > 0) {
        setActivePattern("melody", existingIds[0]);
      } else {
        // Create Default Pattern 1
        const newId = createPattern("melody", "Pattern 1");
        setActivePattern("melody", newId);
      }
    }
  }, [
    currentPatternId,
    project.melodicPatterns,
    createPattern,
    setActivePattern,
  ]);

  // --- Track Management ---
  const handleAddTrack = () => {
    // patternId is ignored for global tracks now, but we keep signature for safety or future clip init
    const newTrackId = addTrack("melody", "New Synth", "synth");
    // AudioEngine is synced via Store updates or useProjectAudio hook now.
    // We probably don't need manual sync here if addTrack triggers store update which triggers hook sync.
    // But if manual sync is needed:
    // AudioEngine.syncTrack({ id: newTrackId, type: 'synth', mixer: { volume: 0.8, pan: 0, muted: false, solo: false } });
    setSelectedTrackId(newTrackId);
  };

  // Auto-select first track if none selected (Global Tracks)
  useEffect(() => {
    const melodicTracks = Object.values(project.tracks).filter(
      (t) => t.type === "melody",
    );
    if (melodicTracks.length === 0) {
      // Create Default Track
      const newTrackId = addTrack("melody", "Lead Synth", "synth");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedTrackId(newTrackId);
      hasAutoSelected.current = true;
    } else if (!hasAutoSelected.current) {
      // Only auto-select once
      setSelectedTrackId(melodicTracks[0].id);
      hasAutoSelected.current = true;
    }
  }, [project.tracks, addTrack]);

  if (!currentPatternId || !currentPattern)
    return <div>Loading SynthLab...</div>;

  const melodicTracks = Object.values(project.tracks).filter(
    (t) => t.type === "melody",
  );

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Toolbar */}
      <ModuleHeader title="SynthLab" icon={FlaskConical} color="#4CAF50">
        {/* Pattern Selector (contextual) */}
        <div style={{ margin: "0 auto" }}>
          <PatternSelector
            activePatternId={currentPatternId}
            onSelectPattern={(id: string | null) => {
              if (id) setActivePattern("melody", id);
            }}
            patterns={Object.values(project.melodicPatterns)}
            onCreatePattern={() => {
              const nextIndex = Object.keys(project.melodicPatterns).length;
              const letter = String.fromCodePoint(65 + nextIndex);
              createPattern("melody", letter);
            }}
            color="green"
          />
        </div>
      </ModuleHeader>

      <div className={styles.content}>
        {/* Left Sidebar: Tracks */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <span>Tracks</span>
            <button
              onClick={handleAddTrack}
              className={styles.addButton}
              title="Add Synth"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className={styles.trackList}>
            {melodicTracks.map((track) => {
              const isSelected = selectedTrackId === track.id;
              // We re-use selectedTrackId as the "Expanded" state effectively
              // Or we can add a separate expansion state if we want selection != expansion.
              // For now, Click header = Select + Expand is intuitive.

              const volume = track.volume ?? 0.8;
              const muted = track.muted ?? false;
              // Output is 'insert-1' etc. Extract number for UI or show ID?
              // DragInput expects number.
              const outputStr = track.mixerChannelId || "insert-1";
              const outputValue =
                Number.parseInt(outputStr.replace("insert-", ""), 10) || 1;

              const handleVolumeChange = (val: number) => {
                updateTrackVolume(track.id, val / 100);
              };

              const handleMuteToggle = () => {
                // track.muted acts inverted relative to 'checked' true/false. But toggleTrackMute handles flipping.
                toggleTrackMute(track.id);
              };

              const handleOutputChange = (val: number) => {
                updateTrackRouting(track.id, `insert-${val}`);
              };

              return (
                <div key={track.id} className={styles.trackRow}>
                  {/* Header Row */}
                  <div
                    className={`${styles.trackHeader} ${isSelected ? styles.selected : ""}`}
                    onClick={() =>
                      setSelectedTrackId(isSelected ? null : track.id)
                    } // NOSONAR
                    role="button" // NOSONAR
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedTrackId(isSelected ? null : track.id);
                      }
                    }}
                  >
                    <div className={styles.left}>
                      <div
                        className={`${styles.icon} ${isSelected ? styles.open : ""}`}
                      >
                        <ChevronRight size={14} />
                      </div>
                      <button
                        className={styles.muteBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMuteToggle();
                        }}
                        title={muted ? "Unmute" : "Mute"}
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          display: "flex",
                        }}
                      >
                        <Led active={!muted} color="#4CAF50" size={8} />
                      </button>
                      <span className={styles.name}>
                        {track.name || `Track ${track.id.slice(0, 4)}`}
                      </span>
                    </div>

                    <div
                      className={styles.controls}
                      onClick={(e) => e.stopPropagation()} // NOSONAR
                      onKeyDown={(e) => e.stopPropagation()} // NOSONAR
                    >
                      {/* Volume */}
                      <div
                        style={{
                          transform: "scale(0.8)",
                          transformOrigin: "center",
                        }}
                      >
                        <Knob
                          value={volume * 100}
                          onChange={handleVolumeChange}
                          size={28}
                          min={0}
                          max={100}
                          label="Vol"
                        />
                      </div>
                      {/* Output */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "2px",
                        }}
                      >
                        <span style={{ fontSize: "0.6rem", color: "#666" }}>
                          CI
                        </span>
                        <DragInput
                          value={outputValue}
                          onChange={handleOutputChange}
                          min={1}
                          max={10}
                          label=""
                        />
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Drawer */}
                  <div
                    className={`${styles.trackDrawer} ${isSelected ? styles.open : ""}`}
                  >
                    {isSelected && <SynthPanel trackId={track.id} />}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main: Piano Roll */}
        <main className={styles.mainArea}>
          {selectedTrackId ? (
            <PianoRoll trackId={selectedTrackId} patternId={currentPatternId} />
          ) : (
            <div className={styles.emptyState}>Select or Create a Track</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SynthLab;
