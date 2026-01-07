# Plan Détaillé 15 : The Sauce (Mixer & FX)

**Statut** : 🟢 Terminé
**Date** : 27/12/2025
**Réf. Architecture** : `docs/08_planification/03_plans_detailles/14_refonte_audio_v2.md`

## 1. Vision
Créer une table de mixage (Mixer) fonctionnelle permettant :
1.  **Routing (CI)** : Assigner des pistes à des canaux spécifiques (CI 1-10 -> Group 1-4 -> Master).
2.  **Effets (FX)** : Insérer des effets (Reverb, Delay, Disto, Chorus) sur chaque insert.
3.  **Mixage** : Contrôler Volumes, Panoramiques et Mutes (True Mute via `muteGain`) de manière centralisée.

## 2. Spécifications Techniques

### 2.1 Modèle de Données (Store)
Mise à jour de `AudioTrack` dans `projectStore.ts` :
```typescript
interface EffectConfig {
    id: string;
    type: 'reverb' | 'delay' | 'distortion' | 'chorus';
    enabled: boolean;
    params: Record<string, number>; // ex: { decay: 0.5, mix: 0.2 }
}

interface TrackMixer {
    // ... existant (vol, pan, mute)
    effects: EffectConfig[]; // Chaîne d'effets ordonnée
}
```

### 2.2 Moteur Audio (AudioEngine)
*   **Routing (CI)** : Implémentation `inserts` (CI1..CI10).
*   **Routing (CG)** : Implémentation `groups` (CG1..CG4) recevant les CI.
*   **Flux (Signal Chain)** :
    `Source -> muteGain (Gate) -> Panner -> Destination (Insert Input)`.
    `Insert -> FX Chain -> Fader -> Group`.
*   **Chain Builder** : Méthode `rebuildChannelChain(channelId)` gère la chaîne d'effets dynamique.

### 2.3 Interface Utilisateur (FL Studio Layout)
*   **Layout Global** :
    *   **Gauche** : Master Channel (CM) + Spectrum Analyzer.
    *   **Centre** : Group Channels (CG 1-4) + Insert Channels (CI 1-10).
    *   **Droite** : Inspector Panel (FX Rack) pour le channel sélectionné.
*   **ChannelStrip** :
    *   Fader vertical (0-1) + Vu-mètre dynamique.
    *   Pan Knob + Output Routing Selector.
    *   Label "CI X", "Group X", "Master".

## 3. Stratégie d'Implémentation (Workflows)

### Étape 1 : Data & Store (@/tdd) [DONE]
1.  **Test** : `projectStore.test.ts` -> Vérifier l'ajout/suppression d'effets.
2.  **Implémentation** : Actions `addChannelEffect`, `removeChannelEffect`, `updateChannelEffect`.

### Étape 2 : Moteur Audio (@/tdd) [DONE]
1.  **Test** : `AudioEngine` architecture refactor (3-Tier Mixer).
2.  **Implémentation** : Logic `rebuildChannelChain` et `setTrackMute` (muteGain).

### Étape 3 : Interface Utilisateur (@/newcomponent) [DONE]
1.  **Atoms** :
    *   `Fader`, `VUMeter`, `Knob`, `FXSlot`.
2.  **Organisms** :
    *   `ChannelStrip` : Architecture complète.
    *   `MixerBoard` : Layout Flex 3-zones.
    *   `FXInspector` : Debugged interactions (param persistence, types).


## 4. Plan de Validation
*   **Unitaires** : Store (100%), AudioEngine (Mocked).
*   **Fonctionnel** :
    *   Ajouter Disto sur Bass Synth -> Son saturé.
    *   Changer Routing Bass Synth vers CI2 -> Mute du CI1, Son sur CI2.
