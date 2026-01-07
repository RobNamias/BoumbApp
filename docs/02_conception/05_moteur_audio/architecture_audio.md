# Architecture Audio (Moteur Sonore)

Ce document décrit l'architecture technique et fonctionnelle du moteur audio de Boumb'App. Il sert de **référence unique** pour l'implémentation avec **Tone.js**.

## 1. Vue d'Ensemble
L'application repose sur un **AudioEngine** (Singleton) qui encapsule toute la logique Tone.js. React ne manipule jamais directement les nœuds audio, mais communique avec l'Engine via des Hooks ou un Store.

*   **Framework Audio** : [Tone.js](https://tonejs.github.io/) (Wrapper Web Audio API).
*   **Contexte** : Persistent, démarré au premier clic utilisateur ("Start Audio").
*   **Horloge** : `Tone.Transport` gère le BPM et la boucle principale (Scheduling).

## 2. Schéma Global des Flux (Signal Flow)
Le graphe audio suit une structure hiérarchique stricte : **Sources \> Insert FX \> Canal (Vol/Pan) \> Bus (Optionnel) \> Master**.

```mermaid
graph LR
    subgraph Sources
        JB[JuicyBox (8 Pistes)]
        S1[Synth 1]
        S2[Synth 2]
    end

    subgraph Mixer Routing
        CI1[Channel Individuel 1]
        CI2[Channel Individuel 2]
        CI3[Channel Individuel 3]
    end

    subgraph Buses
        CG1[Channel Group 1]
        CG2[Channel Group 2]
    end

    subgraph Output
        Master[Channel Master (Limiter)]
        Dest((Enceintes))
    end

    %% Connexions
    JB --"Piste 1"--> CI1
    JB --"Piste 2"--> CI2
    S1 --> CI3

    CI1 --> CG1
    CI2 --> CG1
    CI3 --> Master

    CG1 --> Master
    CG2 --> Master

    Master --> Dest

    style JB fill:#f9f,stroke:#333
    style Master fill:#f66,stroke:#333
```

## 3. Flux Détaillés

### 3.1 JuicyBox (Boîte à Rythme)
Chaque piste de la JuicyBox possède sa propre chaîne de traitement interne avant d'atteindre le Mixer.

1.  **Trigger** : `Tone.Transport` déclenche l'événement au temps *t*.
2.  **Logic** : Vérification `Step.active` && `Probability`.
3.  **Source** : `Tone.Sampler` (Lecture fichier .wav/.ogg).
4.  **Velocity** : Gain appliqué à la note (`vel * 127` -> Gain).
5.  **Channel Strip (Interne)** :
    *   `Volume` (Knob Piste)
    *   `Mute` (Bypass Piste)
    *   `Solo` (Logique logicielle)
6.  **Global Strip** :
    *   `Master Volume` (Gain global JuicyBox)
    *   `Bypass Global` (Mute global)
7.  **Sortie** : Vers le nœud d'entrée du **Channel Individuel (CI)** assigné.

### 3.2 Mixer (Table de Mixage)
Le Mixer centralise tous les signaux. Il existe 3 types de canaux avec des flux spécifiques.

#### A. Channel Individuel (CI)
*Sources : Pistes de JuicyBox, Synthétiseurs.*

1.  **Entrée (Gain)** : Sommation des sources assignées.
2.  **Inserts (FX Chain)** : Série d'effets (Reverb, Delay...). Chaque effet possède son propre **Bypass**.
3.  **Custom Stereo Panner** : Remplacement de `Tone.PanVol` (qui utilise `Tone.Panner` 3D) par une architecture manuelle : `Split` (L/R) -> `Gain L` + `Gain R` -> `Merge`.
    *   *Objectif* : Garantir un panning Stéréo 2D strict (Balance) sans artefacts de spatialisation ou d'atténuation de distance.
    *   *Logique* : Linear Balance (Centre: L=1/R=1, Coté: L=1/R=0).
4.  **Mute (Gain)** : Coupe le signal (Silence) de manière explicite post-fader.
5.  **Splitter** : Séparation du signal L/R pour le metering.
6.  **Vu-Mètre** : Visualisation précise du niveau de sortie (Stéréo L/R).
7.  **Sortie** : Vers **Master (CM)** ou **Groupe (CG)** (Sélectionnable).

#### B. Channel Group (CG)
*Sources : Channels Individuels (CI).*

1.  **Entrée** : Sommation des CI routés vers ce groupe.
2.  **Inserts (FX Chain)** : Effets de traitement de bus (ex: Compresseur "Glue").
3.  **PanVol** : Volume et Panoramique du groupe.
4.  **Mute (Gain)** : Coupe le groupe.
5.  **Splitter & Mètres** : Analyse du signal stéréo.
6.  **Sortie** : Vers **Master (CM)** (Unique destination).

#### C. Channel Master (CM)
*Sources : Channels Individuels (CI) et Groupes (CG).*

1.  **Entrée** : Sommation de tout le mix.
2.  **Inserts (FX Chain)** : Effets de Mastering.
3.  **PanVol** : Volume final et Balance.
4.  **Mute (Gain)** : Coupe générale.
5.  **Splitter & Mètres** : Analyse L/R pour les visualisateurs Master.
6.  **Sortie (Destination)** : Carte son / Enceintes (`Tone.Destination`).

### 3.3 Synthétiseur (PolySynth)
Structure inspirée des synthés analogiques classiques.

1.  **Entrée MIDI** : Note (Hauteur + Durée) reçue du Piano Roll ou d'un contrôleur.
2.  **Oscillateurs (Source)** : Génération de la forme d'onde (`Tone.OmniOscillator`).
    *   *Paramètre* : Waveform (Sine, Square, Sawtooth, Triangle).
3.  **Enveloppe (ADSR)** : Sculpture de l'amplitude dans le temps (`Tone.AmplitudeEnvelope`).
    *   `Attack`, `Decay`, `Sustain`, `Release`.
4.  **Volume Synthétiseur** : Gain de sortie de l'instrument.
5.  **Bypass** : Mute de l'instrument.
6.  **Sortie** : Vers le nœud d'entrée du **Channel Individuel (CI)** assigné.

## 4. Stratégie Technique

### 4.1 AudioEngine (Singleton)
Fichier : `client/src/audio/AudioEngine.js`

Ce module exporte une instance unique qui contient :
*   `tracks`: Map<ID, ChannelObject>
*   `transport`: Référence à Tone.Transport
*   `master`: Référence au Master Channel

**Responsabilités :**
*   Charger les Samples (Promise.all).
*   Créer/Détruire les nœuds audio.
*   Appliquer les changements de paramètres (ex: `setVolume(trackId, val)`).
*   Gérer le Cycle de vie (Suspend/Resume Context).

### 4.2 Pont React (Hooks)
Fichier : `client/src/hooks/useAudioEngine.js`

*   S'abonne aux changements du Store Zustand (ex: `state.juicyBox.tracks[0].volume`).
*   Appelle impérativement les méthodes de `AudioEngine` quand le state change.
    *   *Exemple* : `useEffect(() => AudioEngine.setTrackVolume(id, volume), [volume])`
*   Gère la boucle de `requestAnimationFrame` pour les visualisateurs (Vumètres, Scope).

### 4.3 Gestion du Temps (Scheduling)
Utilisation exclusive de `Tone.Transport`.
*   **Lookahead** : Tone.js gère le scheduling précis, React ne sert qu'à l'affichage "approximatif" (LEDs).
*   **Boucle** : `Tone.Transport.scheduleRepeat((time) => { ... }, "16n")`.
*   **Contrainte MVP** : La boucle est fixée à **32 pas (2 mesures)** pour simplifier la synchronisation Patterns/Audio.
*   **Synchro UI** : Dans le callback audio, on schedule une fonction `Tone.Draw.schedule(() => updateReactState(), time)` pour synchroniser parfaitement l'affichage avec le son entendu.

## 5. Effets & Primitives Tone.js
Liste des objets Tone.js utilisés pour le MVP :
*   **Sampler** : `Tone.Sampler`
*   **Synth** : `Tone.PolySynth` (Synthwave / FM)
*   **Reverb** : `Tone.Reverb`
*   **Delay** : `Tone.FeedbackDelay`
*   **Distortion** : `Tone.Distortion`
*   **EQ** : `Tone.EQ3` (ou EQ multibande custom)
*   **Compressor** : `Tone.Compressor` (Master Bus)
