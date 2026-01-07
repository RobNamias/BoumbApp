# Plan Détaillé : Synthétiseurs & Mélodie

**Objectif** : Étendre les capacités de Boumb'App au-delà du rythmique en ajoutant un moteur de synthèse polyphonique et une interface mélodique (Piano Roll).

## 1. Moteur Audio (Tone.js)
*   **PolySynth** : Utilisation de `Tone.PolySynth` pour gérer la polyphonie (accords).
*   **Architecture** :
    *   Chaque piste Mélodique possède son instance `PolySynth`.
    *   Chaîne d'effets dédiée (Insert FX).

## 2. Interface Utilisateur (UI)
### Stratégie de Réutilisation (JuicyBox-like)
L'environnement Synthétiseur reprend la structure ergonomique du Séquenceur (`JuicyBox`) :
*   **Contrôles Globaux** : Reuse `TransportControls` et `Pagination`.
*   **Zone Édition (Piano Roll)** : Grille défilante (X) et hauteur (Y), 128 pas (32 temps), naviguable par "Pages" (identique JuicyBox : 4 pages de 32 pas).
*   **Zone Paramètres (SynthPanel)** : Zone latérale ou supérieure dédiée au Sound Design.

### Composants Clés
*   **`SynthLayout`** (Template) : Structure globale de la page Synthé.
*   **`PianoRoll`** (Organism) :
    *   **Grille** : Canvas ou DOM ? (À décider selon perf, DOM pour MVP).
    *   **Navigation** : Intègre `Pagination` pour gérer les 128 pas.
    *   **NoteItem** : Molécule redimensionnable (Drag & Drop).
*   **`SynthPanel`** (Organism) :
    *   Composé d'`Atoms` existants : `Knob`, `Switch`, `Select`.
    *   **Visualisation** : `ADSRGraph` (Canvas).
    *   **Sections** : Oscillateurs, Filtre, LFO.

## 3. Stratégie d'Implémentation
### Phase 1 : Core Audio (TDD)
*   **Extension Track** : Ajout du type `synth` et propriété `notes`.
*   **Structure Note** : `{ pitch: string (ex: "C4"), startTime: number (16n), duration: number (16n), velocity: number }`.

