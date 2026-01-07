# Gestion de l'État Global (State Management)

**Ce document spécifie l'architecture des données Frontend pour la Phase 8 (Assemblage).**
Il définit comment l'application gère l'état complexe d'un projet musical complet.

## 1. Philosophie : "Single Source of Truth"
L'état de l'application est centralisé dans un Store Zustand unique (`useProjectStore`), divisé en "Slices" pour la maintenabilité.
Il doit être **sérialisable** (exportable en JSON) pour la sauvegarde.

## 2. Hiérarchie des Données (Data Model - V2 "Track-First")

```mermaid
graph TD
    Project[Projet Global] --> Meta[Méta-données]
    Project --> MixerGlobal[Mixer Master]
    
    Project --> GlobalTracks[Pistes Audio Globales]
    GlobalTracks --> TrackKick[Piste Kick (Sampler)]
    GlobalTracks --> TrackSnare[Piste Snare (Sampler)]
    GlobalTracks --> TrackSynth[Piste Synth (PolySynth)]
    
    Project --> Patterns[Bibliothèque de Patterns (Séquences)]
    Patterns --> PatternA[Pattern A]
    
    PatternA --> ClipKick[Clip pour Piste Kick (Notes)]
    PatternA --> ClipSnare[Clip pour Piste Snare (Notes)]
    
    Song[Mode Song] --> Timeline[Timeline]
    Timeline --> TLClip[Timeline Clip (Ref Pattern + Time)]
```

## 3. Interfaces TypeScript (Définitions V2)

### A. Entités Fondamentales

```typescript
// Une note ou un événement musical
interface Note {
  time: string;      // "0:0:0"
  note: string;      // "C4"
  duration: string;  // "16n"
  velocity: number;  // 0-1 (Force de la frappe)
  fill?: number;     // 0-1 (Probabilité de jeu)
}

// Configuration d'un Instrument (Sampler ou Synth)
interface InstrumentConfig {
  type: 'sampler' | 'synth';
  sampleId?: string; // Pour Sampler
  synthType?: 'fmsynth' | 'polysynth'; // Pour Synth
  presets?: Record<string, any>;
}

// Une Piste Globale (L'Instrument et le Canal de Mixage)
interface AudioTrack {
  id: string; // UUID
  name: string; // "Kick 1", "Lead Synth"
  type: 'drums' | 'melody'; // Helper pour UI
  instrument: InstrumentConfig;
  mixer: {
    volume: number; // Fader global
    pan: number;
    muted: boolean;
    solo: boolean;
    output?: string; // Bus de sortie
  };
}

// Un Pattern (Juste une partition, SANS instruments)
interface Pattern {
  id: string; // UUID
  name: string; // "Intro Drum", "Bassline A"
  duration: number; // en mesures
  // Clips : Mapping TrackID -> Array of Notes
  clips: Record<string, Note[]>; 
}
```

### B. Structure du Projet (Arrangement)

```typescript
// Le Projet Complet
interface ProjectData {
  id: string;
  version: 2; // Bump version pour migration
  meta: {
    title: string;
    bpm: number;
    swing: number;
  };

  // 1. Les Pistes (Le Studio)
  // Liste dynamique de pistes (ex: 6 pistes Drums + 4 pistes Synth)
  tracks: Record<string, AudioTrack>; 
  
  // 2. Les Patterns (Les Partitions)
  // Séparés par type pour commodité UI, mais structurellement identiques
  drumPatterns: Record<string, Pattern>; 
  melodicPatterns: Record<string, Pattern>;
  
  // 3. Arrangement (Timeline)
  timeline: {
    clips: TimelineClip[]; // Liste unifiée de clips sur la timeline
  };
  
   // État de lecture (Patterns actifs en mode boucle)
  activePatterns: {
    drums: string | null;  
    melody: string | null;
  };
}
```

## 4. Architecture du Store (Zustand)

Le Store `useProjectStore` est composé de plusieurs Slices :

### 4.1 `TransportSlice`
Gère le temps qui passe.
*   `isPlaying`: boolean
*   `bpm`: number
*   `currentStep`: string ("0:0:0")
*   Actions: `play()`, `stop()`, `setBpm()`

### 4.2 `ProjectDataSlice` (CRUD)
Gère la structure.
*   `project`: ProjectData
*   Actions:
    *   `loadProject(json)`
    *   `createPattern(name)`
    *   `duplicatePattern(id)`
    *   `addClipToTimeline(patternId, time)`

### 4.3 `SessionSlice` (UI State)
Gère l'interface volatile.
*   `selectedPatternId`: string (Quel pattern on édite dans la JuicyBox ?)
*   `selectedTrackId`: string (Quelle piste on édite dans le SynthLab ?)

## 5. Migration depuis `useTracksStore`
L'actuel `useTracksStore` deviendra obsolète.
*   Sa logique de lecture audio sera déplacée dans le `AudioEngine` qui s'abonnera désormais au `useProjectStore`.
*   **Challenge** : Le `AudioEngine` devra être capable de "Hot Swapper" les séquences quand on change de Pattern.

## 6. Stratégie de Test (TDD)
1.  Créer `projectStore.test.ts`.
2.  Test 1 : `it('should load a project from JSON')`.
3.  Test 2 : `it('should create a new empty pattern')`.
4.  Test 3 : `it('should add a track to a pattern')`.
